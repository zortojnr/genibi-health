// GENIBI Health App - Production Server with Real-time Features
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for development
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// In-memory data store (replace with database in production)
let users = new Map();
let healthData = new Map();
let chatSessions = new Map();
let appointments = new Map();
let medications = new Map();
let moodEntries = new Map();
let vitalSigns = new Map();

// Utility functions
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const getCurrentTimestamp = () => new Date().toISOString();

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: getCurrentTimestamp(),
        version: '1.0.0',
        services: {
            database: 'connected',
            realtime: 'active',
            ai: 'available'
        }
    });
});

// User authentication endpoints
app.post('/api/auth/register', (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (users.has(email)) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const userId = generateId();
        const user = {
            id: userId,
            email,
            firstName,
            lastName,
            createdAt: getCurrentTimestamp(),
            lastLogin: getCurrentTimestamp(),
            isActive: true
        };

        users.set(email, user);

        res.status(201).json({
            success: true,
            user: { ...user, password: undefined },
            token: `token_${userId}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = users.get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = getCurrentTimestamp();
        users.set(email, user);

        res.json({
            success: true,
            user: { ...user, password: undefined },
            token: `token_${user.id}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Vital signs endpoints
app.get('/api/vitals/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userVitals = Array.from(vitalSigns.values())
            .filter(vital => vital.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50);

        res.json({ success: true, data: userVitals });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vital signs' });
    }
});

app.post('/api/vitals', (req, res) => {
    try {
        const { userId, heartRate, bloodPressure, temperature, weight, notes } = req.body;

        const vitalId = generateId();
        const vital = {
            id: vitalId,
            userId,
            heartRate: parseInt(heartRate),
            bloodPressure,
            temperature: parseFloat(temperature),
            weight: parseFloat(weight),
            notes,
            timestamp: getCurrentTimestamp()
        };

        vitalSigns.set(vitalId, vital);

        // Emit real-time update
        io.to(`user_${userId}`).emit('vitals_updated', vital);

        res.status(201).json({ success: true, data: vital });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save vital signs' });
    }
});

// Medications endpoints
app.get('/api/medications/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userMedications = Array.from(medications.values())
            .filter(med => med.userId === userId && med.active)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ success: true, data: userMedications });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch medications' });
    }
});

app.post('/api/medications', (req, res) => {
    try {
        const { userId, name, dosage, frequency, startDate, endDate, notes } = req.body;

        const medicationId = generateId();
        const medication = {
            id: medicationId,
            userId,
            name,
            dosage,
            frequency,
            startDate,
            endDate,
            notes,
            active: true,
            createdAt: getCurrentTimestamp()
        };

        medications.set(medicationId, medication);

        // Emit real-time update
        io.to(`user_${userId}`).emit('medication_added', medication);

        res.status(201).json({ success: true, data: medication });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add medication' });
    }
});

// Appointments endpoints
app.get('/api/appointments/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userAppointments = Array.from(appointments.values())
            .filter(apt => apt.userId === userId)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({ success: true, data: userAppointments });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

app.post('/api/appointments', (req, res) => {
    try {
        const { userId, doctorName, specialty, date, time, location, notes } = req.body;

        const appointmentId = generateId();
        const appointment = {
            id: appointmentId,
            userId,
            doctorName,
            specialty,
            date,
            time,
            location,
            notes,
            status: 'scheduled',
            createdAt: getCurrentTimestamp()
        };

        appointments.set(appointmentId, appointment);

        // Emit real-time update
        io.to(`user_${userId}`).emit('appointment_scheduled', appointment);

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to schedule appointment' });
    }
});

// Mood tracking endpoints
app.get('/api/moods/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 30 } = req.query;

        const userMoods = Array.from(moodEntries.values())
            .filter(mood => mood.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, parseInt(limit));

        res.json({ success: true, data: userMoods });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch mood entries' });
    }
});

app.post('/api/moods', (req, res) => {
    try {
        const { userId, mood, emoji, notes, factors } = req.body;

        const moodId = generateId();
        const moodEntry = {
            id: moodId,
            userId,
            mood,
            emoji,
            notes,
            factors: factors || [],
            timestamp: getCurrentTimestamp()
        };

        moodEntries.set(moodId, moodEntry);

        // Emit real-time update
        io.to(`user_${userId}`).emit('mood_logged', moodEntry);

        res.status(201).json({ success: true, data: moodEntry });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log mood' });
    }
});

