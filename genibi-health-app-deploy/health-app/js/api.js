// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service Class
class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
        this.isOfflineMode = false;
    }

    // Check if backend is available
    async checkBackendAvailability() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                timeout: 3000
            });
            this.isOfflineMode = !response.ok;
            return response.ok;
        } catch (error) {
            this.isOfflineMode = true;
            console.warn('Backend not available, running in demo mode');
            return false;
        }
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        // Check if we're in offline mode or if backend is not available
        if (this.isOfflineMode || !(await this.checkBackendAvailability())) {
            return this.handleOfflineRequest(endpoint, options);
        }

        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed, falling back to demo mode:', error);
            return this.handleOfflineRequest(endpoint, options);
        }
    }

    // Handle requests when backend is not available (demo mode)
    handleOfflineRequest(endpoint, options = {}) {
        console.log('Demo mode: Simulating API request to', endpoint);

        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                if (endpoint === '/auth/register' || endpoint === '/auth/login') {
                    const userData = this.getDemoUserData(options.body);
                    resolve({
                        success: true,
                        data: {
                            user: userData,
                            token: 'demo-token-' + Date.now()
                        }
                    });
                } else if (endpoint === '/auth/verify') {
                    resolve({
                        success: true,
                        data: {
                            user: this.getDemoUserData()
                        }
                    });
                } else if (endpoint === '/user/dashboard') {
                    resolve({
                        success: true,
                        data: this.getDemoDashboardData()
                    });
                } else if (endpoint === '/chat/message') {
                    const body = JSON.parse(options.body || '{}');
                    resolve({
                        success: true,
                        data: {
                            sessionId: 'demo-session-123',
                            userMessage: {
                                _id: 'msg_' + Date.now(),
                                type: 'user',
                                content: body.message,
                                timestamp: new Date()
                            },
                            botMessage: {
                                _id: 'msg_' + (Date.now() + 1),
                                type: 'bot',
                                content: this.getDemoAIResponse(body.message)
                            }
                        }
                    });
                } else {
                    resolve({
                        success: true,
                        data: {},
                        message: 'Demo mode - feature not fully available'
                    });
                }
            }, 1000);
        });
    }

    // Generate demo user data
    getDemoUserData(requestBody) {
        let userData = {
            id: 'demo-user-123',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@genibi.com',
            isEmailVerified: true,
            lastLogin: new Date().toISOString()
        };

        if (requestBody) {
            try {
                const body = JSON.parse(requestBody);
                userData.firstName = body.firstName || userData.firstName;
                userData.lastName = body.lastName || userData.lastName;
                userData.email = body.email || userData.email;
            } catch (e) {
                // Use default data
            }
        }

        return userData;
    }

    // Generate demo dashboard data
    getDemoDashboardData() {
        return {
            user: {
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@genibi.com'
            },
            stats: {
                totalMoodEntries: 15,
                averageMood: 7.2,
                weeklyEntries: 5
            },
            recentActivity: [
                {
                    type: 'mood',
                    description: 'Mood logged: 8/10',
                    timestamp: new Date(Date.now() - 86400000)
                },
                {
                    type: 'exercise',
                    description: 'Exercise logged: 30 min walk',
                    timestamp: new Date(Date.now() - 172800000)
                }
            ],
            quickActions: [
                { type: 'mood', label: 'Log Mood', icon: 'smile' },
                { type: 'chat', label: 'Chat with AI', icon: 'robot' },
                { type: 'resources', label: 'View Resources', icon: 'book' },
                { type: 'emergency', label: 'Emergency Help', icon: 'phone' }
            ]
        };
    }

    // Generate demo AI responses
    getDemoAIResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm your Genibi AI Health Assistant. I'm here to help you with health questions, wellness tips, and mental health support. How are you feeling today? (Note: This is demo mode - responses are simulated)";
        } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
            return "I understand you're feeling stressed or anxious. Here are some techniques that can help: deep breathing exercises, progressive muscle relaxation, or a short walk. Would you like me to guide you through a breathing exercise? (Demo mode - for real support, please call +234 806 027 0792)";
        } else if (lowerMessage.includes('sleep')) {
            return "Sleep is crucial for your health. Try establishing a bedtime routine, avoiding screens before bed, and keeping your room cool and dark. If sleep problems persist, consider speaking with a healthcare provider. (Demo mode)";
        } else if (lowerMessage.includes('exercise')) {
            return "Regular exercise is great for both physical and mental health! Start with 30 minutes of moderate activity 3-4 times per week. What type of activities do you enjoy? (Demo mode)";
        } else if (lowerMessage.includes('appointment')) {
            return "I can help you with appointment-related questions! You can use the Appointments section in your Genibi app or call our helpline at +234 806 027 0792 for assistance. (Demo mode)";
        } else {
            const responses = [
                "Thank you for reaching out! I'm here to help with your health and wellness questions. What would you like to know about today? (Demo mode)",
                "I'm glad you're taking an active role in your health! How can I assist you with your wellness journey today? (Demo mode)",
                "That's a great question! For personalized medical advice, I recommend speaking with a healthcare provider. How else can I support you? (Demo mode)"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async verifyToken() {
        return this.request('/auth/verify');
    }

    async logout() {
        const result = await this.request('/auth/logout', {
            method: 'POST',
        });
        this.setToken(null);
        return result;
    }

    // User methods
    async getUserProfile() {
        return this.request('/user/profile');
    }

    async updateUserProfile(profileData) {
        return this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async getUserDashboard() {
        return this.request('/user/dashboard');
    }

    async getUserPreferences() {
        return this.request('/user/preferences');
    }

    async updateUserPreferences(preferences) {
        return this.request('/user/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences),
        });
    }

    async getUserActivity(limit = 20, type = null) {
        const params = new URLSearchParams({ limit });
        if (type) params.append('type', type);
        return this.request(`/user/activity?${params}`);
    }

    // Chat methods
    async sendChatMessage(message, sessionId = null) {
        return this.request('/chat/message', {
            method: 'POST',
            body: JSON.stringify({ message, sessionId }),
        });
    }

    async getChatSessions() {
        return this.request('/chat/sessions');
    }

    async getChatSession(sessionId) {
        return this.request(`/chat/sessions/${sessionId}`);
    }

    // Appointments methods
    async getAppointments(params = {}) {
        const queryParams = new URLSearchParams(params);
        return this.request(`/appointments?${queryParams}`);
    }

    async createAppointment(appointmentData) {
        return this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData),
        });
    }

    async updateAppointment(appointmentId, updates) {
        return this.request(`/appointments/${appointmentId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async cancelAppointment(appointmentId) {
        return this.request(`/appointments/${appointmentId}`, {
            method: 'DELETE',
        });
    }

    async getUpcomingAppointments() {
        return this.request('/appointments/upcoming/list');
    }

    // Wellness methods
    async getWellnessData(params = {}) {
        const queryParams = new URLSearchParams(params);
        return this.request(`/wellness?${queryParams}`);
    }

    async saveWellnessData(wellnessData) {
        return this.request('/wellness', {
            method: 'POST',
            body: JSON.stringify(wellnessData),
        });
    }

    async getTodayWellness() {
        return this.request('/wellness/today');
    }

    async logMood(moodData) {
        return this.request('/wellness/mood', {
            method: 'POST',
            body: JSON.stringify(moodData),
        });
    }

    async logExercise(exerciseData) {
        return this.request('/wellness/exercise', {
            method: 'POST',
            body: JSON.stringify(exerciseData),
        });
    }

    async getWellnessStats(period = 30) {
        return this.request(`/wellness/stats?period=${period}`);
    }

    // Health Records methods
    async getHealthRecords(params = {}) {
        const queryParams = new URLSearchParams(params);
        return this.request(`/health-records?${queryParams}`);
    }

    async createHealthRecord(recordData) {
        return this.request('/health-records', {
            method: 'POST',
            body: JSON.stringify(recordData),
        });
    }

    async updateHealthRecord(recordId, updates) {
        return this.request(`/health-records/${recordId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteHealthRecord(recordId) {
        return this.request(`/health-records/${recordId}`, {
            method: 'DELETE',
        });
    }

    async recordVitalSigns(vitalSigns) {
        return this.request('/health-records/vital-signs', {
            method: 'POST',
            body: JSON.stringify(vitalSigns),
        });
    }

    async getHealthRecordsSummary() {
        return this.request('/health-records/summary/overview');
    }

    // Mood entry methods (legacy support)
    async logMoodEntry(moodData) {
        return this.request('/user/mood-entry', {
            method: 'POST',
            body: JSON.stringify(moodData),
        });
    }

    // Utility methods
    isAuthenticated() {
        return !!this.token;
    }

    async handleAuthError() {
        this.setToken(null);
        window.location.href = '/';
    }
}

// Create global API instance
const api = new APIService();

// Export for use in other files
window.api = api;
