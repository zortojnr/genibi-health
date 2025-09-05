// GENIBI Health App - Dynamic Data Management System
// Comprehensive local storage and data persistence for all user data

class DataManager {
    constructor() {
        this.storagePrefix = 'genibi_';
        this.currentUser = null;
        this.initializeDataStructure();
    }

    // Initialize default data structure
    initializeDataStructure() {
        console.log('📊 Initializing data management system...');
        
        // Ensure all required data structures exist
        this.ensureDataStructure('user_profile', {
            personalInfo: {},
            preferences: {},
            settings: {}
        });
        
        this.ensureDataStructure('health_records', {
            vitalSigns: [],
            medicalHistory: [],
            allergies: [],
            medications: []
        });
        
        this.ensureDataStructure('appointments', []);
        this.ensureDataStructure('medications', []);
        this.ensureDataStructure('mood_data', []);
        this.ensureDataStructure('vital_signs', []);
        this.ensureDataStructure('emergency_logs', []);
        this.ensureDataStructure('chat_history', []);
        this.ensureDataStructure('notifications', []);
        this.ensureDataStructure('wellness_activities', []);
        
        console.log('✅ Data management system initialized');
    }

    // Ensure a data structure exists with default value
    ensureDataStructure(key, defaultValue) {
        const fullKey = this.storagePrefix + key;
        if (!localStorage.getItem(fullKey)) {
            localStorage.setItem(fullKey, JSON.stringify(defaultValue));
        }
    }

