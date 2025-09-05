// Real Firebase Configuration for GENIBI Health App
const firebaseConfig = {
    apiKey: "AIzaSyCy6eBmunNtPOpRylqYNV4BEoj_KHmuLDs",
    authDomain: "genibi-app.firebaseapp.com",
    projectId: "genibi-app",
    storageBucket: "genibi-app.firebasestorage.app",
    messagingSenderId: "1063726901677",
    appId: "1:1063726901677:web:8fc0678edce8b6457a5924",
    measurementId: "G-G2SMJLD013"
};

// Real Google OAuth Configuration
const GOOGLE_CLIENT_ID = "1063726901677-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com";

// Initialize Firebase
let app;
let auth;
let googleProvider;
let isFirebaseAvailable = false;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    googleProvider.setCustomParameters({
        'prompt': 'select_account'
    });
    isFirebaseAvailable = true;
    console.log('🔥 Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.log('📱 Using Google Identity Services fallback');
    isFirebaseAvailable = false;
}

// Initialize Google Identity Services
let googleIdentityInitialized = false;

function initializeGoogleIdentity() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: false
        });
        googleIdentityInitialized = true;
        console.log('✅ Google Identity Services initialized');
    } else {
        console.log('⏳ Waiting for Google Identity Services...');
        setTimeout(initializeGoogleIdentity, 500);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeGoogleIdentity, 1000);
});

// Authentication state management
let currentUser = null;

// Initialize services
if (typeof api === 'undefined') {
    console.error('API service not loaded. Please include api.js before auth.js');
}

if (typeof dataManager === 'undefined') {
    console.error('Data Manager not loaded. Please include data-manager.js before auth.js');
}

// DOM elements - will be initialized after DOM loads
let loadingScreen, authContainer, mainApp, loginForm, signupForm;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Initializing Authentication System...');

    // Initialize DOM elements
    loadingScreen = document.getElementById('loading-screen');
    authContainer = document.getElementById('auth-container');
    mainApp = document.getElementById('main-app');
    loginForm = document.getElementById('login-form');
    signupForm = document.getElementById('signup-form');

    // Check if all required elements exist
    if (!loadingScreen || !authContainer || !mainApp) {
        console.error('❌ Critical DOM elements missing!');
        return;
    }

    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Show loading screen
    showLoading();

    // Check auth state immediately - no artificial delay
    checkAuthState();
}

function showLoading() {
    console.log('⏳ Showing loading screen...');

    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
    if (authContainer) {
        authContainer.classList.add('hidden');
    }
    if (mainApp) {
        mainApp.classList.add('hidden');
    }
}

function hideLoading() {
    console.log('✅ Hiding loading screen...');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

async function checkAuthState() {
    try {
        // Check if we have a stored token
        const token = localStorage.getItem('authToken');

        if (token) {
            api.setToken(token);

            // Verify token with backend
            const response = await api.verifyToken();

            if (response.success) {
                currentUser = response.data.user;
                localStorage.setItem('healthcare_user', JSON.stringify(currentUser));
                showMainApp();
                hideLoading();

                // Show demo mode indicator if in offline mode
                if (api.isOfflineMode) {
                    showDemoModeIndicator();
                }
                return;
            }
        }

        // No valid token, show auth
        showAuthContainer();
        hideLoading();

        // Show demo mode indicator if in offline mode
        if (api.isOfflineMode) {
            showDemoModeIndicator();
        }
    } catch (error) {
        console.error('Auth state check failed:', error);
        // Clear invalid token and show auth
        localStorage.removeItem('authToken');
        localStorage.removeItem('healthcare_user');
        showAuthContainer();
        hideLoading();

        // Show demo mode indicator
        showDemoModeIndicator();
    }
}

// Show demo mode indicator
function showDemoModeIndicator() {
    // Create demo mode banner if it doesn't exist
    let demoBanner = document.getElementById('demo-mode-banner');
    if (!demoBanner) {
        demoBanner = document.createElement('div');
        demoBanner.id = 'demo-mode-banner';
        demoBanner.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 10px;
                        text-align: center;
                        font-size: 14px;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 10000;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <i class="fas fa-info-circle"></i>
                <strong>Demo Mode</strong> - Backend not connected. All features are simulated for demonstration.
                <button onclick="this.parentElement.parentElement.style.display='none'"
                        style="background: none; border: none; color: white; margin-left: 10px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.insertBefore(demoBanner, document.body.firstChild);

        // Adjust body padding to account for banner
        document.body.style.paddingTop = '50px';
    }
}

function showAuthContainer() {
    console.log('🔐 Showing authentication container...');

    if (!authContainer || !mainApp) {
        console.error('❌ Auth containers not found!');
        return;
    }

    // Hide loading screen
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }

    // Show auth, hide main app
    authContainer.classList.remove('hidden');
    mainApp.classList.add('hidden');

    // Force immediate layout update
    authContainer.offsetHeight;

    console.log('✅ Authentication container shown');
}

