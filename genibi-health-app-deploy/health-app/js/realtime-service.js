// GENIBI Real-time Service - Production Ready
class RealtimeService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.eventListeners = new Map();
        this.apiBaseUrl = window.location.origin;
        this.currentUser = null;
        
        this.initializeSocket();
        this.setupEventHandlers();
    }

    // Initialize Socket.IO connection
    initializeSocket() {
        try {
            // Load Socket.IO if not already loaded
            if (typeof io === 'undefined') {
                this.loadSocketIO().then(() => {
                    this.connectSocket();
                });
            } else {
                this.connectSocket();
            }
        } catch (error) {
            console.error('❌ Failed to initialize socket:', error);
            this.fallbackToPolling();
        }
    }

    // Load Socket.IO library dynamically
    loadSocketIO() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.socket.io/4.7.4/socket.io.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Connect to Socket.IO server
    connectSocket() {
        try {
            this.socket = io(this.apiBaseUrl, {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectDelay
            });

            this.socket.on('connect', () => {
                console.log('🔗 Real-time connection established');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Join user room if authenticated
                if (this.currentUser) {
                    this.socket.emit('join_user_room', this.currentUser.id);
                }
                
                this.emit('connection_status', { connected: true });
            });

            this.socket.on('disconnect', () => {
                console.log('🔌 Real-time connection lost');
                this.isConnected = false;
                this.emit('connection_status', { connected: false });
            });

            this.socket.on('reconnect', () => {
                console.log('🔄 Real-time connection restored');
                this.isConnected = true;
                this.emit('connection_status', { connected: true });
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ Connection error:', error);
                this.handleConnectionError();
            });

            // Set up real-time event listeners
            this.setupRealtimeListeners();

        } catch (error) {
            console.error('❌ Socket connection failed:', error);
            this.fallbackToPolling();
        }
    }

    // Setup real-time event listeners
    setupRealtimeListeners() {
        if (!this.socket) return;

        // Health data updates
        this.socket.on('vitals_updated', (data) => {
            this.emit('vitals_updated', data);
            this.showNotification('Vital signs updated', 'success');
        });

        this.socket.on('medication_added', (data) => {
            this.emit('medication_added', data);
            this.showNotification('New medication added', 'success');
        });

        this.socket.on('appointment_scheduled', (data) => {
            this.emit('appointment_scheduled', data);
            this.showNotification('Appointment scheduled successfully', 'success');
        });

        this.socket.on('mood_logged', (data) => {
            this.emit('mood_logged', data);
            this.showNotification('Mood logged successfully', 'success');
        });

        // Chat messages
        this.socket.on('chat_message', (data) => {
            this.emit('chat_message', data);
        });

        this.socket.on('receive_message', (data) => {
            this.emit('receive_message', data);
        });

        // Emergency alerts
        this.socket.on('emergency_alert', (data) => {
            this.emit('emergency_alert', data);
            this.showNotification('Emergency alert received', 'error');
        });

        // System notifications
        this.socket.on('system_notification', (data) => {
            this.emit('system_notification', data);
            this.showNotification(data.message, data.type || 'info');
        });
    }

    // Set current user for real-time features
    setCurrentUser(user) {
        this.currentUser = user;
        if (this.socket && this.isConnected) {
            this.socket.emit('join_user_room', user.id);
        }
    }

    // API Methods with real-time updates

    // Authentication
    async register(userData) {
        try {
            const response = await this.apiCall('/api/auth/register', 'POST', userData);
            if (response.success) {
                this.setCurrentUser(response.user);
            }
            return response;
        } catch (error) {
            throw new Error('Registration failed: ' + error.message);
        }
    }

    async login(credentials) {
        try {
            const response = await this.apiCall('/api/auth/login', 'POST', credentials);
            if (response.success) {
                this.setCurrentUser(response.user);
            }
            return response;
        } catch (error) {
            throw new Error('Login failed: ' + error.message);
        }
    }

    // Vital Signs
    async saveVitalSigns(vitalData) {
        try {
            const response = await this.apiCall('/api/vitals', 'POST', {
                ...vitalData,
                userId: this.currentUser?.id
            });
            return response;
        } catch (error) {
            throw new Error('Failed to save vital signs: ' + error.message);
        }
    }

    async getVitalSigns() {
        try {
            if (!this.currentUser) throw new Error('User not authenticated');
            const response = await this.apiCall(`/api/vitals/${this.currentUser.id}`, 'GET');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch vital signs: ' + error.message);
        }
    }

    // Medications
    async addMedication(medicationData) {
        try {
            const response = await this.apiCall('/api/medications', 'POST', {
                ...medicationData,
                userId: this.currentUser?.id
            });
            return response;
        } catch (error) {
            throw new Error('Failed to add medication: ' + error.message);
        }
    }

    async getMedications() {
        try {
            if (!this.currentUser) throw new Error('User not authenticated');
            const response = await this.apiCall(`/api/medications/${this.currentUser.id}`, 'GET');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch medications: ' + error.message);
        }
    }

    // Appointments
    async scheduleAppointment(appointmentData) {
        try {
            const response = await this.apiCall('/api/appointments', 'POST', {
                ...appointmentData,
                userId: this.currentUser?.id
            });
            return response;
        } catch (error) {
            throw new Error('Failed to schedule appointment: ' + error.message);
        }
    }

    async getAppointments() {
        try {
            if (!this.currentUser) throw new Error('User not authenticated');
            const response = await this.apiCall(`/api/appointments/${this.currentUser.id}`, 'GET');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch appointments: ' + error.message);
        }
    }

    // Mood Tracking
    async logMood(moodData) {
        try {
            const response = await this.apiCall('/api/moods', 'POST', {
                ...moodData,
                userId: this.currentUser?.id
            });
            return response;
        } catch (error) {
            throw new Error('Failed to log mood: ' + error.message);
        }
    }

    async getMoods(limit = 30) {
        try {
            if (!this.currentUser) throw new Error('User not authenticated');
            const response = await this.apiCall(`/api/moods/${this.currentUser.id}?limit=${limit}`, 'GET');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch moods: ' + error.message);
        }
    }

    // Chat
    async sendChatMessage(message, sessionId) {
        try {
            const response = await this.apiCall('/api/chat', 'POST', {
                userId: this.currentUser?.id,
                message,
                sessionId
            });
            return response;
        } catch (error) {
            throw new Error('Failed to send chat message: ' + error.message);
        }
    }

    // Emergency
    async triggerEmergency(emergencyData) {
        try {
            const response = await this.apiCall('/api/emergency', 'POST', {
                ...emergencyData,
                userId: this.currentUser?.id
            });
            return response;
        } catch (error) {
            throw new Error('Failed to trigger emergency alert: ' + error.message);
        }
    }

    // Generic API call method
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(this.apiBaseUrl + endpoint, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Event listener error:', error);
                }
            });
        }
    }

    // Utility methods
    setupEventHandlers() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📱 App went to background');
            } else {
                console.log('📱 App came to foreground');
                if (!this.isConnected) {
                    this.reconnect();
                }
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            console.log('🌐 Back online');
            this.reconnect();
        });

        window.addEventListener('offline', () => {
            console.log('📱 Gone offline');
            this.isConnected = false;
        });
    }

    handleConnectionError() {
        this.reconnectAttempts++;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}`);
                this.reconnect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.log('❌ Max reconnection attempts reached, falling back to polling');
            this.fallbackToPolling();
        }
    }

    reconnect() {
        if (this.socket) {
            this.socket.connect();
        } else {
            this.initializeSocket();
        }
    }

    fallbackToPolling() {
        console.log('📡 Using polling fallback for real-time features');
        // Implement polling fallback for when WebSocket fails
        this.startPolling();
    }

    startPolling() {
        // Poll for updates every 30 seconds
        setInterval(async () => {
            if (this.currentUser && !this.isConnected) {
                try {
                    // Check for new data
                    const healthCheck = await this.apiCall('/api/health', 'GET');
                    if (healthCheck.status === 'healthy') {
                        this.emit('polling_update', { timestamp: new Date() });
                    }
                } catch (error) {
                    console.warn('Polling failed:', error);
                }
            }
        }, 30000);
    }

    showNotification(message, type = 'info') {
        // Emit notification event for UI to handle
        this.emit('notification', { message, type, timestamp: new Date() });
    }

    // Health check
    async checkServerHealth() {
        try {
            const response = await this.apiCall('/api/health', 'GET');
            return response;
        } catch (error) {
            throw new Error('Server health check failed: ' + error.message);
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            hasUser: !!this.currentUser
        };
    }

    // Cleanup
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
        this.currentUser = null;
        this.eventListeners.clear();
    }
}

// Create global real-time service instance
window.realtimeService = new RealtimeService();

console.log('🚀 GENIBI Real-time Service loaded');