    // Get data with optional user-specific key
    getData(key, userSpecific = false) {
        try {
            const fullKey = userSpecific && this.currentUser ? 
                `${this.storagePrefix}${this.currentUser.uid}_${key}` : 
                `${this.storagePrefix}${key}`;
            
            const data = localStorage.getItem(fullKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting data for ${key}:`, error);
            return null;
        }
    }

    // Set data with optional user-specific key
    setData(key, value, userSpecific = false) {
        try {
            const fullKey = userSpecific && this.currentUser ? 
                `${this.storagePrefix}${this.currentUser.uid}_${key}` : 
                `${this.storagePrefix}${key}`;
            
            localStorage.setItem(fullKey, JSON.stringify(value));
            console.log(`✅ Data saved for ${key}`);
            return true;
        } catch (error) {
            console.error(`Error setting data for ${key}:`, error);
            return false;
        }
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        console.log('👤 Current user set:', user?.email);
    }

    // Health Records Management
    addVitalSigns(vitalData) {
        const vitals = this.getData('vital_signs', true) || [];
        const newVital = {
            id: 'vital_' + Date.now(),
            timestamp: new Date().toISOString(),
            ...vitalData
        };
        vitals.unshift(newVital);
        this.setData('vital_signs', vitals.slice(0, 100), true); // Keep last 100 records
        return newVital;
    }

    getVitalSigns(limit = 10) {
        const vitals = this.getData('vital_signs', true) || [];
        return vitals.slice(0, limit);
    }

    getLatestVitalSigns() {
        const vitals = this.getData('vital_signs', true) || [];
        return vitals[0] || null;
    }

    // Medications Management
    addMedication(medicationData) {
        const medications = this.getData('medications', true) || [];
        const newMedication = {
            id: 'med_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'active',
            ...medicationData
        };
        medications.push(newMedication);
        this.setData('medications', medications, true);
        return newMedication;
    }

    getMedications() {
        return this.getData('medications', true) || [];
    }

    updateMedication(medicationId, updates) {
        const medications = this.getData('medications', true) || [];
        const index = medications.findIndex(med => med.id === medicationId);
        if (index !== -1) {
            medications[index] = { ...medications[index], ...updates };
            this.setData('medications', medications, true);
            return medications[index];
        }
        return null;
    }

    takeMedication(medicationId) {
        const medications = this.getData('medications', true) || [];
        const medication = medications.find(med => med.id === medicationId);
        if (medication) {
            const dosageLog = {
                medicationId: medicationId,
                timestamp: new Date().toISOString(),
                taken: true
            };
            
            // Add to dosage history
            if (!medication.dosageHistory) {
                medication.dosageHistory = [];
            }
            medication.dosageHistory.unshift(dosageLog);
            
            // Update last taken
            medication.lastTaken = new Date().toISOString();
            
            this.setData('medications', medications, true);
            return dosageLog;
        }
        return null;
    }

    // Appointments Management
    addAppointment(appointmentData) {
        const appointments = this.getData('appointments', true) || [];
        const newAppointment = {
            id: 'apt_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'scheduled',
            ...appointmentData
        };
        appointments.push(newAppointment);
        this.setData('appointments', appointments, true);
        return newAppointment;
    }

    getAppointments() {
        return this.getData('appointments', true) || [];
    }

    getUpcomingAppointments() {
        const appointments = this.getData('appointments', true) || [];
        const now = new Date();
        return appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate > now && apt.status === 'scheduled';
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    updateAppointment(appointmentId, updates) {
        const appointments = this.getData('appointments', true) || [];
        const index = appointments.findIndex(apt => apt.id === appointmentId);
        if (index !== -1) {
            appointments[index] = { ...appointments[index], ...updates };
            this.setData('appointments', appointments, true);
            return appointments[index];
        }
        return null;
    }

    // Mood Tracking
    addMoodEntry(moodData) {
        const moodEntries = this.getData('mood_data', true) || [];
        const newEntry = {
            id: 'mood_' + Date.now(),
            timestamp: new Date().toISOString(),
            date: new Date().toDateString(),
            ...moodData
        };
        moodEntries.unshift(newEntry);
        this.setData('mood_data', moodEntries.slice(0, 365), true); // Keep last year
        return newEntry;
    }

    getMoodEntries(limit = 30) {
        const entries = this.getData('mood_data', true) || [];
        return entries.slice(0, limit);
    }

    getMoodStats() {
        const entries = this.getData('mood_data', true) || [];
        const last30Days = entries.slice(0, 30);
        
        if (last30Days.length === 0) return null;
        
        const moodCounts = {};
        last30Days.forEach(entry => {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        });
        
        const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );
        
        return {
            totalEntries: last30Days.length,
            mostCommonMood: mostCommonMood,
            moodDistribution: moodCounts,
            averageRating: last30Days.reduce((sum, entry) => sum + (entry.rating || 0), 0) / last30Days.length
        };
    }

    // Chat History Management
    addChatMessage(message) {
        const chatHistory = this.getData('chat_history', true) || [];
        const newMessage = {
            id: 'msg_' + Date.now(),
            timestamp: new Date().toISOString(),
            ...message
        };
        chatHistory.push(newMessage);
        this.setData('chat_history', chatHistory.slice(-100), true); // Keep last 100 messages
        return newMessage;
    }

    getChatHistory() {
        return this.getData('chat_history', true) || [];
    }

    clearChatHistory() {
        this.setData('chat_history', [], true);
    }

    // Notifications Management
    addNotification(notificationData) {
        const notifications = this.getData('notifications', true) || [];
        const newNotification = {
            id: 'notif_' + Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notificationData
        };
        notifications.unshift(newNotification);
        this.setData('notifications', notifications.slice(0, 50), true); // Keep last 50
        return newNotification;
    }

    getNotifications() {
        return this.getData('notifications', true) || [];
    }

    markNotificationRead(notificationId) {
        const notifications = this.getData('notifications', true) || [];
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.setData('notifications', notifications, true);
            return notification;
        }
        return null;
    }

    getUnreadNotifications() {
        const notifications = this.getData('notifications', true) || [];
        return notifications.filter(n => !n.read);
    }

    // Wellness Activities
    addWellnessActivity(activityData) {
        const activities = this.getData('wellness_activities', true) || [];
        const newActivity = {
            id: 'activity_' + Date.now(),
            timestamp: new Date().toISOString(),
            date: new Date().toDateString(),
            ...activityData
        };
        activities.unshift(newActivity);
        this.setData('wellness_activities', activities.slice(0, 200), true);
        return newActivity;
    }

    getWellnessActivities(limit = 20) {
        const activities = this.getData('wellness_activities', true) || [];
        return activities.slice(0, limit);
    }

    // Emergency Logs
    addEmergencyLog(logData) {
        const logs = this.getData('emergency_logs', true) || [];
        const newLog = {
            id: 'emergency_' + Date.now(),
            timestamp: new Date().toISOString(),
            ...logData
        };
        logs.unshift(newLog);
        this.setData('emergency_logs', logs.slice(0, 20), true); // Keep last 20
        return newLog;
    }

    getEmergencyLogs() {
        return this.getData('emergency_logs', true) || [];
    }

    // Data Export
    exportUserData() {
        const userData = {
            profile: this.getData('user_profile', true),
            healthRecords: this.getData('health_records', true),
            appointments: this.getData('appointments', true),
            medications: this.getData('medications', true),
            moodData: this.getData('mood_data', true),
            vitalSigns: this.getData('vital_signs', true),
            chatHistory: this.getData('chat_history', true),
            notifications: this.getData('notifications', true),
            wellnessActivities: this.getData('wellness_activities', true),
            emergencyLogs: this.getData('emergency_logs', true),
            exportDate: new Date().toISOString()
        };
        
        return userData;
    }

    // Data Import
    importUserData(userData) {
        try {
            Object.keys(userData).forEach(key => {
                if (key !== 'exportDate') {
                    this.setData(key, userData[key], true);
                }
            });
            console.log('✅ User data imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Error importing user data:', error);
            return false;
        }
    }

    // Clear all user data
    clearAllUserData() {
        const keys = [
            'user_profile', 'health_records', 'appointments', 'medications',
            'mood_data', 'vital_signs', 'chat_history', 'notifications',
            'wellness_activities', 'emergency_logs'
        ];
        
        keys.forEach(key => {
            if (this.currentUser) {
                localStorage.removeItem(`${this.storagePrefix}${this.currentUser.uid}_${key}`);
            }
        });
        
        console.log('🗑️ All user data cleared');
    }

    // Get storage usage statistics
    getStorageStats() {
        let totalSize = 0;
        const stats = {};
        
        for (let key in localStorage) {
            if (key.startsWith(this.storagePrefix)) {
                const size = localStorage[key].length;
                totalSize += size;
                const cleanKey = key.replace(this.storagePrefix, '');
                stats[cleanKey] = {
                    size: size,
                    sizeKB: Math.round(size / 1024 * 100) / 100
                };
            }
        }
        
        return {
            totalSize: totalSize,
            totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
            totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
            breakdown: stats
        };
    }
}

// Create global instance
const dataManager = new DataManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