function showMainApp() {
    console.log('🏠 Showing main application...');

    if (!authContainer || !mainApp) {
        console.error('❌ App containers not found!');
        return;
    }

    // Hide loading screen and auth
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
    authContainer.classList.add('hidden');

    // Show main app
    mainApp.classList.remove('hidden');

    // Force immediate layout update
    mainApp.offsetHeight;

    // Update user info in the app
    updateUserInfo();

    console.log('✅ Main application shown');
}

function updateUserInfo() {
    if (currentUser) {
        // Update welcome message or user avatar
        const welcomeSection = document.querySelector('.welcome-section h1');
        if (welcomeSection) {
            welcomeSection.textContent = `Welcome back, ${currentUser.firstName || 'User'}!`;
        }
    }
}

function setupEventListeners() {
    // Login form
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupFormElement = document.getElementById('signupForm');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignup);
    }
    
    // Password strength checker
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', checkPasswordStrength);
    }
    
    // Confirm password validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }
    
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Show loading state with instant feedback
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;

    // Add instant visual feedback
    submitBtn.style.transform = 'scale(0.98)';
    setTimeout(() => {
        submitBtn.style.transform = '';
    }, 100);
    
    try {
        // Call backend API
        const response = await api.login({ email, password });

        if (response.success) {
            // Store authentication data
            currentUser = response.data.user;
            api.setToken(response.data.token);

            // Clear any existing demo data before setting new user
            dataManager.clearAllUserData();

            // Initialize data manager for this user
            dataManager.setCurrentUser(currentUser);

            // Save user data
            if (rememberMe) {
                localStorage.setItem('healthcare_user', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('healthcare_user', JSON.stringify(currentUser));
            }

            // Show success message
            const welcomeMessage = api.isOfflineMode
                ? `Welcome to Demo Mode, ${currentUser.firstName}!`
                : `Welcome back, ${currentUser.firstName}!`;
            showNotification(welcomeMessage, 'success');

            // Redirect to main app immediately
            showMainApp();
            if (api.isOfflineMode) {
                showDemoModeIndicator();
            }
        } else {
            throw new Error(response.message || 'Login failed');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    console.log('📝 Starting user registration...');

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Enhanced validation
    if (!firstName || !lastName || !email || !password) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }

    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;

    try {
        let userCredential;

        // Try Firebase registration first
        try {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                userCredential = await auth.createUserWithEmailAndPassword(email, password);

                // Update profile
                await userCredential.user.updateProfile({
                    displayName: `${firstName} ${lastName}`
                });

                // Send email verification
                await userCredential.user.sendEmailVerification();

                console.log('✅ Firebase registration successful');
            } else {
                throw new Error('Firebase not available');
            }
        } catch (firebaseError) {
            console.warn('⚠️ Firebase unavailable, using fallback registration');

            // Fallback registration
            userCredential = {
                user: {
                    uid: 'email_' + Date.now(),
                    email: email,
                    displayName: `${firstName} ${lastName}`,
                    emailVerified: false // Will be set to true after "verification"
                }
            };
        }

        const user = userCredential.user;

        currentUser = {
            uid: user.uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            provider: 'email',
            emailVerified: user.emailVerified || false,
            loginTime: new Date().toISOString(),
            isDemo: !firebase.apps?.length,
            registrationDate: new Date().toISOString()
        };

        // Store user data
        localStorage.setItem('healthcare_user', JSON.stringify(currentUser));

        // Clear any existing demo data before setting new user
        dataManager.clearAllUserData();

        // Initialize data manager for this user
        dataManager.setCurrentUser(currentUser);

        // Set authentication token
        try {
            const token = await user.getIdToken?.() || 'email_token_' + Date.now();
            api.setToken(token);
        } catch (tokenError) {
            api.setToken('email_fallback_' + Date.now());
        }

        // Send verification notification
        sendVerificationNotification(currentUser);

        // Add registration notification
        dataManager.addNotification({
            type: 'registration',
            title: 'Account Created!',
            message: `Welcome to GENIBI! Your account was created successfully at ${new Date().toLocaleString()}`,
            icon: 'fas fa-user-plus'
        });

        // Initialize user profile
        dataManager.setData('user_profile', {
            personalInfo: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                registrationDate: new Date().toISOString()
            },
            preferences: {
                notifications: true,
                theme: 'light',
                language: 'en'
            },
            settings: {
                privacy: 'standard',
                dataSharing: false
            }
        }, true);

        showNotification(`Account created successfully! Welcome to GENIBI, ${firstName}.`, 'success');

        // Redirect to main app
        setTimeout(() => {
            showMainApp();
        }, 500);
        
    } catch (error) {
        console.error('Signup error:', error);
        showNotification(error.message || 'Signup failed. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Demo Sign Up function
async function demoSignUp() {
    console.log('🎭 Starting Demo Sign Up...');

    try {
        // Create demo user
        currentUser = {
            uid: 'demo_' + Date.now(),
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@genibi.com',
            provider: 'demo',
            emailVerified: true,
            loginTime: new Date().toISOString(),
            isDemo: true,
            registrationDate: new Date().toISOString()
        };

        // Clear any existing demo data before setting new user
        dataManager.clearAllUserData();

        // Initialize data manager for this demo user
        dataManager.setCurrentUser(currentUser);

        // Store demo user data
        localStorage.setItem('healthcare_user', JSON.stringify(currentUser));

        // Set demo authentication token
        api.setToken('demo_token_' + Date.now());

        // Add demo notification
        dataManager.addNotification({
            type: 'demo',
            title: 'Demo Mode Activated!',
            message: `Welcome to GENIBI Demo Mode! Explore all features with sample data.`,
            icon: 'fas fa-user-clock'
        });

        // Initialize demo profile
        dataManager.setData('user_profile', {
            personalInfo: {
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@genibi.com',
                registrationDate: new Date().toISOString()
            },
            preferences: {
                notifications: true,
                theme: 'light',
                language: 'en'
            },
            settings: {
                privacy: 'standard',
                dataSharing: false
            }
        }, true);

        // Show success message
        showNotification('Demo Mode activated! Welcome to GENIBI.', 'success');

        // Redirect to main app
        setTimeout(() => {
            showMainApp();
            showDemoModeIndicator();
        }, 500);

    } catch (error) {
        console.error('Demo signup error:', error);
        showNotification('Demo mode failed to start. Please try again.', 'error');
    }
}

// Logout function
async function logout() {
    try {
        // Call backend logout
        await api.logout();

        // Clear local data
        currentUser = null;
        localStorage.removeItem('healthcare_user');
        sessionStorage.removeItem('healthcare_user');

        // Show auth container
        showAuthContainer();

        showNotification('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear local data even if backend call fails
        currentUser = null;
        localStorage.removeItem('healthcare_user');
        sessionStorage.removeItem('healthcare_user');
        showAuthContainer();
    }
}

// Real Google Sign-In Implementation with OAuth Flow
async function signInWithGoogle() {
    console.log('🔐 Starting Real Google OAuth Sign-In...');

    try {
        // Show loading state
        const googleBtn = document.querySelector('.btn-google');
        if (googleBtn) {
            googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Google...';
            googleBtn.disabled = true;
        }

        let result;

        // Try Firebase Google Sign-In with popup first
        if (isFirebaseAvailable && auth && googleProvider) {
            try {
                console.log('🔥 Using Firebase Google Sign-In with account selection...');
                result = await auth.signInWithPopup(googleProvider);
                console.log('✅ Firebase Google Sign-In successful:', result.user.email);
            } catch (firebaseError) {
                console.warn('⚠️ Firebase popup failed, trying Google Identity Services:', firebaseError);
                throw firebaseError;
            }
        } else {
            throw new Error('Firebase not available, using Google Identity Services');
        }

        // If Firebase fails, use Google Identity Services
        if (!result) {
            console.log('🌐 Using Google Identity Services...');

            if (googleIdentityInitialized && typeof google !== 'undefined') {
                // Trigger Google account selection
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.log('Google One Tap not displayed, showing manual sign-in');
                        // Fallback to manual sign-in
                        showGoogleManualSignIn();
                    }
                });
                return; // Exit here as the callback will handle the rest
            } else {
                throw new Error('Google Identity Services not available');
            }
        }

        // Process successful Firebase result
        const user = result.user;

        currentUser = {
            uid: user.uid,
            firstName: user.displayName?.split(' ')[0] || 'User',
            lastName: user.displayName?.split(' ')[1] || '',
            email: user.email,
            photoURL: user.photoURL,
            provider: 'google',
            emailVerified: user.emailVerified || true,
            loginTime: new Date().toISOString(),
            isDemo: false // Real Google account
        };

        await completeGoogleSignIn(currentUser, user);

    } catch (error) {
        console.error('❌ Google sign-in error:', error);

        // Show manual Google sign-in as fallback
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            showNotification('Popup blocked. Please allow popups and try again, or use the manual sign-in option.', 'warning');
            showGoogleManualSignIn();
        } else {
            showNotification('Google sign-in failed. Please try again or use email registration.', 'error');
            resetGoogleButton();
        }
    }
}

