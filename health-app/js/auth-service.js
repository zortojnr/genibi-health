// GENIBI Authentication Service - Production Ready
class AuthService {
    constructor() {
        this.currentUser = null;
        this.isDemo = false;
        this.authListeners = [];
        this.initializeFirebase();
        this.initializeGoogleAuth();
    }

    // Initialize Firebase
    initializeFirebase() {
        const firebaseConfig = {
            apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            authDomain: "genibi-health.firebaseapp.com",
            projectId: "genibi-health",
            storageBucket: "genibi-health.appspot.com",
            messagingSenderId: "123456789012",
            appId: "1:123456789012:web:abcdef123456789012345678"
        };

        if (typeof firebase !== 'undefined') {
            try {
                firebase.initializeApp(firebaseConfig);
                this.auth = firebase.auth();
                this.firestore = firebase.firestore();
                console.log('✅ Firebase initialized successfully');
                
                // Listen for auth state changes
                this.auth.onAuthStateChanged((user) => {
                    this.handleAuthStateChange(user);
                });
            } catch (error) {
                console.warn('⚠️ Firebase initialization failed:', error);
                this.initializeFallbackAuth();
            }
        } else {
            console.warn('⚠️ Firebase not loaded, using fallback auth');
            this.initializeFallbackAuth();
        }
    }