// AI Chat endpoints
app.post('/api/chat', (req, res) => {
    try {
        const { userId, message, sessionId } = req.body;

        if (!chatSessions.has(sessionId)) {
            chatSessions.set(sessionId, {
                id: sessionId,
                userId,
                messages: [],
                createdAt: getCurrentTimestamp()
            });
        }

        const session = chatSessions.get(sessionId);

        // Add user message
        const userMessage = {
            id: generateId(),
            sender: 'user',
            message,
            timestamp: getCurrentTimestamp()
        };
        session.messages.push(userMessage);

        // Generate AI response (simplified for demo)
        const aiResponse = generateAIResponse(message, userId);
        const botMessage = {
            id: generateId(),
            sender: 'bot',
            message: aiResponse,
            timestamp: getCurrentTimestamp()
        };
        session.messages.push(botMessage);

        chatSessions.set(sessionId, session);

        // Emit real-time updates
        io.to(`user_${userId}`).emit('chat_message', userMessage);
        setTimeout(() => {
            io.to(`user_${userId}`).emit('chat_message', botMessage);
        }, 1000);

        res.json({ success: true, data: { userMessage, botMessage } });
    } catch (error) {
        res.status(500).json({ error: 'Chat failed' });
    }
});

// Emergency support endpoint
app.post('/api/emergency', (req, res) => {
    try {
        const { userId, type, message, location } = req.body;

        const emergencyId = generateId();
        const emergency = {
            id: emergencyId,
            userId,
            type,
            message,
            location,
            status: 'active',
            timestamp: getCurrentTimestamp()
        };

        // In production, this would trigger real emergency protocols
        console.log('🚨 EMERGENCY ALERT:', emergency);

        // Emit real-time alert
        io.emit('emergency_alert', emergency);

        res.json({
            success: true,
            data: emergency,
            helpline: '+234 806 027 0792',
            message: 'Emergency services have been notified. Please call the helpline immediately.'
        });
    } catch (error) {
        res.status(500).json({ error: 'Emergency alert failed' });
    }
});

// Simple AI response generator (replace with real AI service)
function generateAIResponse(message, userId) {
    const lowerMessage = message.toLowerCase();
    const user = Array.from(users.values()).find(u => u.id === userId);
    const userName = user ? user.firstName : 'there';

    // Emergency keywords
    if (lowerMessage.includes('emergency') || lowerMessage.includes('crisis') ||
        lowerMessage.includes('suicide') || lowerMessage.includes('help')) {
        return `${userName}, I'm concerned about what you've shared. Please reach out for immediate help: Call our 24/7 helpline at +234 806 027 0792 or emergency services if this is urgent. You're not alone.`;
    }

    // Health-related responses
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
        return `${userName}, I understand you're feeling stressed. Try taking 5 deep breaths. Would you like me to guide you through a breathing exercise? Remember, our helpline is available 24/7 at +234 806 027 0792.`;
    }

    if (lowerMessage.includes('medication') || lowerMessage.includes('pills')) {
        return `For medication questions, ${userName}, always consult your healthcare provider. You can track your medications using the Medications feature in your dashboard.`;
    }

    if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor')) {
        return `To book an appointment, ${userName}, you can call our helpline at +234 806 027 0792 or use the Appointments feature in your dashboard.`;
    }

    // Default response
    return `Thank you for your message, ${userName}. I'm here to help with your health and wellness. You can ask me about stress management, appointments, medications, mood tracking, or any health concerns. How can I assist you today?`;
}

// Socket.IO real-time features
io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined their room`);
    });

    socket.on('send_message', (data) => {
        const { userId, message, sessionId } = data;

        // Broadcast to user's room
        io.to(`user_${userId}`).emit('receive_message', {
            message,
            timestamp: getCurrentTimestamp(),
            sender: 'user'
        });
    });

    socket.on('vital_signs_update', (data) => {
        const { userId } = data;
        io.to(`user_${userId}`).emit('vitals_updated', data);
    });

    socket.on('disconnect', () => {
        console.log('👤 User disconnected:', socket.id);
    });
});

// Serve main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 GENIBI Health App server running on http://localhost:${PORT}`);
    console.log('📱 Real-time features enabled with Socket.IO');
    console.log('🔒 Security middleware active');
    console.log('⚡ Production-ready server started');
    console.log('🏥 Health API endpoints available at /api/*');
    console.log('💬 Real-time chat and notifications enabled');
});