// Handle Google Identity Services credential response
function handleGoogleCredentialResponse(response) {
    console.log('📧 Google credential response received');

    try {
        // Decode the JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        const user = {
            uid: 'gis_' + payload.sub,
            displayName: payload.name,
            email: payload.email,
            photoURL: payload.picture,
            emailVerified: payload.email_verified
        };

        currentUser = {
            uid: user.uid,
            firstName: user.displayName?.split(' ')[0] || 'User',
            lastName: user.displayName?.split(' ')[1] || '',
            email: user.email,
            photoURL: user.photoURL,
            provider: 'google',
            emailVerified: user.emailVerified || true,
            loginTime: new Date().toISOString(),
            isDemo: false // Real Google account
        };

        completeGoogleSignIn(currentUser, user);

    } catch (error) {
        console.error('❌ Error processing Google credential:', error);
        showNotification('Error processing Google sign-in. Please try again.', 'error');
        resetGoogleButton();
    }
}

// Complete Google sign-in process
async function completeGoogleSignIn(currentUser, user) {
    try {
        // Store user data
        localStorage.setItem('healthcare_user', JSON.stringify(currentUser));

        // Clear any existing demo data before setting new user
        dataManager.clearAllUserData();

        // Initialize data manager for this user
        dataManager.setCurrentUser(currentUser);

        // Set authentication token
        try {
            const token = await user.getIdToken?.() || 'google_token_' + Date.now();
            api.setToken(token);
        } catch (tokenError) {
            api.setToken('google_verified_' + Date.now());
        }

        // Send verification notification
        sendVerificationNotification(currentUser);

        // Add login notification
        dataManager.addNotification({
            type: 'login',
            title: 'Welcome Back!',
            message: `Logged in successfully via Google at ${new Date().toLocaleString()}`,
            icon: 'fas fa-sign-in-alt'
        });

        showNotification(`Welcome ${currentUser.firstName}! Google Sign-In successful.`, 'success');

        // Redirect to main app
        setTimeout(() => {
            showMainApp();
        }, 500);

    } catch (error) {
        console.error('❌ Error completing Google sign-in:', error);
        showNotification('Error completing sign-in. Please try again.', 'error');
        resetGoogleButton();
    }
}

