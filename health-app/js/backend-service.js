// GENIBI Backend Service - Production Ready Data Management
class BackendService {
    constructor() {
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.initializeStorage();
        this.setupOfflineHandling();
    }

    // Initialize storage systems
    initializeStorage() {
        // Initialize IndexedDB for offline storage
        this.initializeIndexedDB();
        
        // Initialize Firestore connection
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            this.firestore = firebase.firestore();
            console.log('✅ Firestore connected');
        } else {
            console.warn('⚠️ Firestore not available, using local storage');
            this.firestore = null;
        }
    }

    // Initialize IndexedDB for offline storage
    async initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('GenibiDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB initialized');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                const stores = [
                    'users', 'vitals', 'medications', 'appointments', 
                    'moods', 'healthRecords', 'chatHistory', 'wellness'
                ];
                
                stores.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('userId', 'userId', { unique: false });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                });
                
                console.log('✅ IndexedDB schema created');
            };
        });
    }

    // Setup offline handling
    setupOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Back online - syncing data');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📱 Offline mode activated');
        });
    }

    // Generic save method
    async saveData(collection, data, userId = null) {
        const user = userId || (authService.getCurrentUser()?.uid);
        if (!user) throw new Error('User not authenticated');
        
        const record = {
            ...data,
            userId: user,
            timestamp: new Date().toISOString(),
            synced: false
        };
        
        try {
            // Save to local storage first
            await this.saveToLocal(collection, record);
            
            // Try to save to cloud if online
            if (this.isOnline && this.firestore) {
                await this.saveToCloud(collection, record);
                record.synced = true;
                await this.updateLocal(collection, record);
            } else {
                // Add to sync queue
                this.syncQueue.push({ collection, record });
            }
            
            console.log(`✅ Data saved to ${collection}`);
            return record;
        } catch (error) {
            console.error(`❌ Error saving to ${collection}:`, error);
            throw error;
        }
    }

    // Generic get method
    async getData(collection, userId = null, filters = {}) {
        const user = userId || (authService.getCurrentUser()?.uid);
        if (!user) throw new Error('User not authenticated');
        
        try {
            // Try cloud first if online
            if (this.isOnline && this.firestore) {
                const cloudData = await this.getFromCloud(collection, user, filters);
                if (cloudData.length > 0) {
                    // Update local cache
                    await this.cacheData(collection, cloudData);
                    return cloudData;
                }
            }
            
            // Fallback to local data
            return await this.getFromLocal(collection, user, filters);
        } catch (error) {
            console.error(`❌ Error getting ${collection}:`, error);
            // Return local data as fallback
            return await this.getFromLocal(collection, user, filters);
        }
    }

    // Save to local IndexedDB
    async saveToLocal(collection, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collection], 'readwrite');
            const store = transaction.objectStore(collection);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Update local IndexedDB
    async updateLocal(collection, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collection], 'readwrite');
            const store = transaction.objectStore(collection);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Get from local IndexedDB
    async getFromLocal(collection, userId, filters = {}) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collection], 'readonly');
            const store = transaction.objectStore(collection);
            const index = store.index('userId');
            const request = index.getAll(userId);
            
            request.onsuccess = () => {
                let results = request.result || [];
                
                // Apply filters
                if (filters.limit) {
                    results = results.slice(0, filters.limit);
                }
                if (filters.orderBy) {
                    results.sort((a, b) => {
                        const aVal = a[filters.orderBy];
                        const bVal = b[filters.orderBy];
                        return filters.order === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
                    });
                }
                
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Save to cloud Firestore
    async saveToCloud(collection, data) {
        if (!this.firestore) throw new Error('Firestore not available');
        
        const docRef = this.firestore.collection(collection).doc();
        await docRef.set({
            ...data,
            id: docRef.id,
            synced: true
        });
        
        return docRef.id;
    }

    // Get from cloud Firestore
    async getFromCloud(collection, userId, filters = {}) {
        if (!this.firestore) throw new Error('Firestore not available');
        
        let query = this.firestore.collection(collection).where('userId', '==', userId);
        
        // Apply filters
        if (filters.orderBy) {
            query = query.orderBy(filters.orderBy, filters.order || 'asc');
        }
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Cache cloud data locally
    async cacheData(collection, data) {
        const transaction = this.db.transaction([collection], 'readwrite');
        const store = transaction.objectStore(collection);
        
        for (const item of data) {
            store.put({ ...item, synced: true });
        }
    }

    // Sync offline data when back online
    async syncOfflineData() {
        if (!this.isOnline || !this.firestore) return;
        
        console.log('🔄 Syncing offline data...');
        
        try {
            for (const item of this.syncQueue) {
                await this.saveToCloud(item.collection, item.record);
                item.record.synced = true;
                await this.updateLocal(item.collection, item.record);
            }
            
            this.syncQueue = [];
            console.log('✅ Offline data synced successfully');
        } catch (error) {
            console.error('❌ Error syncing offline data:', error);
        }
    }

    // Specific methods for each data type
    
    // Vital Signs
    async saveVitalSigns(data) {
        return this.saveData('vitals', {
            heartRate: data.heartRate,
            bloodPressure: data.bloodPressure,
            temperature: data.temperature,
            weight: data.weight,
            notes: data.notes
        });
    }

    async getVitalSigns(limit = 10) {
        return this.getData('vitals', null, { 
            orderBy: 'timestamp', 
            order: 'desc', 
            limit 
        });
    }

    // Medications
    async saveMedication(data) {
        return this.saveData('medications', {
            name: data.name,
            dosage: data.dosage,
            frequency: data.frequency,
            startDate: data.startDate,
            endDate: data.endDate,
            notes: data.notes,
            active: true
        });
    }

    async getMedications() {
        return this.getData('medications', null, { 
            orderBy: 'timestamp', 
            order: 'desc' 
        });
    }

    // Appointments
    async saveAppointment(data) {
        return this.saveData('appointments', {
            doctorName: data.doctorName,
            specialty: data.specialty,
            date: data.date,
            time: data.time,
            location: data.location,
            notes: data.notes,
            status: data.status || 'scheduled'
        });
    }

    async getAppointments() {
        return this.getData('appointments', null, { 
            orderBy: 'date', 
            order: 'asc' 
        });
    }

    // Mood Tracking
    async saveMood(data) {
        return this.saveData('moods', {
            mood: data.mood,
            emoji: data.emoji,
            notes: data.notes,
            factors: data.factors || []
        });
    }

    async getMoods(limit = 30) {
        return this.getData('moods', null, { 
            orderBy: 'timestamp', 
            order: 'desc', 
            limit 
        });
    }

    // Health Records
    async saveHealthRecord(data) {
        return this.saveData('healthRecords', {
            title: data.title,
            type: data.type,
            date: data.date,
            doctor: data.doctor,
            facility: data.facility,
            summary: data.summary,
            fileUrl: data.fileUrl
        });
    }

    async getHealthRecords() {
        return this.getData('healthRecords', null, { 
            orderBy: 'date', 
            order: 'desc' 
        });
    }

    // Chat History
    async saveChatMessage(data) {
        return this.saveData('chatHistory', {
            message: data.message,
            sender: data.sender, // 'user' or 'bot'
            sessionId: data.sessionId
        });
    }

    async getChatHistory(sessionId, limit = 50) {
        const allChats = await this.getData('chatHistory', null, { 
            orderBy: 'timestamp', 
            order: 'asc' 
        });
        
        return allChats
            .filter(chat => chat.sessionId === sessionId)
            .slice(-limit);
    }

    // Wellness Data
    async saveWellnessData(data) {
        return this.saveData('wellness', {
            type: data.type, // 'steps', 'sleep', 'water', 'exercise'
            value: data.value,
            unit: data.unit,
            goal: data.goal
        });
    }

    async getWellnessData(type = null, limit = 30) {
        const allData = await this.getData('wellness', null, { 
            orderBy: 'timestamp', 
            order: 'desc', 
            limit 
        });
        
        return type ? allData.filter(item => item.type === type) : allData;
    }

    // Delete data
    async deleteData(collection, id) {
        try {
            // Delete from cloud
            if (this.isOnline && this.firestore) {
                await this.firestore.collection(collection).doc(id).delete();
            }
            
            // Delete from local
            const transaction = this.db.transaction([collection], 'readwrite');
            const store = transaction.objectStore(collection);
            await store.delete(id);
            
            console.log(`✅ Data deleted from ${collection}`);
        } catch (error) {
            console.error(`❌ Error deleting from ${collection}:`, error);
            throw error;
        }
    }

    // Get storage statistics
    async getStorageStats() {
        const stats = {};
        const collections = ['vitals', 'medications', 'appointments', 'moods', 'healthRecords', 'chatHistory', 'wellness'];
        
        for (const collection of collections) {
            const data = await this.getFromLocal(collection, authService.getCurrentUser()?.uid);
            stats[collection] = data.length;
        }
        
        return stats;
    }
}

// Create global backend service instance
window.backendService = new BackendService();

console.log('🚀 GENIBI Backend Service loaded');
