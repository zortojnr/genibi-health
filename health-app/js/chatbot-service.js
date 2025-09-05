// GENIBI AI Chatbot Service - Production Ready
class ChatbotService {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.conversationHistory = [];
        this.userContext = {};
        this.emergencyKeywords = [
            'suicide', 'kill myself', 'end my life', 'want to die', 'hurt myself',
            'emergency', 'crisis', 'help me', 'urgent', 'can\'t cope', 'desperate'
        ];
        this.initializeAI();
    }

    // Initialize AI service
    initializeAI() {
        // In production, this would connect to OpenAI, Dialogflow, or custom AI service
        console.log('🤖 GENIBI AI Chatbot initialized');
        this.loadUserContext();
    }

    // Generate unique session ID
    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load user context for personalization
    async loadUserContext() {
        const user = authService.getCurrentUser();
        if (user && !user.isDemo) {
            this.userContext = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isDemo: false
            };

            // Load recent health data for context
            try {
                const recentMoods = await backendService.getMoods(5);
                const recentVitals = await backendService.getVitalSigns(3);
                const medications = await backendService.getMedications();
                
                this.userContext.recentMoods = recentMoods;
                this.userContext.recentVitals = recentVitals;
                this.userContext.medications = medications.filter(med => med.active);
            } catch (error) {
                console.warn('⚠️ Could not load user health context:', error);
            }
        } else {
            this.userContext = {
                firstName: 'there',
                isDemo: true
            };
        }
    }

    // Process user message and generate response
    async processMessage(userMessage) {
        try {
            // Save user message
            await this.saveMessage(userMessage, 'user');
            
            // Check for emergency keywords
            if (this.detectEmergency(userMessage)) {
                const emergencyResponse = this.generateEmergencyResponse();
                await this.saveMessage(emergencyResponse, 'bot');
                return emergencyResponse;
            }
            
            // Generate AI response
            const botResponse = await this.generateResponse(userMessage);
            await this.saveMessage(botResponse, 'bot');
            
            return botResponse;
        } catch (error) {
            console.error('❌ Error processing message:', error);
            const fallbackResponse = this.getFallbackResponse();
            await this.saveMessage(fallbackResponse, 'bot');
            return fallbackResponse;
        }
    }

    // Detect emergency situations
    detectEmergency(message) {
        const lowerMessage = message.toLowerCase();
        return this.emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
    }

    // Generate emergency response
    generateEmergencyResponse() {
        const userName = this.userContext.firstName;
        return `${userName}, I'm concerned about what you've shared. Your safety is the most important thing right now. Please reach out for immediate help:

🚨 **Emergency Support:**
• Call our 24/7 helpline: +234 806 027 0792
• If this is a medical emergency, call emergency services immediately
• You can also text "HELLO" to 741741 for crisis support

You don't have to go through this alone. There are people who want to help you. Would you like me to provide more resources or help you connect with someone right now?`;
    }

    // Generate AI response based on user input
    async generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const userName = this.userContext.firstName;
        
        // Health-specific responses
        if (message.includes('stress') || message.includes('anxiety') || message.includes('worried')) {
            return this.generateStressResponse(userName);
        }
        
        if (message.includes('medication') || message.includes('pills') || message.includes('prescription')) {
            return this.generateMedicationResponse(userName);
        }
        
        if (message.includes('appointment') || message.includes('doctor') || message.includes('schedule')) {
            return this.generateAppointmentResponse(userName);
        }
        
        if (message.includes('mood') || message.includes('feeling') || message.includes('sad') || message.includes('happy')) {
            return this.generateMoodResponse(userName);
        }
        
        if (message.includes('vital') || message.includes('heart') || message.includes('pressure') || message.includes('health')) {
            return this.generateVitalsResponse(userName);
        }
        
        if (message.includes('sleep') || message.includes('tired') || message.includes('insomnia')) {
            return this.generateSleepResponse(userName);
        }
        
        if (message.includes('exercise') || message.includes('fitness') || message.includes('workout')) {
            return this.generateExerciseResponse(userName);
        }
        
        if (message.includes('diet') || message.includes('nutrition') || message.includes('eating')) {
            return this.generateNutritionResponse(userName);
        }
        
        // Greeting responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.generateGreetingResponse(userName);
        }
        
        // Thank you responses
        if (message.includes('thank') || message.includes('thanks')) {
            return this.generateThankYouResponse(userName);
        }
        
        // Default personalized response
        return this.generateDefaultResponse(userName, userMessage);
    }

    // Specific response generators
    generateStressResponse(userName) {
        const responses = [
            `${userName}, I understand you're feeling stressed. Here are some techniques that can help:

🧘 **Immediate Relief:**
• Take 5 deep breaths (4 seconds in, 6 seconds out)
• Try the 5-4-3-2-1 grounding technique
• Step outside for fresh air if possible

📱 **GENIBI Tools:**
• Use our Mood Tracker to log how you're feeling
• Check your Vital Signs to monitor stress impact
• Schedule an appointment if stress persists

Would you like me to guide you through a breathing exercise?`,

            `${userName}, stress is your body's natural response, and it's okay to feel this way. Let's work on managing it together:

💡 **Quick Stress Busters:**
• Progressive muscle relaxation
• Listen to calming music
• Write down 3 things you're grateful for

🔗 **Get Support:**
• Call our helpline: +234 806 027 0792
• Talk to a trusted friend or family member
• Consider professional counseling

How long have you been feeling stressed?`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateMedicationResponse(userName) {
        const userMeds = this.userContext.medications || [];
        let response = `${userName}, I can help you with medication-related questions. `;
        
        if (userMeds.length > 0) {
            response += `I see you have ${userMeds.length} medication(s) in your profile. `;
        }
        
        response += `

💊 **Medication Management:**
• Use GENIBI's Medication tracker to set reminders
• Never stop medications without consulting your doctor
• Keep a list of all medications and dosages
• Report any side effects to your healthcare provider

⚠️ **Important:** Always consult your healthcare provider for medication questions. For urgent medication concerns, call +234 806 027 0792.

Would you like help setting up medication reminders?`;
        
        return response;
    }

    generateAppointmentResponse(userName) {
        return `${userName}, I can help you with appointment scheduling:

📅 **Booking Appointments:**
• Use GENIBI's Appointment feature to track visits
• Call our helpline: +234 806 027 0792 to schedule
• Prepare questions before your appointment
• Bring your medication list and health records

🏥 **Types of Appointments:**
• General consultation
• Mental health counseling
• Specialist referrals
• Follow-up visits

Would you like me to help you prepare for an upcoming appointment or schedule a new one?`;
    }

    generateMoodResponse(userName) {
        const recentMoods = this.userContext.recentMoods || [];
        let response = `${userName}, tracking your mood is important for mental wellness. `;
        
        if (recentMoods.length > 0) {
            const lastMood = recentMoods[0];
            response += `I see your last mood entry was "${lastMood.mood}". `;
        }
        
        response += `

😊 **Mood Tracking Benefits:**
• Identify patterns and triggers
• Monitor progress over time
• Share insights with healthcare providers
• Develop coping strategies

🎯 **Mood Improvement Tips:**
• Regular exercise and sleep
• Connect with supportive people
• Practice mindfulness or meditation
• Engage in activities you enjoy

Use GENIBI's Mood Tracker to log how you're feeling today. How would you describe your current mood?`;
        
        return response;
    }

    generateVitalsResponse(userName) {
        return `${userName}, monitoring your vital signs is crucial for health awareness:

💓 **Key Vital Signs:**
• Heart rate (60-100 BPM normal)
• Blood pressure (120/80 mmHg ideal)
• Temperature (98.6°F normal)
• Weight and BMI

📊 **Using GENIBI's Vital Signs:**
• Record readings regularly
• Track trends over time
• Share data with your doctor
• Set reminders for monitoring

⚠️ **When to Seek Help:**
• Chest pain or irregular heartbeat
• Very high or low blood pressure
• Persistent fever
• Sudden weight changes

Would you like to record your vital signs now?`;
    }

    generateSleepResponse(userName) {
        return `${userName}, good sleep is essential for mental and physical health:

😴 **Sleep Hygiene Tips:**
• Aim for 7-9 hours per night
• Keep a consistent sleep schedule
• Create a relaxing bedtime routine
• Avoid screens 1 hour before bed

🌙 **Better Sleep Environment:**
• Cool, dark, and quiet room
• Comfortable mattress and pillows
• No caffeine 6 hours before bed
• Regular exercise (but not before bed)

If sleep problems persist, consider talking to a healthcare provider. Would you like help creating a sleep routine?`;
    }

    generateExerciseResponse(userName) {
        return `${userName}, regular exercise is great for both physical and mental health:

🏃 **Exercise Benefits:**
• Reduces stress and anxiety
• Improves mood and energy
• Strengthens heart and muscles
• Enhances sleep quality

💪 **Getting Started:**
• Start with 10-15 minutes daily
• Choose activities you enjoy
• Walk, dance, swim, or bike
• Gradually increase intensity

🎯 **GENIBI Wellness:**
• Track your activities
• Set achievable goals
• Monitor progress
• Celebrate achievements

What type of physical activity do you enjoy most?`;
    }

    generateNutritionResponse(userName) {
        return `${userName}, good nutrition supports both physical and mental health:

🥗 **Healthy Eating Tips:**
• Eat regular, balanced meals
• Include fruits and vegetables
• Stay hydrated (8 glasses water/day)
• Limit processed foods and sugar

🧠 **Foods for Mental Health:**
• Omega-3 rich fish
• Leafy green vegetables
• Nuts and seeds
• Whole grains

⚠️ **Nutrition & Mood:**
• Skipping meals can affect mood
• Blood sugar spikes impact energy
• Some foods can trigger anxiety

Would you like tips for meal planning or healthy recipes?`;
    }

    generateGreetingResponse(userName) {
        const greetings = [
            `Hello ${userName}! I'm your GENIBI AI Health Assistant. I'm here to support your health and wellness journey. How can I help you today?`,
            `Hi ${userName}! Welcome to GENIBI. I'm here to provide health guidance, answer questions, and help you navigate your wellness journey. What's on your mind?`,
            `Hey ${userName}! Great to see you. I'm your AI health companion, ready to help with any health-related questions or concerns. How are you feeling today?`
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    generateThankYouResponse(userName) {
        const responses = [
            `You're very welcome, ${userName}! I'm here whenever you need support or have health questions. Take care of yourself! 💚`,
            `Happy to help, ${userName}! Remember, your health and wellbeing are important. Don't hesitate to reach out anytime. 🌟`,
            `My pleasure, ${userName}! I'm always here to support your health journey. Wishing you wellness and happiness! 😊`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDefaultResponse(userName, userMessage) {
        return `Thank you for sharing that, ${userName}. I'm here to help with your health and wellness needs. 

🤖 **I can assist with:**
• Health questions and guidance
• Medication reminders and tracking
• Appointment scheduling
• Mood and vital signs monitoring
• Stress management techniques
• General wellness tips

💬 **For immediate support:**
• Call our 24/7 helpline: +234 806 027 0792
• Use GENIBI's health tracking features
• Schedule an appointment with a healthcare provider

Is there a specific health topic you'd like to discuss or a GENIBI feature you'd like help with?`;
    }

    // Get fallback response for errors
    getFallbackResponse() {
        const userName = this.userContext.firstName;
        return `I apologize, ${userName}. I'm having trouble processing your message right now. 

🔧 **You can still:**
• Call our 24/7 helpline: +234 806 027 0792
• Use GENIBI's health tracking features
• Try asking your question again

I'm here to help with your health and wellness needs. Please try again or contact our support team if the issue persists.`;
    }

    // Save message to conversation history
    async saveMessage(message, sender) {
        const messageData = {
            message,
            sender,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
        };
        
        this.conversationHistory.push(messageData);
        
        // Save to backend if user is authenticated
        if (authService.isAuthenticated() && !authService.isDemoMode()) {
            try {
                await backendService.saveChatMessage(messageData);
            } catch (error) {
                console.warn('⚠️ Could not save chat message:', error);
            }
        }
    }

    // Get conversation history
    async getConversationHistory() {
        if (authService.isAuthenticated() && !authService.isDemoMode()) {
            try {
                return await backendService.getChatHistory(this.sessionId);
            } catch (error) {
                console.warn('⚠️ Could not load chat history:', error);
            }
        }
        
        return this.conversationHistory;
    }

    // Start new conversation
    startNewConversation() {
        this.sessionId = this.generateSessionId();
        this.conversationHistory = [];
        console.log('🆕 New conversation started');
    }

    // Get session ID
    getSessionId() {
        return this.sessionId;
    }
}

// Create global chatbot service instance
window.chatbotService = new ChatbotService();

console.log('🤖 GENIBI AI Chatbot Service loaded');