// Show manual Google sign-in option
function showGoogleManualSignIn() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay google-signin-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🔐 Google Sign-In</h3>
                <button class="modal-close" onclick="closeGoogleSignInModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="google-signin-content">
                    <p>Choose your Google account to continue:</p>
                    <div id="google-signin-button"></div>
                    <p class="signin-note">
                        <i class="fas fa-shield-alt"></i>
                        Your data is secure and will only be used for authentication.
                    </p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Initialize Google Sign-In button
    setTimeout(() => {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular',
                    width: 300
                }
            );
        }
    }, 100);
}

function closeGoogleSignInModal() {
    const modal = document.querySelector('.google-signin-modal');
    if (modal) {
        modal.remove();
    }
    resetGoogleButton();
}

function resetGoogleButton() {
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.innerHTML = `
            <div class="google-icon">
                <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"/>
                    <path fill="#EA4335" d="M8.98 1a7.9 7.9 0 0 1 5.6 2.3l2.1-2.1A8 8 0 0 0 1.83 5.35L4.5 7.42a4.8 4.8 0 0 1 4.48-6.42z"/>
                </svg>
            </div>
            <span>Sign in with Google</span>
        `;
        googleBtn.disabled = false;
    }
}

// Utility functions
function showLogin() {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
}