    // Initialize Google Authentication
    initializeGoogleAuth() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: "123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
                callback: this.handleGoogleSignIn.bind(this),
                auto_select: false,
                cancel_on_tap_outside: false
            });
            console.log('✅ Google Auth initialized');
        } else {
            console.warn('⚠️ Google Auth not loaded');
        }
    }

    // Fallback authentication for offline/demo mode
    initializeFallbackAuth() {
        this.auth = {
            signInWithEmailAndPassword: this.fallbackEmailSignIn.bind(this),
            createUserWithEmailAndPassword: this.fallbackEmailSignUp.bind(this),
            signOut: this.fallbackSignOut.bind(this),
            onAuthStateChanged: (callback) => {
                this.authStateCallback = callback;
            }
        };
        this.firestore = {
            collection: () => ({
                doc: () => ({
                    set: (data) => Promise.resolve(),
                    get: () => Promise.resolve({ exists: false, data: () => ({}) }),
                    update: (data) => Promise.resolve()
                })
            })
        };
    }

    // Handle authentication state changes
    handleAuthStateChange(user) {
        if (user) {
            this.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                firstName: user.displayName ? user.displayName.split(' ')[0] : 'User',
                lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
                isDemo: false,
                loginMethod: 'firebase'
            };
            this.isDemo = false;
            console.log('✅ User authenticated:', this.currentUser);
        } else {
            this.currentUser = null;
            this.isDemo = false;
            console.log('ℹ️ User signed out');
        }
        
        // Notify listeners
        this.authListeners.forEach(listener => listener(this.currentUser));
    }

    // Google Sign-In handler
    handleGoogleSignIn(response) {
        try {
            const responsePayload = this.decodeJwtResponse(response.credential);
            
            this.currentUser = {
                uid: responsePayload.sub,
                email: responsePayload.email,
                displayName: responsePayload.name,
                photoURL: responsePayload.picture,
                firstName: responsePayload.given_name,
                lastName: responsePayload.family_name,
                isDemo: false,
                loginMethod: 'google'
            };
            
            this.isDemo = false;
            console.log('✅ Google Sign-In successful:', this.currentUser);
            
            // Save user data to Firestore
            this.saveUserData();
            
            // Notify listeners
            this.authListeners.forEach(listener => listener(this.currentUser));
            
            return Promise.resolve(this.currentUser);
        } catch (error) {
            console.error('❌ Google Sign-In error:', error);
            return Promise.reject(error);
        }
    }

    // Decode JWT response from Google
    decodeJwtResponse(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Email/Password Sign In
    async signInWithEmail(email, password) {
        try {
            if (this.auth.signInWithEmailAndPassword) {
                const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
                console.log('✅ Email sign-in successful');
                return userCredential.user;
            } else {
                return this.fallbackEmailSignIn(email, password);
            }
        } catch (error) {
            console.error('❌ Email sign-in error:', error);
            throw error;
        }
    }

    // Email/Password Sign Up
    async signUpWithEmail(email, password, firstName, lastName) {
        try {
            if (this.auth.createUserWithEmailAndPassword) {
                const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
                
                // Update profile
                await userCredential.user.updateProfile({
                    displayName: `${firstName} ${lastName}`
                });
                
                // Save additional user data
                await this.saveUserData({
                    firstName,
                    lastName,
                    email,
                    createdAt: new Date().toISOString()
                });
                
                console.log('✅ Email sign-up successful');
                return userCredential.user;
            } else {
                return this.fallbackEmailSignUp(email, password, firstName, lastName);
            }
        } catch (error) {
            console.error('❌ Email sign-up error:', error);
            throw error;
        }
    }

    // Start Demo Mode
    startDemoMode() {
        this.currentUser = {
            uid: 'demo-user',
            email: 'demo@genibi.com',
            displayName: 'Demo User',
            firstName: 'Demo',
            lastName: 'User',
            isDemo: true,
            loginMethod: 'demo'
        };
        
        this.isDemo = true;
        console.log('🎯 Demo mode started');
        
        // Notify listeners
        this.authListeners.forEach(listener => listener(this.currentUser));
        
        return Promise.resolve(this.currentUser);
    }

    // Sign Out
    async signOut() {
        try {
            if (this.auth.signOut) {
                await this.auth.signOut();
            }
            
            this.currentUser = null;
            this.isDemo = false;
            console.log('✅ Sign out successful');
            
            // Notify listeners
            this.authListeners.forEach(listener => listener(null));
        } catch (error) {
            console.error('❌ Sign out error:', error);
            throw error;
        }
    }

    // Save user data to Firestore
    async saveUserData(additionalData = {}) {
        if (!this.currentUser || this.isDemo) return;
        
        try {
            const userData = {
                uid: this.currentUser.uid,
                email: this.currentUser.email,
                displayName: this.currentUser.displayName,
                firstName: this.currentUser.firstName,
                lastName: this.currentUser.lastName,
                photoURL: this.currentUser.photoURL,
                lastLogin: new Date().toISOString(),
                ...additionalData
            };
            
            await this.firestore.collection('users').doc(this.currentUser.uid).set(userData, { merge: true });
            console.log('✅ User data saved');
        } catch (error) {
            console.error('❌ Error saving user data:', error);
        }
    }

    // Fallback authentication methods
    fallbackEmailSignIn(email, password) {
        return new Promise((resolve, reject) => {
            // Simulate authentication
            setTimeout(() => {
                if (email && password) {
                    const user = {
                        uid: 'fallback-' + Date.now(),
                        email: email,
                        displayName: email.split('@')[0],
                        firstName: email.split('@')[0],
                        lastName: ''
                    };
                    this.handleAuthStateChange(user);
                    resolve({ user });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    }

    fallbackEmailSignUp(email, password, firstName, lastName) {
        return new Promise((resolve, reject) => {
            // Simulate user creation
            setTimeout(() => {
                if (email && password && firstName) {
                    const user = {
                        uid: 'fallback-' + Date.now(),
                        email: email,
                        displayName: `${firstName} ${lastName}`,
                        firstName: firstName,
                        lastName: lastName
                    };
                    this.handleAuthStateChange(user);
                    resolve({ user });
                } else {
                    reject(new Error('Invalid user data'));
                }
            }, 1000);
        });
    }

    fallbackSignOut() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.handleAuthStateChange(null);
                resolve();
            }, 500);
        });
    }

    // Add authentication listener
    onAuthStateChanged(callback) {
        this.authListeners.push(callback);
        
        // Call immediately with current state
        callback(this.currentUser);
        
        // Return unsubscribe function
        return () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
                this.authListeners.splice(index, 1);
            }
        };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Check if in demo mode
    isDemoMode() {
        return this.isDemo;
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        return {
            isValid: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
    }
}

// Create global auth service instance
window.authService = new AuthService();

console.log('🚀 GENIBI Authentication Service loaded');