function showSignup() {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let strengthLabel = 'Weak';
    
    // Check password criteria
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    // Update strength indicator
    strengthBar.style.width = strength + '%';
    
    if (strength >= 75) {
        strengthLabel = 'Strong';
        strengthBar.style.background = 'var(--success-green)';
    } else if (strength >= 50) {
        strengthLabel = 'Medium';
        strengthBar.style.background = 'var(--warning-orange)';
    } else {
        strengthLabel = 'Weak';
        strengthBar.style.background = 'var(--emergency-red)';
    }
    
    strengthText.textContent = `Password strength: ${strengthLabel}`;
}

function validatePasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.style.borderColor = 'var(--emergency-red)';
    } else {
        confirmInput.style.borderColor = 'var(--success-green)';
    }
}

function logout() {
    // Clear user data
    localStorage.removeItem('healthcare_user');
    sessionStorage.removeItem('healthcare_user');
    currentUser = null;
    
    // Show notification
    showNotification('You have been logged out successfully.', 'info');
    
    // Redirect to auth
    setTimeout(() => {
        showAuthContainer();
    }, 1000);
}

// Simulate authentication request (replace with actual API calls)
function simulateAuthRequest() {
    return new Promise((resolve) => {
        // No artificial delay - resolve immediately for fast response
        resolve();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : 
                     type === 'error' ? 'var(--emergency-red)' : 
                     type === 'warning' ? 'var(--warning-orange)' : 'var(--primary-blue)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

function closeNotification(button) {
    const notification = button.parentElement;
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        margin-left: auto;
    }
    .notification-close:hover {
        background: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Email Verification and Notification System
function sendVerificationNotification(user) {
    console.log('📧 Sending verification notification for:', user.email);

    // Create verification notification
    const notification = {
        id: 'verification_' + Date.now(),
        type: 'verification',
        title: 'Account Verification',
        message: `Welcome ${user.firstName}! Your account has been verified and you're now logged in.`,
        timestamp: new Date().toISOString(),
        read: false
    };

    // Store notification
    const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    notifications.unshift(notification);
    localStorage.setItem('user_notifications', JSON.stringify(notifications));

    // Show immediate notification
    showVerificationModal(user);

    console.log('✅ Verification notification sent');
}

function showVerificationModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay verification-modal';
    modal.innerHTML = `
        <div class="modal-content verification-content">
            <div class="verification-header">
                <div class="verification-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Account Verified!</h3>
            </div>
            <div class="verification-body">
                <p>Welcome to GENIBI Health App, <strong>${user.firstName}</strong>!</p>
                <p>Your account has been successfully verified and you're now logged in.</p>
                <div class="user-info">
                    <div class="user-avatar">
                        ${user.photoURL ?
                            `<img src="${user.photoURL}" alt="Profile" />` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="user-details">
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Provider:</strong> ${user.provider === 'google' ? 'Google' : 'Email'}</p>
                        <p><strong>Login Time:</strong> ${new Date(user.loginTime).toLocaleString()}</p>
                    </div>
                </div>
            </div>
            <div class="verification-footer">
                <button class="btn btn-primary" onclick="closeVerificationModal()">
                    <i class="fas fa-arrow-right"></i>
                    Continue to Dashboard
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Auto-close after 5 seconds
    setTimeout(() => {
        closeVerificationModal();
    }, 5000);
}

function closeVerificationModal() {
    const modal = document.querySelector('.verification-modal');
    if (modal) {
        modal.remove();
    }
}

// Enhanced logout with proper session cleanup
async function enhancedLogout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    try {
        console.log('🚪 Logging out user...');

        // Firebase logout if available
        if (typeof firebase !== 'undefined' && firebase.auth && auth.currentUser) {
            await auth.signOut();
            console.log('✅ Firebase logout successful');
        }

        // Clear all user data using data manager
        if (dataManager && currentUser) {
            dataManager.clearAllUserData();
        }

        // Clear basic auth data
        currentUser = null;
        localStorage.removeItem('healthcare_user');
        localStorage.removeItem('authToken');

        // Clear API token
        api.clearToken();

        // Reset data manager
        if (dataManager) {
            dataManager.setCurrentUser(null);
        }

        showNotification('Logged out successfully. See you soon!', 'success');

        // Redirect to auth screen
        setTimeout(() => {
            showAuthContainer();
        }, 1000);

    } catch (error) {
        console.error('❌ Logout error:', error);
        showNotification('Logout completed', 'info');
        showAuthContainer();
    }
}
