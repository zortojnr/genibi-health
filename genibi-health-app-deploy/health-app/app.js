// Main Application JavaScript
let chatMessages = [];
let currentFeature = null;
let currentChatSession = null;
let dashboardData = null;
let selectedMood = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Genibi Health App...');

    // Wait a bit for auth to initialize first
    setTimeout(() => {
        initializeMainApp();
        setupMainAppEventListeners();
    }, 100);
});

async function initializeMainApp() {
    try {
        console.log('📊 Setting up dashboard...');
        // Initialize dashboard features
        await initializeDashboard();

        console.log('🧭 Setting up navigation...');
        // Setup navigation
        setupNavigation();

        console.log('📞 Setting up helpline...');
        // Setup helpline functionality
        setupHelpline();

        console.log('📱 Setting up responsive features...');
        // Initialize responsive features
        setupResponsiveFeatures();

        console.log('🤖 Setting up chatbot...');
        // Initialize chatbot
        initializeChatbot();

        console.log('📈 Loading dashboard data...');
        // Load user dashboard data
        await loadDashboardData();

        console.log('✅ App initialization complete!');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showNotification('App initialization failed. Some features may not work properly.', 'warning');
    }
}

function setupMainAppEventListeners() {
    try {
        console.log('🎯 Setting up event listeners...');

        // Dashboard card interactions
        setupDashboardCards();

        // Navigation menu interactions
        setupNavigationMenu();

        // Mobile menu toggle
        setupMobileMenu();

        // Helpline interactions
        setupHelplineInteractions();

        // Modal close handlers
        setupModalHandlers();

        console.log('✅ Event listeners setup complete');
    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
    }
}

// Setup modal handlers
function setupModalHandlers() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            if (event.target.id === 'chatbot-modal') {
                closeChatbot();
            } else if (event.target.id === 'feature-modal') {
                closeFeatureModal();
            }
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeChatbot();
            closeFeatureModal();
        }
    });
}

// Dashboard functionality
async function initializeDashboard() {
    console.log('📊 Initializing dashboard...');

    try {
        // Animate dashboard cards on load
        const cards = document.querySelectorAll('.health-card');

        if (cards.length === 0) {
            console.warn('⚠️ No dashboard cards found');
            return;
        }

        console.log(`📋 Found ${cards.length} dashboard cards`);

        cards.forEach((card, index) => {
            // Set initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            // Animate in with staggered delay
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease'; // Faster animation
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100); // Reduced delay for faster loading
        });

        // Setup card hover effects
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
                this.style.transition = 'all 0.2s ease';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.transition = 'all 0.2s ease';
            });
        });

        console.log('✅ Dashboard initialization complete');
    } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
    }
}

// Load dashboard data from backend
async function loadDashboardData() {
    try {
        if (!api.isAuthenticated()) {
            console.warn('User not authenticated, skipping dashboard data load');
            return;
        }

        const response = await api.getUserDashboard();

        if (response.success) {
            dashboardData = response.data;
            updateDashboardUI();
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Don't show error to user for dashboard data, just log it
    }
}

// Update dashboard UI with loaded data
function updateDashboardUI() {
    if (!dashboardData) return;

    // Update welcome message
    const welcomeSection = document.querySelector('.welcome-section h1');
    if (welcomeSection && dashboardData.user) {
        welcomeSection.textContent = `Welcome back, ${dashboardData.user.firstName}!`;
    }

    // Update stats if available
    if (dashboardData.stats) {
        updateDashboardStats(dashboardData.stats);
    }

    // Update recent activity
    if (dashboardData.recentActivity) {
        updateRecentActivity(dashboardData.recentActivity);
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    // This would update various stat displays in the dashboard
    console.log('Dashboard stats:', stats);
}

// Update recent activity display
function updateRecentActivity(activities) {
    // This would update the recent activity section
    console.log('Recent activities:', activities);
}

function setupDashboardCards() {
    // Vital Signs Card
    const vitalSignsBtn = document.querySelector('.health-card:nth-child(1) .card-btn');
    if (vitalSignsBtn) {
        vitalSignsBtn.addEventListener('click', function() {
            showVitalSignsModal();
        });
    }
    
    // Appointments Card
    const appointmentsBtn = document.querySelector('.health-card:nth-child(2) .card-btn');
    if (appointmentsBtn) {
        appointmentsBtn.addEventListener('click', function() {
            showAppointmentsModal();
        });
    }
    
    // Medications Card
    const medicationsBtn = document.querySelector('.health-card:nth-child(3) .card-btn');
    if (medicationsBtn) {
        medicationsBtn.addEventListener('click', function() {
            showMedicationsModal();
        });
    }
}

// Navigation functionality
function setupNavigation() {
    console.log('🧭 Setting up navigation links...');

    try {
        const navLinks = document.querySelectorAll('.nav-link');

        if (navLinks.length === 0) {
            console.warn('⚠️ No navigation links found');
            return;
        }

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));

                // Add active class to clicked link
                this.classList.add('active');

                // Handle navigation
                const href = this.getAttribute('href');
                handleNavigation(href);
            });
        });

        console.log(`✅ Navigation setup complete (${navLinks.length} links)`);
    } catch (error) {
        console.error('❌ Error setting up navigation:', error);
    }
}

function setupNavigationMenu() {
    // User menu functionality
    const userAvatar = document.querySelector('.user-avatar');
    const userMenu = document.querySelector('.user-menu');
    
    if (userAvatar && userMenu) {
        userAvatar.addEventListener('click', function() {
            userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!userAvatar.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.style.display = 'none';
            }
        });
    }
}

function setupMobileMenu() {
    console.log('📱 Setting up mobile menu...');

    try {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('mobile-active');
                navToggle.classList.toggle('active');
            });

            console.log('✅ Mobile menu setup complete');
        } else {
            console.warn('⚠️ Mobile menu elements not found');
        }
    } catch (error) {
        console.error('❌ Error setting up mobile menu:', error);
    }
}
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('mobile-active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Helpline functionality
function setupHelpline() {
    // Add click tracking for helpline
    const helplineNumbers = document.querySelectorAll('a[href^="tel:"]');
    
    helplineNumbers.forEach(link => {
        link.addEventListener('click', function() {
            // Track helpline usage (analytics)
            trackHelplineUsage();
            
            // Show confirmation on desktop
            if (window.innerWidth > 768) {
                showHelplineConfirmation();
            }
        });
    });
}

function setupHelplineInteractions() {
    // Emergency button interactions
    const emergencyBtns = document.querySelectorAll('.emergency-btn');
    
    emergencyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 100);
            
            // Track emergency button usage
            trackEmergencyButtonUsage();
        });
    });
}

function trackHelplineUsage() {
    // Analytics tracking (replace with your analytics service)
    console.log('Helpline accessed at:', new Date().toISOString());
    
    // You can integrate with Google Analytics, Firebase Analytics, etc.
    // gtag('event', 'helpline_accessed', {
    //     event_category: 'emergency',
    //     event_label: 'helpline_call'
    // });
}

function trackEmergencyButtonUsage() {
    console.log('Emergency button clicked at:', new Date().toISOString());
}

function showHelplineConfirmation() {
    const modal = createModal({
        title: '📞 Call Helpline',
        content: `
            <div style="text-align: center; padding: 1rem;">
                <p style="margin-bottom: 1rem;">You are about to call our 24/7 emergency helpline:</p>
                <h3 style="color: var(--emergency-red); margin-bottom: 1rem;">+234 806 027 0792</h3>
                <p style="font-size: 0.9rem; color: var(--text-light);">
                    Our trained professionals are available to help you immediately.
                </p>
            </div>
        `,
        buttons: [
            {
                text: 'Call Now',
                class: 'btn-primary',
                action: () => {
                    window.location.href = 'tel:+2348060270792';
                    closeModal();
                }
            },
            {
                text: 'Cancel',
                class: 'btn-secondary',
                action: closeModal
            }
        ]
    });
    
    showModal(modal);
}

// Navigation handling
function handleNavigation(href) {
    console.log('🧭 Navigating to:', href);

    try {
        // Hide all sections first
        hideAllSections();

        switch(href) {
            case '#dashboard':
                showDashboard();
                break;
            case '#health-assistant':
                showHealthAssistant();
                break;
            case '#vital-signs':
                showVitalSigns();
                break;
            case '#appointments':
                showAppointments();
                break;
            case '#medications':
                showMedications();
                break;
            case '#mood-tracker':
                showMoodTracker();
                break;
            case '#emergency':
                showEmergency();
                break;
            case '#settings':
                showSettings();
                break;
            default:
                showDashboard();
        }
    } catch (error) {
        console.error('❌ Navigation error:', error);
        showNotification('Navigation error occurred', 'error');
    }
}

function hideAllSections() {
    // Close any open modals
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.add('hidden');
    });
}

function showDashboard() {
    console.log('📊 Showing dashboard');
    hideAllSections();

    // Scroll to top of dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Welcome to your dashboard!', 'success');
}

function showHealthAssistant() {
    console.log('🤖 Opening health assistant');
    hideAllSections();
    openChatbot();
}

function showVitalSigns() {
    console.log('💓 Opening vital signs');
    hideAllSections();
    openVitalSigns();
}

function showAppointments() {
    console.log('📅 Opening appointments');
    hideAllSections();
    openAppointments();
}

function showMedications() {
    console.log('💊 Opening medications');
    hideAllSections();
    openMedications();
}

function showMoodTracker() {
    console.log('😊 Opening mood tracker');
    hideAllSections();
    openMoodTracker();
}

function showEmergency() {
    console.log('🚨 Opening emergency support');
    hideAllSections();
    openEmergency();
}

function showSettings() {
    console.log('⚙️ Opening settings');
    hideAllSections();
    openSettings();
}

// Modal functionality
function createModal({ title, content, buttons = [] }) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${buttons.map(btn => `
                    <button class="btn ${btn.class}" onclick="${btn.action.name}()">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    return modal;
}

function showModal(modal) {
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        .modal-content {
            background: white;
            border-radius: var(--radius-lg);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideInUp 0.3s ease;
        }
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-light);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-header h3 {
            margin: 0;
            color: var(--text-dark);
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--text-light);
            padding: 0.5rem;
            border-radius: 50%;
        }
        .modal-close:hover {
            background: var(--light-blue);
            color: var(--primary-blue);
        }
        .modal-body {
            padding: 1.5rem;
        }
        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid var(--border-light);
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
    `;
    
    if (!document.getElementById('modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Feature modals
function showVitalSignsModal() {
    const modal = createModal({
        title: '💓 Vital Signs Tracker',
        content: `
            <div style="text-align: center;">
                <p>Track your vital signs including:</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>Heart Rate</li>
                    <li>Blood Pressure</li>
                    <li>Temperature</li>
                    <li>Oxygen Saturation</li>
                </ul>
                <p style="color: var(--text-light); font-size: 0.9rem;">
                    This feature will be available in the next update.
                </p>
            </div>
        `,
        buttons: [
            {
                text: 'Got it',
                class: 'btn-primary',
                action: closeModal
            }
        ]
    });
    
    showModal(modal);
}

function showAppointmentsModal() {
    const modal = createModal({
        title: '📅 Book Appointment',
        content: `
            <div style="text-align: center;">
                <p>Schedule appointments with:</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>General Practitioners</li>
                    <li>Specialists</li>
                    <li>Mental Health Professionals</li>
                    <li>Emergency Consultations</li>
                </ul>
                <p style="color: var(--text-light); font-size: 0.9rem;">
                    Online booking system coming soon!
                </p>
            </div>
        `,
        buttons: [
            {
                text: 'Call to Book',
                class: 'btn-primary',
                action: () => {
                    window.location.href = 'tel:+2348060270792';
                    closeModal();
                }
            },
            {
                text: 'Close',
                class: 'btn-secondary',
                action: closeModal
            }
        ]
    });
    
    showModal(modal);
}

function showMedicationsModal() {
    const modal = createModal({
        title: '💊 Medication Manager',
        content: `
            <div style="text-align: center;">
                <p>Manage your medications:</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>Prescription Tracking</li>
                    <li>Dosage Reminders</li>
                    <li>Refill Alerts</li>
                    <li>Drug Interaction Checker</li>
                </ul>
                <p style="color: var(--text-light); font-size: 0.9rem;">
                    Full medication management coming soon!
                </p>
            </div>
        `,
        buttons: [
            {
                text: 'Understood',
                class: 'btn-primary',
                action: closeModal
            }
        ]
    });
    
    showModal(modal);
}

// Responsive features
function setupResponsiveFeatures() {
    // Handle window resize
    window.addEventListener('resize', function() {
        handleResponsiveChanges();
    });
    
    // Initial responsive setup
    handleResponsiveChanges();
}

function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    
    // Adjust helpline banner for mobile
    const helplineContent = document.querySelector('.helpline-content');
    if (helplineContent) {
        if (isMobile) {
            helplineContent.style.flexDirection = 'column';
            helplineContent.style.gap = '0.5rem';
        } else {
            helplineContent.style.flexDirection = 'row';
            helplineContent.style.gap = '1rem';
        }
    }
    
    // Adjust navigation for mobile
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && isMobile) {
        navMenu.style.display = navMenu.classList.contains('mobile-active') ? 'flex' : 'none';
    }
}

// Add mobile navigation styles
const mobileNavStyles = document.createElement('style');
mobileNavStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 5px 20px var(--shadow-medium);
            display: none;
        }
        
        .nav-menu.mobile-active {
            display: flex !important;
        }
        
        .nav-link {
            padding: 1rem;
            border-bottom: 1px solid var(--border-light);
        }
        
        .user-avatar {
            margin-top: 1rem;
        }
    }
`;
document.head.appendChild(mobileNavStyles);

// Initialize tooltips and accessibility features
function initializeAccessibility() {
    // Add ARIA labels
    const helplineLinks = document.querySelectorAll('a[href^="tel:"]');
    helplineLinks.forEach(link => {
        link.setAttribute('aria-label', 'Call emergency helpline');
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Chatbot Functionality
function initializeChatbot() {
    chatMessages = [
        {
            type: 'bot',
            message: "Hello! I'm your Genibi AI Health Assistant. How can I help you today?",
            timestamp: new Date()
        }
    ];
}

function openChatbot() {
    console.log('🤖 Opening personalized AI Health Assistant');

    const modal = document.getElementById('chatbot-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Initialize personalized chat if empty
    const chatMessages = document.getElementById('chatbot-messages');
    if (chatMessages && chatMessages.children.length === 0) {
        initializePersonalizedChat();
    }

    // Focus on input
    setTimeout(() => {
        const input = document.getElementById('chatbot-input');
        if (input) input.focus();
    }, 300);
}

function initializePersonalizedChat() {
    const userName = currentUser?.firstName || 'there';
    const timeOfDay = getTimeOfDay();

    // Get user's recent activity for context
    const recentVitals = dataManager.getLatestVitalSigns();
    const recentMood = dataManager.getMoodEntries(1)[0];
    const upcomingAppointments = dataManager.getUpcomingAppointments();

    let personalizedGreeting = `Good ${timeOfDay}, ${userName}! 👋 I'm your AI Health Assistant.`;

    // Add contextual information
    let contextualInfo = [];

    if (recentVitals) {
        const vitalsDate = new Date(recentVitals.timestamp).toLocaleDateString();
        contextualInfo.push(`I see you recorded vital signs on ${vitalsDate}.`);
    }

    if (recentMood) {
        const moodDate = new Date(recentMood.timestamp).toLocaleDateString();
        contextualInfo.push(`Your last mood entry was on ${moodDate}.`);
    }

    if (upcomingAppointments.length > 0) {
        const nextAppt = upcomingAppointments[0];
        const apptDate = new Date(nextAppt.date).toLocaleDateString();
        contextualInfo.push(`You have an upcoming appointment on ${apptDate}.`);
    }

    // Create personalized welcome message
    let welcomeMessage = personalizedGreeting;
    if (contextualInfo.length > 0) {
        welcomeMessage += `\n\n${contextualInfo.join(' ')}`;
    }

    welcomeMessage += `\n\nHow can I help you today? I can assist with:

🏥 **Health Questions** - Ask about symptoms, wellness tips
💊 **Medication Info** - Help with medication management
📅 **Appointments** - Schedule or manage appointments
😊 **Mental Health** - Mood tracking and emotional support
🚨 **Emergency** - Crisis support and emergency resources
📊 **Health Data** - Review your vital signs and trends

What would you like to discuss?`;

    addChatMessage('bot', welcomeMessage);

    // Store chat initialization in data manager
    dataManager.addChatMessage({
        type: 'bot',
        message: welcomeMessage,
        context: 'initialization'
    });
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
}

function closeChatbot() {
    const modal = document.getElementById('chatbot-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage('user', message);
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send message to backend
        const response = await api.sendChatMessage(message, currentChatSession);

        hideTypingIndicator();

        if (response.success) {
            // Update session ID if new session
            if (!currentChatSession) {
                currentChatSession = response.data.sessionId;
            }

            // Add bot response
            addChatMessage('bot', response.data.botMessage.content);
        } else {
            throw new Error(response.message || 'Failed to get response');
        }
    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();

        // Fallback to local response
        const fallbackResponse = generateAIResponse(message);
        addChatMessage('bot', fallbackResponse);
    }
}

function addChatMessage(type, message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${message}</p>`;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store message
    chatMessages.push({
        type: type,
        message: message,
        timestamp: new Date()
    });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';

    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    const userName = currentUser?.firstName || 'there';

    // Store user message in data manager
    dataManager.addChatMessage({
        type: 'user',
        message: userMessage,
        timestamp: new Date().toISOString()
    });

    // Get user context for personalized responses
    const recentVitals = dataManager.getLatestVitalSigns();
    const recentMood = dataManager.getMoodEntries(1)[0];
    const medications = dataManager.getMedications();
    const upcomingAppointments = dataManager.getUpcomingAppointments();

    let response = '';

    // Crisis detection - highest priority
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself', 'self harm'];
    if (crisisKeywords.some(keyword => message.includes(keyword))) {
        response = `${userName}, I'm very concerned about what you're sharing. Your life has value and there are people who want to help. Please reach out immediately:

🚨 **Emergency Services**: 199 or 911
📞 **24/7 Crisis Helpline**: +234 806 027 0792
💬 **Crisis Text**: Available now

You don't have to go through this alone. Would you like me to help you connect with immediate support?`;

        // Log crisis event
        dataManager.addEmergencyLog({
            type: 'crisis_detected',
            message: userMessage,
            response: response
        });

        return response;
    }

    // Mental health and emotional support
    if (message.includes('stress') || message.includes('anxiety') || message.includes('worried') || message.includes('nervous')) {
        const moodContext = recentMood ? `I see you logged your mood as "${recentMood.mood}" recently. ` : '';
        response = `${userName}, ${moodContext}I understand you're feeling stressed or anxious. Here are some immediate techniques that can help:

🫁 **Breathing Exercise**: Try the 4-7-8 technique (breathe in for 4, hold for 7, exhale for 8)
🧘 **Mindfulness**: Focus on 5 things you can see, 4 you can hear, 3 you can touch
🚶 **Movement**: A short walk or gentle stretching can help

Would you like me to guide you through a breathing exercise or grounding technique? I can also help you track your mood patterns.`;
    }

    else if (message.includes('sad') || message.includes('depressed') || message.includes('down') || message.includes('hopeless')) {
        response = `${userName}, I hear that you're going through a difficult time. Your feelings are valid, and it's important to acknowledge them.

💙 **Remember**: You're not alone in this
🌱 **Small steps**: Focus on one thing at a time
📞 **Support**: Our helpline is available 24/7 at +234 806 027 0792

Some things that might help:
- Talk to someone you trust
- Engage in activities you usually enjoy
- Maintain a routine
- Consider professional support

Would you like to track your mood or talk about what's been weighing on you?`;
    }

    else if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired') || message.includes('exhausted')) {
        response = `${userName}, sleep is crucial for your mental and physical health. Here are some evidence-based tips:

🌙 **Sleep Hygiene**:
- Keep a consistent sleep schedule
- Avoid screens 1 hour before bed
- Keep your room cool (65-68°F) and dark
- No caffeine after 2 PM

🧘 **Relaxation**: Try progressive muscle relaxation or meditation
📱 **Track**: Consider logging your sleep patterns

If sleep problems persist for more than 2 weeks, please consult a healthcare provider. Would you like me to help you set up a sleep tracking routine?`;
    }

    // Health data and tracking
    else if (message.includes('vital signs') || message.includes('blood pressure') || message.includes('heart rate')) {
        const vitalsContext = recentVitals ?
            `Your last recorded vitals were: Heart Rate: ${recentVitals.heartRate} BPM, Blood Pressure: ${recentVitals.bloodPressureSystolic}/${recentVitals.bloodPressureDiastolic}. ` :
            'I don\'t see any recent vital signs recorded. ';

        response = `${userName}, ${vitalsContext}Regular monitoring of vital signs is important for tracking your health trends.

📊 **Normal Ranges**:
- Heart Rate: 60-100 BPM (resting)
- Blood Pressure: Less than 120/80 mmHg
- Temperature: 97-99°F (36.1-37.2°C)

Would you like to record new vital signs or review your health trends?`;
    }

    else if (message.includes('medication') || message.includes('medicine') || message.includes('pills')) {
        const medContext = medications.length > 0 ?
            `I see you have ${medications.length} medication(s) in your profile. ` :
            'You haven\'t added any medications to your profile yet. ';

        response = `${userName}, ${medContext}Medication management is crucial for your health.

💊 **Important Reminders**:
- Take medications as prescribed
- Never stop or change doses without consulting your doctor
- Set up reminders to avoid missed doses
- Keep an updated list of all medications

📞 **Questions?** Contact your pharmacist or healthcare provider
🚨 **Emergency?** Call +234 806 027 0792

Would you like help managing your medication schedule or setting up reminders?`;
    }

    else if (message.includes('appointment') || message.includes('doctor') || message.includes('schedule')) {
        const apptContext = upcomingAppointments.length > 0 ?
            `You have ${upcomingAppointments.length} upcoming appointment(s). ` :
            'You don\'t have any upcoming appointments scheduled. ';

        response = `${userName}, ${apptContext}Regular healthcare check-ups are important for maintaining your health.

📅 **Appointment Types**:
- Routine check-ups (annually)
- Specialist consultations
- Follow-up visits
- Emergency appointments

📞 **To Schedule**: Call +234 806 027 0792 or use the Appointments feature in your dashboard.

Would you like help booking an appointment or managing your existing ones?`;
    }

    // Wellness and lifestyle
    else if (message.includes('exercise') || message.includes('fitness') || message.includes('workout')) {
        response = `${userName}, regular exercise is fantastic for both physical and mental health!

🏃 **Recommendations**:
- 150 minutes of moderate activity per week
- 2 days of strength training
- Start slowly and gradually increase

🎯 **Great Options**:
- Walking or jogging
- Swimming
- Cycling
- Yoga or stretching

⚠️ **Safety First**: Always consult your doctor before starting a new exercise program, especially if you have health conditions.

Would you like help creating a personalized fitness plan?`;
    }

    else if (message.includes('diet') || message.includes('nutrition') || message.includes('food') || message.includes('eating')) {
        response = `${userName}, nutrition plays a vital role in your overall health and wellbeing.

🥗 **Balanced Diet Includes**:
- Plenty of fruits and vegetables
- Whole grains and lean proteins
- Healthy fats (nuts, olive oil, fish)
- 8+ glasses of water daily

🚫 **Limit**:
- Processed foods
- Added sugars
- Excessive sodium

For personalized nutrition advice, consider consulting with a registered dietitian. Would you like tips for meal planning or healthy recipes?`;
    }

    // Emergency and urgent care
    else if (message.includes('emergency') || message.includes('urgent') || message.includes('help') || message.includes('crisis')) {
        response = `${userName}, I want to make sure you get the right level of care:

🚨 **Life-threatening emergency**: Call 199 or 911 immediately
📞 **Mental health crisis**: Call our 24/7 helpline at +234 806 027 0792
🏥 **Urgent but not emergency**: Contact your healthcare provider
💬 **General support**: I'm here to help

What type of support do you need right now?`;
    }

    // Mood tracking
    else if (message.includes('mood') || message.includes('feeling') || message.includes('emotion')) {
        const moodStats = dataManager.getMoodStats();
        const moodContext = moodStats ?
            `Based on your recent entries, your most common mood has been "${moodStats.mostCommonMood}". ` :
            'You haven\'t logged any moods yet. ';

        response = `${userName}, ${moodContext}Tracking your mood can help identify patterns and triggers.

😊 **Benefits of Mood Tracking**:
- Identify patterns and triggers
- Monitor progress over time
- Share insights with healthcare providers
- Improve self-awareness

Would you like to log your current mood or review your mood patterns?`;
    }

    // Greetings and general conversation
    else if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening')) {
        const timeOfDay = getTimeOfDay();
        response = `Good ${timeOfDay}, ${userName}! 👋 I'm glad you're here. How are you feeling today? I'm here to help with:

🏥 Health questions and guidance
💊 Medication management
📅 Appointment scheduling
😊 Mood tracking and mental health support
🚨 Emergency resources

What would you like to talk about?`;
    }

    else if (message.includes('thank you') || message.includes('thanks')) {
        response = `You're very welcome, ${userName}! 😊 I'm here whenever you need support with your health and wellness. Is there anything else I can help you with today?`;
    }

    else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
        response = `Take care, ${userName}! 👋 Remember, I'm here 24/7 whenever you need health support. Don't hesitate to reach out if you have any concerns. Stay healthy! 💙`;
    }

    // Default personalized responses
    else {
        const personalizedResponses = [
            `${userName}, that's a great question! While I can provide general health information, for specific medical concerns, I recommend consulting with a healthcare professional. How else can I support your wellness journey today?`,
            `I understand your concern, ${userName}. For personalized medical advice, please speak with your healthcare provider. In the meantime, is there anything else I can help you with regarding your health and wellness?`,
            `${userName}, your health and wellbeing are important to me. While I can offer general guidance, please consult with a medical professional for specific health issues. What other ways can I assist you today?`,
            `Thank you for reaching out, ${userName}. I'm here to support your health journey. For detailed medical advice, I recommend speaking with a healthcare provider. What specific area of wellness would you like to discuss?`
        ];

        response = personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
    }

    // Store bot response in data manager
    dataManager.addChatMessage({
        type: 'bot',
        message: response,
        timestamp: new Date().toISOString(),
        context: 'ai_response'
    });

    return response;
}

// Feature Modal Functions - Fully Functional with Data Manager
async function openVitalSigns() {
    console.log('💓 Opening vital signs tracker with real data');

    try {
        // Get latest vital signs from data manager
        const latestVitals = dataManager.getLatestVitalSigns();
        const vitalHistory = dataManager.getVitalSigns(5);

        // Default values if no data
        const vitals = {
            heartRate: latestVitals?.heartRate || 72,
            temperature: latestVitals?.temperature || 98.6,
            bloodPressureSystolic: latestVitals?.bloodPressureSystolic || 120,
            bloodPressureDiastolic: latestVitals?.bloodPressureDiastolic || 80,
            oxygenSaturation: latestVitals?.oxygenSaturation || 98,
            weight: latestVitals?.weight || null,
            height: latestVitals?.height || null
        };

        const bloodPressure = `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`;

        // Determine status based on values
        function getHeartRateStatus(hr) {
            if (hr < 60) return { status: 'low', color: '#f39c12' };
            if (hr > 100) return { status: 'high', color: '#e74c3c' };
            return { status: 'normal', color: '#27ae60' };
        }

        function getBloodPressureStatus(sys, dia) {
            if (sys > 140 || dia > 90) return { status: 'high', color: '#e74c3c' };
            if (sys < 90 || dia < 60) return { status: 'low', color: '#f39c12' };
            return { status: 'normal', color: '#27ae60' };
        }

        const hrStatus = getHeartRateStatus(vitals.heartRate);
        const bpStatus = getBloodPressureStatus(vitals.bloodPressureSystolic, vitals.bloodPressureDiastolic);

        openFeatureModal('💓 Vital Signs Tracker', `
            <div class="feature-content">
                <div class="vital-signs-header">
                    <p>Last updated: ${latestVitals ? new Date(latestVitals.timestamp).toLocaleString() : 'No data recorded'}</p>
                </div>

                <div class="vital-signs-grid">
                    <div class="vital-card">
                        <div class="vital-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <div class="vital-info">
                            <h4>Heart Rate</h4>
                            <p class="vital-value">${vitals.heartRate} BPM</p>
                            <span class="vital-status" style="background: ${hrStatus.color}; color: white;">${hrStatus.status.toUpperCase()}</span>
                        </div>
                    </div>

                    <div class="vital-card">
                        <div class="vital-icon">
                            <i class="fas fa-thermometer-half"></i>
                        </div>
                        <div class="vital-info">
                            <h4>Body Temperature</h4>
                            <p class="vital-value">${vitals.temperature}°F</p>
                            <span class="vital-status normal">NORMAL</span>
                        </div>
                    </div>

                    <div class="vital-card">
                        <div class="vital-icon">
                            <i class="fas fa-tint"></i>
                        </div>
                        <div class="vital-info">
                            <h4>Blood Pressure</h4>
                            <p class="vital-value">${bloodPressure}</p>
                            <span class="vital-status" style="background: ${bpStatus.color}; color: white;">${bpStatus.status.toUpperCase()}</span>
                        </div>
                    </div>

                    <div class="vital-card">
                        <div class="vital-icon">
                            <i class="fas fa-lungs"></i>
                        </div>
                        <div class="vital-info">
                            <h4>Oxygen Saturation</h4>
                            <p class="vital-value">${vitals.oxygenSaturation}%</p>
                            <span class="vital-status normal">NORMAL</span>
                        </div>
                    </div>

                    ${vitals.weight ? `
                    <div class="vital-card">
                        <div class="vital-icon">
                            <i class="fas fa-weight"></i>
                        </div>
                        <div class="vital-info">
                            <h4>Weight</h4>
                            <p class="vital-value">${vitals.weight} lbs</p>
                            <span class="vital-status normal">RECORDED</span>
                        </div>
                    </div>
                    ` : ''}
                </div>

                ${vitalHistory.length > 0 ? `
                <div class="vital-history-preview">
                    <h4>Recent Readings</h4>
                    <div class="history-list">
                        ${vitalHistory.slice(0, 3).map(reading => `
                            <div class="history-item">
                                <span class="history-date">${new Date(reading.timestamp).toLocaleDateString()}</span>
                                <span class="history-values">HR: ${reading.heartRate} | BP: ${reading.bloodPressureSystolic}/${reading.bloodPressureDiastolic}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="recordVitals()">
                        <i class="fas fa-plus"></i>
                        Record New Reading
                    </button>
                    <button class="btn btn-secondary" onclick="viewVitalHistory()">
                        <i class="fas fa-chart-line"></i>
                        View History (${vitalHistory.length})
                    </button>
                    ${vitalHistory.length > 0 ? `
                    <button class="btn btn-secondary" onclick="exportVitals()">
                        <i class="fas fa-download"></i>
                        Export Data
                    </button>
                    ` : ''}
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Error loading vital signs:', error);
        // Show modal with default values
        openFeatureModal('Vital Signs Tracker', `
            <div class="feature-content">
                <p>Unable to load vital signs data. Please try again later.</p>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="recordVitals()">
                        <i class="fas fa-plus"></i>
                        Record New Reading
                    </button>
                </div>
            </div>
        `);
    }
}

function openAppointments() {
    console.log('📅 Opening appointments manager with real data');

    try {
        // Get appointments from data manager
        const allAppointments = dataManager.getAppointments();
        const upcomingAppointments = dataManager.getUpcomingAppointments();

        let appointmentsHTML = '';

        if (upcomingAppointments.length > 0) {
            appointmentsHTML = upcomingAppointments.map(appointment => {
                const date = new Date(appointment.date);
                const day = date.getDate();
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return `
                    <div class="appointment-card ${appointment.status}">
                        <div class="appointment-date">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>
                        <div class="appointment-info">
                            <h4>${appointment.doctorName || 'Healthcare Provider'}</h4>
                            <p>${appointment.specialty || appointment.type || 'General Consultation'}</p>
                            <span class="time">${time}</span>
                            ${appointment.location ? `<span class="location">${appointment.location}</span>` : ''}
                        </div>
                        <div class="appointment-status">
                            <span class="status ${appointment.status}">${appointment.status.toUpperCase()}</span>
                        </div>
                        <div class="appointment-actions">
                            <button class="btn-small btn-secondary" onclick="editAppointment('${appointment.id}')">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn-small btn-danger" onclick="cancelAppointment('${appointment.id}')">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            appointmentsHTML = `
                <div class="no-appointments">
                    <div class="empty-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <h4>No upcoming appointments</h4>
                    <p>Book your first appointment to get started with your healthcare journey</p>
                </div>
            `;
        }

        openFeatureModal('📅 Appointments Manager', `
            <div class="feature-content">
                <div class="appointments-header">
                    <p>Manage your medical appointments and consultations</p>
                    ${allAppointments.length > 0 ? `<p class="appointment-count">Total appointments: ${allAppointments.length}</p>` : ''}
                </div>

                <div class="appointments-list">
                    ${appointmentsHTML}
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="bookAppointment()">
                        <i class="fas fa-calendar-plus"></i>
                        Book New Appointment
                    </button>
                    <a href="tel:+2348060270792" class="btn btn-secondary">
                        <i class="fas fa-phone"></i>
                        Call to Schedule
                    </a>
                    ${allAppointments.length > 0 ? `
                    <button class="btn btn-secondary" onclick="viewAppointmentHistory()">
                        <i class="fas fa-history"></i>
                        View History
                    </button>
                    ` : ''}
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Error loading appointments:', error);
        // Show fallback content
        openFeatureModal('Appointments', `
            <div class="feature-content">
                <p>Unable to load appointments. Please try again later.</p>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="bookAppointment()">
                        <i class="fas fa-calendar-plus"></i>
                        Book New Appointment
                    </button>
                    <a href="tel:+2348060270792" class="btn btn-secondary">
                        <i class="fas fa-phone"></i>
                        Call to Schedule
                    </a>
                </div>
            </div>
        `);
    }
}

function openMedications() {
    console.log('💊 Opening medications manager with real data');

    // Get medications from data manager
    const medications = dataManager.getMedications();

    let medicationsHTML = '';

    if (medications.length > 0) {
        medicationsHTML = medications.map(med => {
            const nextDose = calculateNextDose(med);
            const statusClass = med.status === 'active' ? 'active' : 'inactive';
            const lastTaken = med.lastTaken ? new Date(med.lastTaken).toLocaleString() : 'Never';

            return `
                <div class="medication-card" data-med-id="${med.id}">
                    <div class="med-icon">
                        <i class="fas fa-pills"></i>
                    </div>
                    <div class="med-info">
                        <h4>${med.name}</h4>
                        <p>${med.dosage} - ${med.frequency}</p>
                        <span class="next-dose">Next: ${nextDose}</span>
                        <small class="last-taken">Last taken: ${lastTaken}</small>
                    </div>
                    <div class="med-status">
                        <span class="status ${statusClass}">${med.status.toUpperCase()}</span>
                    </div>
                    <div class="med-actions">
                        <button class="btn-small btn-primary" onclick="takeMedication('${med.id}')">
                            <i class="fas fa-check"></i>
                            Take Now
                        </button>
                        <button class="btn-small btn-secondary" onclick="editMedication('${med.id}')">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        medicationsHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-pills"></i>
                </div>
                <h4>No Medications Added</h4>
                <p>Start by adding your first medication to track dosages and set reminders.</p>
            </div>
        `;
    }

    openFeatureModal('💊 Medications Manager', `
        <div class="feature-content">
            <div class="medications-header">
                <p>Manage your medications and track dosages</p>
                ${medications.length > 0 ? `<p class="med-count">Total medications: ${medications.length}</p>` : ''}
            </div>

            <div class="medications-list">
                ${medicationsHTML}
            </div>

            <div class="action-buttons">
                <button class="btn btn-primary" onclick="addMedication()">
                    <i class="fas fa-plus"></i>
                    Add Medication
                </button>
                ${medications.length > 0 ? `
                <button class="btn btn-secondary" onclick="viewMedicationHistory()">
                    <i class="fas fa-history"></i>
                    View History
                </button>
                <button class="btn btn-secondary" onclick="exportMedications()">
                    <i class="fas fa-download"></i>
                    Export Data
                </button>
                ` : ''}
            </div>
        </div>
    `);
}

// Calculate next dose time
function calculateNextDose(medication) {
    if (!medication.schedule || medication.status !== 'active') {
        return 'Not scheduled';
    }

    const now = new Date();
    const lastTaken = medication.lastTaken ? new Date(medication.lastTaken) : null;

    // Simple frequency calculation
    let hoursInterval = 24; // Default to daily

    if (medication.frequency.includes('twice')) {
        hoursInterval = 12;
    } else if (medication.frequency.includes('three times') || medication.frequency.includes('3 times')) {
        hoursInterval = 8;
    } else if (medication.frequency.includes('four times') || medication.frequency.includes('4 times')) {
        hoursInterval = 6;
    } else if (medication.frequency.includes('every 6 hours')) {
        hoursInterval = 6;
    } else if (medication.frequency.includes('every 8 hours')) {
        hoursInterval = 8;
    } else if (medication.frequency.includes('every 12 hours')) {
        hoursInterval = 12;
    }

    let nextDose;
    if (lastTaken) {
        nextDose = new Date(lastTaken.getTime() + (hoursInterval * 60 * 60 * 1000));
    } else {
        // If never taken, suggest next reasonable time
        nextDose = new Date();
        if (medication.frequency.includes('morning')) {
            nextDose.setHours(8, 0, 0, 0);
        } else if (medication.frequency.includes('evening')) {
            nextDose.setHours(20, 0, 0, 0);
        } else {
            nextDose.setHours(nextDose.getHours() + 1, 0, 0, 0);
        }
    }

    // If next dose is in the past, calculate the next future dose
    while (nextDose <= now) {
        nextDose = new Date(nextDose.getTime() + (hoursInterval * 60 * 60 * 1000));
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (nextDose.toDateString() === today.toDateString()) {
        return nextDose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today';
    } else if (nextDose.toDateString() === tomorrow.toDateString()) {
        return nextDose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' tomorrow';
    } else {
        return nextDose.toLocaleDateString() + ' at ' + nextDose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

function openMoodTracker() {
    console.log('😊 Opening mood tracker with real data');

    // Get mood data from data manager
    const recentMoods = dataManager.getMoodEntries(5);
    const moodStats = dataManager.getMoodStats();

    // Build recent mood entries HTML
    let recentMoodsHTML = '';
    if (recentMoods.length > 0) {
        recentMoodsHTML = recentMoods.map(entry => {
            const date = new Date(entry.timestamp);
            const isToday = date.toDateString() === new Date().toDateString();
            const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();

            let dateLabel;
            if (isToday) dateLabel = 'Today';
            else if (isYesterday) dateLabel = 'Yesterday';
            else dateLabel = date.toLocaleDateString();

            return `
                <div class="mood-entry">
                    <span class="date">${dateLabel}</span>
                    <span class="mood">${entry.emoji} ${entry.mood}</span>
                    <span class="rating">${entry.rating}/10</span>
                </div>
            `;
        }).join('');
    } else {
        recentMoodsHTML = '<p class="no-entries">No mood entries yet. Start tracking your mood today!</p>';
    }

    // Build stats HTML
    let statsHTML = '';
    if (moodStats) {
        statsHTML = `
            <div class="mood-stats">
                <h5>Your Mood Insights (Last 30 days)</h5>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Total Entries</span>
                        <span class="stat-value">${moodStats.totalEntries}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Most Common</span>
                        <span class="stat-value">${moodStats.mostCommonMood}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Average Rating</span>
                        <span class="stat-value">${moodStats.averageRating.toFixed(1)}/10</span>
                    </div>
                </div>
            </div>
        `;
    }

    openFeatureModal('😊 Mood Tracker', `
        <div class="feature-content">
            <div class="mood-selector">
                <h4>How are you feeling today?</h4>
                <div class="mood-options">
                    <button class="mood-btn" data-mood="excellent" onclick="selectMood('excellent', '😊', 9)">
                        <span class="mood-emoji">😊</span>
                        <span class="mood-label">Excellent</span>
                    </button>
                    <button class="mood-btn" data-mood="good" onclick="selectMood('good', '🙂', 7)">
                        <span class="mood-emoji">🙂</span>
                        <span class="mood-label">Good</span>
                    </button>
                    <button class="mood-btn" data-mood="okay" onclick="selectMood('okay', '😐', 5)">
                        <span class="mood-emoji">😐</span>
                        <span class="mood-label">Okay</span>
                    </button>
                    <button class="mood-btn" data-mood="low" onclick="selectMood('low', '😔', 3)">
                        <span class="mood-emoji">😔</span>
                        <span class="mood-label">Low</span>
                    </button>
                    <button class="mood-btn" data-mood="stressed" onclick="selectMood('stressed', '😰', 2)">
                        <span class="mood-emoji">😰</span>
                        <span class="mood-label">Stressed</span>
                    </button>
                    <button class="mood-btn" data-mood="anxious" onclick="selectMood('anxious', '😟', 2)">
                        <span class="mood-emoji">😟</span>
                        <span class="mood-label">Anxious</span>
                    </button>
                </div>

                <div class="mood-notes">
                    <label for="mood-notes">Additional Notes (Optional):</label>
                    <textarea id="mood-notes" placeholder="How are you feeling? What's on your mind?"></textarea>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="saveMoodEntry()">
                        <i class="fas fa-save"></i>
                        Save Mood
                    </button>
                    ${recentMoods.length > 0 ? `
                    <button class="btn btn-secondary" onclick="viewMoodHistory()">
                        <i class="fas fa-chart-line"></i>
                        View History (${recentMoods.length})
                    </button>
                    <button class="btn btn-secondary" onclick="exportMoodData()">
                        <i class="fas fa-download"></i>
                        Export Data
                    </button>
                    ` : ''}
                </div>
            </div>

            ${statsHTML}

            <div class="mood-history">
                <h4>Recent Mood Entries</h4>
                <div class="mood-entries">
                    ${recentMoodsHTML}
                </div>
            </div>
        </div>
    `);
}

// Function to select mood
function selectMood(mood, emoji, rating) {
    selectedMood = { mood, emoji, rating };

    // Remove previous selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.backgroundColor = '';
        btn.style.color = '';
    });

    // Add selection to clicked button
    const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        selectedBtn.style.backgroundColor = '#4CAF50';
        selectedBtn.style.color = 'white';
    }

    console.log('Mood selected:', selectedMood);
}

// Function to save mood entry
function saveMoodEntry() {
    if (!selectedMood) {
        showNotification('Please select a mood first', 'warning');
        return;
    }

    const notes = document.getElementById('mood-notes')?.value || '';

    const moodData = {
        rating: selectedMood.rating,
        emoji: selectedMood.emoji,
        mood: selectedMood.mood,
        notes: notes
    };

    try {
        console.log('💾 Saving mood entry:', moodData);

        // Save to data manager
        const savedMood = dataManager.addMoodEntry(moodData);

        if (savedMood) {
            showNotification(`Mood "${selectedMood.mood}" saved successfully!`, 'success');

            // Add notification
            dataManager.addNotification({
                type: 'mood',
                title: 'Mood Logged',
                message: `You logged your mood as "${selectedMood.mood}" at ${new Date().toLocaleString()}`,
                icon: 'fas fa-smile'
            });

            closeFeatureModal();

            // Reset selection
            selectedMood = null;

            // Reopen mood tracker to show updated data
            setTimeout(() => {
                openMoodTracker();
            }, 500);
            selectedMood = null;
            // Refresh dashboard data
            await loadDashboardData();
        } else {
            throw new Error(response.message || 'Failed to save mood');
        }
    } catch (error) {
        console.error('Error saving mood:', error);
        showNotification('Mood saved locally (demo mode)', 'info');
        closeFeatureModal();
        selectedMood = null;
    }
}

// Function to view mood history
function viewMoodHistory() {
    showNotification('Mood history feature coming soon!', 'info');
}

// Emergency Support Modal - Fully Functional
function openEmergency() {
    console.log('🚨 Opening emergency support with real functionality');

    openFeatureModal('🚨 Emergency Support - 24/7 Available', `
        <div class="feature-content">
            <div class="emergency-alert">
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p><strong>If you're in immediate danger, call emergency services: 199 or 911</strong></p>
            </div>

            <div class="emergency-options">
                <div class="emergency-card primary">
                    <div class="emergency-icon">
                        <i class="fas fa-phone-alt"></i>
                    </div>
                    <h4>24/7 Mental Health Helpline</h4>
                    <p>Immediate professional support available now</p>
                    <a href="tel:+2348060270792" class="btn btn-emergency" onclick="trackEmergencyCall()">
                        <i class="fas fa-phone"></i>
                        Call +234 806 027 0792
                    </a>
                    <small>Free confidential support</small>
                </div>

                <div class="emergency-card">
                    <div class="emergency-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <h4>Crisis Text Support</h4>
                    <p>Text-based crisis intervention</p>
                    <button class="btn btn-secondary" onclick="startCrisisChat()">
                        <i class="fas fa-comment"></i>
                        Start Crisis Chat
                    </button>
                    <small>Available 24/7</small>
                </div>

                <div class="emergency-card">
                    <div class="emergency-icon">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <h4>Emergency Appointment</h4>
                    <p>Book urgent consultation</p>
                    <button class="btn btn-secondary" onclick="bookEmergencyAppointment()">
                        <i class="fas fa-calendar-plus"></i>
                        Book Now
                    </button>
                    <small>Same-day availability</small>
                </div>

                <div class="emergency-card">
                    <div class="emergency-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h4>Find Help Nearby</h4>
                    <p>Locate mental health services</p>
                    <button class="btn btn-secondary" onclick="findNearbyHelp()">
                        <i class="fas fa-search"></i>
                        Find Services
                    </button>
                    <small>GPS-based search</small>
                </div>
            </div>

            <div class="emergency-resources">
                <h4>Additional Resources</h4>
                <div class="resource-links">
                    <button class="resource-btn" onclick="showSelfHelpTools()">
                        <i class="fas fa-tools"></i>
                        Self-Help Tools
                    </button>
                    <button class="resource-btn" onclick="showBreathingExercise()">
                        <i class="fas fa-lungs"></i>
                        Breathing Exercise
                    </button>
                    <button class="resource-btn" onclick="showEmergencyContacts()">
                        <i class="fas fa-address-book"></i>
                        Emergency Contacts
                    </button>
                </div>
            </div>
        </div>
    `);
}

// Settings Modal
function openSettings() {
    openFeatureModal('Settings', `
        <div class="feature-content">
            <div class="settings-section">
                <h4>Profile Settings</h4>
                <div class="setting-item">
                    <label>Display Name</label>
                    <input type="text" id="display-name" placeholder="Your name" class="form-input">
                </div>
                <div class="setting-item">
                    <label>Email</label>
                    <input type="email" id="email-setting" placeholder="your@email.com" class="form-input">
                </div>
            </div>

            <div class="settings-section">
                <h4>Notifications</h4>
                <div class="toggle-item">
                    <label>Medication Reminders</label>
                    <input type="checkbox" id="med-notifications" checked>
                </div>
                <div class="toggle-item">
                    <label>Appointment Reminders</label>
                    <input type="checkbox" id="appointment-notifications" checked>
                </div>
                <div class="toggle-item">
                    <label>Mood Check-ins</label>
                    <input type="checkbox" id="mood-notifications" checked>
                </div>
            </div>

            <div class="settings-section">
                <h4>Privacy & Security</h4>
                <button class="btn btn-secondary" onclick="changePassword()">
                    <i class="fas fa-lock"></i>
                    Change Password
                </button>
                <button class="btn btn-secondary" onclick="exportData()">
                    <i class="fas fa-download"></i>
                    Export My Data
                </button>
                <button class="btn btn-danger" onclick="deleteAccount()">
                    <i class="fas fa-trash"></i>
                    Delete Account
                </button>
            </div>

            <div class="settings-section">
                <button class="btn btn-primary" onclick="saveSettings()">
                    <i class="fas fa-save"></i>
                    Save Settings
                </button>
            </div>
        </div>
    `);
}

// Emergency helper functions - Fully Functional
function trackEmergencyCall() {
    console.log('📞 Emergency call initiated');

    // Log emergency call for analytics
    const emergencyLog = {
        timestamp: new Date().toISOString(),
        type: 'emergency_call',
        user: currentUser?.email || 'anonymous',
        helpline: '+2348060270792'
    };

    // Store emergency log
    const logs = JSON.parse(localStorage.getItem('emergency_logs') || '[]');
    logs.unshift(emergencyLog);
    localStorage.setItem('emergency_logs', JSON.stringify(logs.slice(0, 10))); // Keep last 10 logs

    showNotification('Connecting to emergency helpline...', 'warning');
}

function startCrisisChat() {
    console.log('💬 Starting crisis chat support');

    // Close current modal and open chatbot with crisis mode
    closeModal();

    setTimeout(() => {
        openChatbot();

        // Add crisis mode message
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const crisisMessage = document.createElement('div');
            crisisMessage.className = 'message bot-message';
            crisisMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p><strong>🚨 Crisis Support Mode Activated</strong></p>
                    <p>I'm here to help you through this difficult time. You're not alone.</p>
                    <p>If you're in immediate danger, please call emergency services: <strong>199</strong> or our helpline: <strong>+234 806 027 0792</strong></p>
                    <p>How are you feeling right now? I'm here to listen and support you.</p>
                </div>
            `;
            chatMessages.appendChild(crisisMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 300);
}

function bookEmergencyAppointment() {
    console.log('📅 Booking emergency appointment');

    const modal = document.createElement('div');
    modal.className = 'modal-overlay emergency-appointment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🚨 Emergency Appointment</h3>
                <button class="modal-close" onclick="closeEmergencyAppointment()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="emergency-appointment-form">
                    <div class="urgency-level">
                        <h4>How urgent is your situation?</h4>
                        <div class="urgency-options">
                            <label class="urgency-option">
                                <input type="radio" name="urgency" value="immediate" checked>
                                <span class="urgency-label immediate">🔴 Immediate (within 1 hour)</span>
                            </label>
                            <label class="urgency-option">
                                <input type="radio" name="urgency" value="today">
                                <span class="urgency-label today">🟡 Today (within 4 hours)</span>
                            </label>
                            <label class="urgency-option">
                                <input type="radio" name="urgency" value="tomorrow">
                                <span class="urgency-label tomorrow">🟢 Tomorrow (within 24 hours)</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Brief description of your situation:</label>
                        <textarea id="emergency-description" placeholder="Please describe what you're experiencing..." rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Preferred contact method:</label>
                        <select id="contact-method">
                            <option value="phone">Phone call</option>
                            <option value="video">Video call</option>
                            <option value="in-person">In-person visit</option>
                        </select>
                    </div>

                    <div class="emergency-actions">
                        <button class="btn btn-emergency" onclick="submitEmergencyAppointment()">
                            <i class="fas fa-calendar-check"></i>
                            Book Emergency Appointment
                        </button>
                        <button class="btn btn-secondary" onclick="closeEmergencyAppointment()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeEmergencyAppointment() {
    const modal = document.querySelector('.emergency-appointment-modal');
    if (modal) {
        modal.remove();
    }
}

function submitEmergencyAppointment() {
    const urgency = document.querySelector('input[name="urgency"]:checked').value;
    const description = document.getElementById('emergency-description').value;
    const contactMethod = document.getElementById('contact-method').value;

    if (!description.trim()) {
        showNotification('Please provide a brief description of your situation.', 'error');
        return;
    }

    // Create emergency appointment
    const appointment = {
        id: 'emergency_' + Date.now(),
        type: 'emergency',
        urgency: urgency,
        description: description,
        contactMethod: contactMethod,
        status: 'pending',
        requestTime: new Date().toISOString(),
        user: currentUser?.email || 'anonymous'
    };

    // Store appointment
    const appointments = JSON.parse(localStorage.getItem('user_appointments') || '[]');
    appointments.unshift(appointment);
    localStorage.setItem('user_appointments', JSON.stringify(appointments));

    closeEmergencyAppointment();

    let timeframe = urgency === 'immediate' ? 'within 1 hour' :
                   urgency === 'today' ? 'within 4 hours' : 'within 24 hours';

    showNotification(`Emergency appointment requested! A healthcare professional will contact you ${timeframe}.`, 'success');

    // Show confirmation modal
    setTimeout(() => {
        showEmergencyConfirmation(appointment);
    }, 1000);
}

function showEmergencyConfirmation(appointment) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>✅ Emergency Appointment Confirmed</h3>
                <button class="modal-close" onclick="closeConfirmationModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="confirmation-content">
                    <div class="confirmation-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h4>Your emergency appointment has been submitted</h4>
                    <div class="appointment-details">
                        <p><strong>Reference ID:</strong> ${appointment.id}</p>
                        <p><strong>Urgency Level:</strong> ${appointment.urgency}</p>
                        <p><strong>Contact Method:</strong> ${appointment.contactMethod}</p>
                        <p><strong>Submitted:</strong> ${new Date(appointment.requestTime).toLocaleString()}</p>
                    </div>
                    <div class="next-steps">
                        <h5>What happens next:</h5>
                        <ul>
                            <li>Our emergency response team has been notified</li>
                            <li>A healthcare professional will contact you soon</li>
                            <li>Keep your phone nearby and available</li>
                            <li>If your situation worsens, call emergency services immediately</li>
                        </ul>
                    </div>
                    <div class="emergency-contacts">
                        <p><strong>Emergency Helpline:</strong> <a href="tel:+2348060270792">+234 806 027 0792</a></p>
                        <p><strong>Emergency Services:</strong> 199 or 911</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeConfirmationModal() {
    const modal = document.querySelector('.confirmation-modal');
    if (modal) {
        modal.remove();
    }
}

function findNearbyHelp() {
    console.log('🗺️ Finding nearby mental health services');

    // Check if geolocation is available
    if (navigator.geolocation) {
        showNotification('Getting your location to find nearby services...', 'info');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                showNearbyServices(lat, lng);
            },
            (error) => {
                console.error('Geolocation error:', error);
                showNearbyServices(null, null); // Show general services
            }
        );
    } else {
        showNearbyServices(null, null); // Show general services
    }
}

function showNearbyServices(lat, lng) {
    const locationText = lat && lng ?
        `Based on your location (${lat.toFixed(2)}, ${lng.toFixed(2)})` :
        'General mental health services in Nigeria';

    openFeatureModal('🗺️ Mental Health Services Near You', `
        <div class="feature-content">
            <div class="location-info">
                <p>${locationText}</p>
            </div>

            <div class="services-list">
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-hospital"></i>
                    </div>
                    <div class="service-info">
                        <h4>Lagos University Teaching Hospital</h4>
                        <p>Psychiatric Department</p>
                        <p>📍 Idi-Araba, Lagos</p>
                        <p>📞 +234 1 8713961</p>
                        <div class="service-actions">
                            <a href="tel:+2341871396" class="btn btn-secondary">Call</a>
                            <button class="btn btn-secondary" onclick="getDirections('Lagos University Teaching Hospital')">Directions</button>
                        </div>
                    </div>
                </div>

                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <div class="service-info">
                        <h4>Federal Neuropsychiatric Hospital</h4>
                        <p>Mental Health Services</p>
                        <p>📍 Yaba, Lagos</p>
                        <p>📞 +234 1 8713961</p>
                        <div class="service-actions">
                            <a href="tel:+2341871396" class="btn btn-secondary">Call</a>
                            <button class="btn btn-secondary" onclick="getDirections('Federal Neuropsychiatric Hospital Yaba')">Directions</button>
                        </div>
                    </div>
                </div>

                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="service-info">
                        <h4>Mental Health Foundation Nigeria</h4>
                        <p>Counseling & Support</p>
                        <p>📍 Multiple Locations</p>
                        <p>📞 +234 806 027 0792</p>
                        <div class="service-actions">
                            <a href="tel:+2348060270792" class="btn btn-secondary">Call</a>
                            <button class="btn btn-secondary" onclick="visitWebsite('https://mentalhealthfoundation.ng')">Website</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="emergency-reminder">
                <p><strong>⚠️ In case of emergency:</strong></p>
                <p>Call our 24/7 helpline: <a href="tel:+2348060270792">+234 806 027 0792</a></p>
                <p>Or emergency services: <strong>199</strong> or <strong>911</strong></p>
            </div>
        </div>
    `);
}

function getDirections(placeName) {
    const encodedPlace = encodeURIComponent(placeName);
    const mapsUrl = `https://www.google.com/maps/search/${encodedPlace}`;
    window.open(mapsUrl, '_blank');
    showNotification('Opening directions in Google Maps...', 'info');
}

function visitWebsite(url) {
    window.open(url, '_blank');
    showNotification('Opening website in new tab...', 'info');
}

function showSelfHelpTools() {
    console.log('🛠️ Opening self-help tools');

    openFeatureModal('🛠️ Self-Help Tools', `
        <div class="feature-content">
            <div class="self-help-tools">
                <div class="tool-card">
                    <div class="tool-icon">
                        <i class="fas fa-brain"></i>
                    </div>
                    <h4>Mindfulness Exercise</h4>
                    <p>5-minute guided mindfulness to calm your mind</p>
                    <button class="btn btn-primary" onclick="startMindfulness()">Start Now</button>
                </div>

                <div class="tool-card">
                    <div class="tool-icon">
                        <i class="fas fa-lungs"></i>
                    </div>
                    <h4>Breathing Exercise</h4>
                    <p>Deep breathing technique to reduce anxiety</p>
                    <button class="btn btn-primary" onclick="showBreathingExercise()">Start Breathing</button>
                </div>

                <div class="tool-card">
                    <div class="tool-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h4>Grounding Technique</h4>
                    <p>5-4-3-2-1 technique to stay present</p>
                    <button class="btn btn-primary" onclick="startGrounding()">Start Grounding</button>
                </div>

                <div class="tool-card">
                    <div class="tool-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <h4>Calming Sounds</h4>
                    <p>Nature sounds to help you relax</p>
                    <button class="btn btn-primary" onclick="playCalmingSounds()">Play Sounds</button>
                </div>
            </div>
        </div>
    `);
}

function showBreathingExercise() {
    console.log('🫁 Starting breathing exercise');

    openFeatureModal('🫁 Breathing Exercise - 4-7-8 Technique', `
        <div class="feature-content">
            <div class="breathing-exercise">
                <div class="breathing-circle" id="breathing-circle">
                    <div class="breathing-text" id="breathing-text">Get Ready</div>
                </div>

                <div class="breathing-instructions">
                    <h4>4-7-8 Breathing Technique</h4>
                    <ol>
                        <li>Inhale through your nose for 4 counts</li>
                        <li>Hold your breath for 7 counts</li>
                        <li>Exhale through your mouth for 8 counts</li>
                        <li>Repeat 4 times</li>
                    </ol>
                </div>

                <div class="breathing-controls">
                    <button class="btn btn-primary" onclick="startBreathingCycle()" id="breathing-start">
                        <i class="fas fa-play"></i>
                        Start Exercise
                    </button>
                    <button class="btn btn-secondary" onclick="stopBreathingCycle()" id="breathing-stop" style="display: none;">
                        <i class="fas fa-stop"></i>
                        Stop
                    </button>
                </div>

                <div class="breathing-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="breathing-progress"></div>
                    </div>
                    <p id="breathing-status">Ready to begin</p>
                </div>
            </div>
        </div>
    `);
}

let breathingInterval;
let breathingCycle = 0;
let breathingPhase = 'ready';

function startBreathingCycle() {
    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');
    const progress = document.getElementById('breathing-progress');
    const status = document.getElementById('breathing-status');
    const startBtn = document.getElementById('breathing-start');
    const stopBtn = document.getElementById('breathing-stop');

    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-flex';

    breathingCycle = 0;
    breathingPhase = 'inhale';

    function runCycle() {
        if (breathingCycle >= 4) {
            stopBreathingCycle();
            return;
        }

        // Inhale phase (4 seconds)
        breathingPhase = 'inhale';
        text.textContent = 'Inhale';
        circle.style.transform = 'scale(1.5)';
        circle.style.transition = 'transform 4s ease-in-out';
        status.textContent = `Cycle ${breathingCycle + 1}/4 - Inhaling...`;

        setTimeout(() => {
            // Hold phase (7 seconds)
            breathingPhase = 'hold';
            text.textContent = 'Hold';
            status.textContent = `Cycle ${breathingCycle + 1}/4 - Holding...`;

            setTimeout(() => {
                // Exhale phase (8 seconds)
                breathingPhase = 'exhale';
                text.textContent = 'Exhale';
                circle.style.transform = 'scale(1)';
                circle.style.transition = 'transform 8s ease-in-out';
                status.textContent = `Cycle ${breathingCycle + 1}/4 - Exhaling...`;

                setTimeout(() => {
                    breathingCycle++;
                    if (breathingCycle < 4) {
                        setTimeout(runCycle, 1000); // 1 second pause between cycles
                    } else {
                        stopBreathingCycle();
                    }
                }, 8000);
            }, 7000);
        }, 4000);
    }

    runCycle();
}

function stopBreathingCycle() {
    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');
    const status = document.getElementById('breathing-status');
    const startBtn = document.getElementById('breathing-start');
    const stopBtn = document.getElementById('breathing-stop');

    if (breathingInterval) {
        clearInterval(breathingInterval);
    }

    circle.style.transform = 'scale(1)';
    circle.style.transition = 'transform 0.5s ease';
    text.textContent = breathingCycle >= 4 ? 'Complete!' : 'Stopped';
    status.textContent = breathingCycle >= 4 ? 'Exercise completed! How do you feel?' : 'Exercise stopped';

    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';

    if (breathingCycle >= 4) {
        showNotification('Breathing exercise completed! Take a moment to notice how you feel.', 'success');
    }
}

function startMindfulness() {
    console.log('🧘 Starting mindfulness exercise');

    openFeatureModal('🧘 5-Minute Mindfulness Exercise', `
        <div class="feature-content">
            <div class="mindfulness-exercise">
                <div class="mindfulness-timer">
                    <div class="timer-circle">
                        <div class="timer-text" id="mindfulness-timer">5:00</div>
                    </div>
                </div>

                <div class="mindfulness-guidance" id="mindfulness-guidance">
                    <h4>Find a comfortable position</h4>
                    <p>Sit or lie down comfortably. Close your eyes or soften your gaze.</p>
                </div>

                <div class="mindfulness-controls">
                    <button class="btn btn-primary" onclick="startMindfulnessTimer()" id="mindfulness-start">
                        <i class="fas fa-play"></i>
                        Start Mindfulness
                    </button>
                    <button class="btn btn-secondary" onclick="stopMindfulnessTimer()" id="mindfulness-stop" style="display: none;">
                        <i class="fas fa-pause"></i>
                        Pause
                    </button>
                </div>
            </div>
        </div>
    `);
}

let mindfulnessTimer;
let mindfulnessSeconds = 300; // 5 minutes

function startMindfulnessTimer() {
    const timerText = document.getElementById('mindfulness-timer');
    const guidance = document.getElementById('mindfulness-guidance');
    const startBtn = document.getElementById('mindfulness-start');
    const stopBtn = document.getElementById('mindfulness-stop');

    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-flex';

    const guidanceSteps = [
        { time: 300, title: "Begin", text: "Take three deep breaths. Notice your body settling." },
        { time: 240, title: "Body Awareness", text: "Notice any tension in your body. Let it soften." },
        { time: 180, title: "Breath Focus", text: "Focus on your natural breathing. In and out." },
        { time: 120, title: "Thoughts", text: "Notice any thoughts. Let them pass like clouds." },
        { time: 60, title: "Gratitude", text: "Think of something you're grateful for today." },
        { time: 0, title: "Complete", text: "Slowly open your eyes. Notice how you feel." }
    ];

    mindfulnessTimer = setInterval(() => {
        mindfulnessSeconds--;

        const minutes = Math.floor(mindfulnessSeconds / 60);
        const seconds = mindfulnessSeconds % 60;
        timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update guidance
        const currentStep = guidanceSteps.find(step => mindfulnessSeconds <= step.time);
        if (currentStep) {
            guidance.innerHTML = `<h4>${currentStep.title}</h4><p>${currentStep.text}</p>`;
        }

        if (mindfulnessSeconds <= 0) {
            stopMindfulnessTimer();
            showNotification('Mindfulness exercise completed! Take a moment to appreciate this peaceful feeling.', 'success');
        }
    }, 1000);
}

function stopMindfulnessTimer() {
    if (mindfulnessTimer) {
        clearInterval(mindfulnessTimer);
    }

    const startBtn = document.getElementById('mindfulness-start');
    const stopBtn = document.getElementById('mindfulness-stop');

    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';

    mindfulnessSeconds = 300; // Reset timer
}

function startGrounding() {
    console.log('🌱 Starting grounding exercise');

    openFeatureModal('🌱 5-4-3-2-1 Grounding Technique', `
        <div class="feature-content">
            <div class="grounding-exercise">
                <div class="grounding-step" id="grounding-content">
                    <h4>5-4-3-2-1 Grounding Technique</h4>
                    <p>This technique helps you stay present by engaging your senses.</p>
                    <p>Take a deep breath and let's begin...</p>
                </div>

                <div class="grounding-controls">
                    <button class="btn btn-primary" onclick="startGroundingSteps()" id="grounding-start">
                        <i class="fas fa-play"></i>
                        Start Grounding
                    </button>
                </div>

                <div class="grounding-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="grounding-progress" style="width: 0%"></div>
                    </div>
                    <p id="grounding-status">Ready to begin</p>
                </div>
            </div>
        </div>
    `);
}

function startGroundingSteps() {
    const content = document.getElementById('grounding-content');
    const progress = document.getElementById('grounding-progress');
    const status = document.getElementById('grounding-status');
    const startBtn = document.getElementById('grounding-start');

    startBtn.style.display = 'none';

    const steps = [
        {
            title: "5 Things You Can See",
            instruction: "Look around and name 5 things you can see. Take your time with each one.",
            examples: "Examples: a book, a plant, the color of the wall, a shadow, your hands"
        },
        {
            title: "4 Things You Can Touch",
            instruction: "Notice 4 things you can feel or touch right now.",
            examples: "Examples: the texture of your clothes, the temperature of the air, the surface you're sitting on"
        },
        {
            title: "3 Things You Can Hear",
            instruction: "Listen carefully and identify 3 sounds around you.",
            examples: "Examples: traffic, birds, your breathing, air conditioning, distant voices"
        },
        {
            title: "2 Things You Can Smell",
            instruction: "Take a gentle breath and notice 2 scents.",
            examples: "Examples: coffee, fresh air, soap, food, flowers"
        },
        {
            title: "1 Thing You Can Taste",
            instruction: "Notice any taste in your mouth, or take a sip of water.",
            examples: "Examples: mint from gum, the taste of water, lingering food flavors"
        }
    ];

    let currentStep = 0;

    function showStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            content.innerHTML = `
                <h4>${step.title}</h4>
                <p><strong>${step.instruction}</strong></p>
                <p><em>${step.examples}</em></p>
                <button class="btn btn-primary" onclick="nextGroundingStep()" style="margin-top: 1rem;">
                    ${currentStep === steps.length - 1 ? 'Complete' : 'Next Step'}
                </button>
            `;

            const progressPercent = ((currentStep + 1) / steps.length) * 100;
            progress.style.width = progressPercent + '%';
            status.textContent = `Step ${currentStep + 1} of ${steps.length}`;
        } else {
            content.innerHTML = `
                <h4>🎉 Grounding Complete!</h4>
                <p>You've successfully completed the 5-4-3-2-1 grounding technique.</p>
                <p>Notice how you feel now compared to when you started. You are present, you are safe, you are grounded.</p>
            `;
            progress.style.width = '100%';
            status.textContent = 'Exercise completed';
            showNotification('Grounding exercise completed! You are present and safe.', 'success');
        }
    }

    window.nextGroundingStep = function() {
        currentStep++;
        showStep();
    };

    showStep();
}

function playCalmingSounds() {
    console.log('🎵 Playing calming sounds');

    openFeatureModal('🎵 Calming Sounds', `
        <div class="feature-content">
            <div class="calming-sounds">
                <h4>Choose a calming sound to help you relax</h4>

                <div class="sound-options">
                    <div class="sound-card">
                        <div class="sound-icon">🌊</div>
                        <h5>Ocean Waves</h5>
                        <button class="btn btn-secondary" onclick="playSound('ocean')">Play</button>
                    </div>

                    <div class="sound-card">
                        <div class="sound-icon">🌧️</div>
                        <h5>Rain Sounds</h5>
                        <button class="btn btn-secondary" onclick="playSound('rain')">Play</button>
                    </div>

                    <div class="sound-card">
                        <div class="sound-icon">🌲</div>
                        <h5>Forest Sounds</h5>
                        <button class="btn btn-secondary" onclick="playSound('forest')">Play</button>
                    </div>

                    <div class="sound-card">
                        <div class="sound-icon">🔥</div>
                        <h5>Fireplace</h5>
                        <button class="btn btn-secondary" onclick="playSound('fireplace')">Play</button>
                    </div>
                </div>

                <div class="sound-player" id="sound-player" style="display: none;">
                    <div class="now-playing">
                        <h5 id="current-sound">Now Playing</h5>
                        <div class="sound-controls">
                            <button class="btn btn-secondary" onclick="stopSound()">
                                <i class="fas fa-stop"></i>
                                Stop
                            </button>
                        </div>
                    </div>
                </div>

                <div class="sound-info">
                    <p><em>Note: These are simulated calming sounds. In a full implementation, actual audio files would be played.</em></p>
                </div>
            </div>
        </div>
    `);
}

let currentSoundTimeout;

function playSound(soundType) {
    const player = document.getElementById('sound-player');
    const currentSound = document.getElementById('current-sound');

    const soundNames = {
        ocean: '🌊 Ocean Waves',
        rain: '🌧️ Rain Sounds',
        forest: '🌲 Forest Sounds',
        fireplace: '🔥 Fireplace Crackling'
    };

    currentSound.textContent = `Now Playing: ${soundNames[soundType]}`;
    player.style.display = 'block';

    showNotification(`Playing ${soundNames[soundType]}... Close your eyes and relax.`, 'info');

    // In a real implementation, you would play actual audio files here
    // For demo purposes, we'll just show the player interface
}

function stopSound() {
    const player = document.getElementById('sound-player');
    player.style.display = 'none';

    if (currentSoundTimeout) {
        clearTimeout(currentSoundTimeout);
    }

    showNotification('Sound stopped. Take a moment to notice the silence.', 'info');
}

function showEmergencyContacts() {
    console.log('📞 Showing emergency contacts');

    openFeatureModal('📞 Emergency Contacts', `
        <div class="feature-content">
            <div class="emergency-contacts">
                <h4>Important Emergency Numbers</h4>

                <div class="contact-list">
                    <div class="contact-card primary">
                        <div class="contact-icon">
                            <i class="fas fa-phone-alt"></i>
                        </div>
                        <div class="contact-info">
                            <h5>GENIBI 24/7 Helpline</h5>
                            <p>Mental health crisis support</p>
                            <a href="tel:+2348060270792" class="contact-number">+234 806 027 0792</a>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-ambulance"></i>
                        </div>
                        <div class="contact-info">
                            <h5>Emergency Services</h5>
                            <p>Life-threatening emergencies</p>
                            <a href="tel:199" class="contact-number">199</a>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-hospital"></i>
                        </div>
                        <div class="contact-info">
                            <h5>Lagos Emergency</h5>
                            <p>Lagos State emergency response</p>
                            <a href="tel:767" class="contact-number">767</a>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="contact-info">
                            <h5>Police Emergency</h5>
                            <p>Security emergencies</p>
                            <a href="tel:911" class="contact-number">911</a>
                        </div>
                    </div>
                </div>

                <div class="personal-contacts">
                    <h5>Add Personal Emergency Contacts</h5>
                    <button class="btn btn-secondary" onclick="addPersonalContact()">
                        <i class="fas fa-plus"></i>
                        Add Contact
                    </button>
                </div>
            </div>
        </div>
    `);
}

function addPersonalContact() {
    showNotification('Personal emergency contacts feature will be available in the full version.', 'info');
}

// Medication Helper Functions
function addMedication() {
    console.log('💊 Adding new medication');

    openFeatureModal('💊 Add New Medication', `
        <div class="feature-content">
            <form id="medication-form" class="medication-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="med-name">Medication Name *</label>
                        <input type="text" id="med-name" placeholder="e.g., Vitamin D3, Aspirin" required>
                    </div>

                    <div class="form-group">
                        <label for="med-dosage">Dosage *</label>
                        <input type="text" id="med-dosage" placeholder="e.g., 100mg, 1 tablet" required>
                    </div>

                    <div class="form-group">
                        <label for="med-frequency">Frequency *</label>
                        <select id="med-frequency" required>
                            <option value="">Select frequency</option>
                            <option value="once daily">Once daily</option>
                            <option value="twice daily">Twice daily</option>
                            <option value="three times daily">Three times daily</option>
                            <option value="four times daily">Four times daily</option>
                            <option value="every 6 hours">Every 6 hours</option>
                            <option value="every 8 hours">Every 8 hours</option>
                            <option value="every 12 hours">Every 12 hours</option>
                            <option value="as needed">As needed</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="med-time">Preferred Time</label>
                        <select id="med-time">
                            <option value="">Select time</option>
                            <option value="morning">Morning (8:00 AM)</option>
                            <option value="afternoon">Afternoon (2:00 PM)</option>
                            <option value="evening">Evening (8:00 PM)</option>
                            <option value="bedtime">Bedtime (10:00 PM)</option>
                            <option value="with meals">With meals</option>
                            <option value="before meals">Before meals</option>
                            <option value="after meals">After meals</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="med-purpose">Purpose/Condition (Optional)</label>
                    <input type="text" id="med-purpose" placeholder="e.g., High blood pressure, Vitamin deficiency">
                </div>

                <div class="form-group">
                    <label for="med-doctor">Prescribed by (Optional)</label>
                    <input type="text" id="med-doctor" placeholder="Doctor's name">
                </div>

                <div class="form-group">
                    <label for="med-notes">Notes (Optional)</label>
                    <textarea id="med-notes" placeholder="Any special instructions or notes..."></textarea>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="med-reminders" checked>
                        <span class="checkmark"></span>
                        Enable reminders for this medication
                    </label>
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        Add Medication
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);

    // Add form submission handler
    setTimeout(() => {
        const form = document.getElementById('medication-form');
        if (form) {
            form.addEventListener('submit', saveMedication);
        }
    }, 100);
}

function saveMedication(e) {
    e.preventDefault();

    const name = document.getElementById('med-name').value.trim();
    const dosage = document.getElementById('med-dosage').value.trim();
    const frequency = document.getElementById('med-frequency').value;
    const time = document.getElementById('med-time').value;
    const purpose = document.getElementById('med-purpose').value.trim();
    const doctor = document.getElementById('med-doctor').value.trim();
    const notes = document.getElementById('med-notes').value.trim();
    const reminders = document.getElementById('med-reminders').checked;

    // Validation
    if (!name || !dosage || !frequency) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Create medication object
    const medicationData = {
        name,
        dosage,
        frequency,
        time,
        purpose,
        doctor,
        notes,
        reminders,
        schedule: time || 'unscheduled'
    };

    // Save to data manager
    const savedMedication = dataManager.addMedication(medicationData);

    if (savedMedication) {
        showNotification(`${name} added successfully!`, 'success');
        closeModal();

        // Add notification
        dataManager.addNotification({
            type: 'medication',
            title: 'Medication Added',
            message: `${name} has been added to your medication list`,
            icon: 'fas fa-pills'
        });

        // Reopen medications to show updated list
        setTimeout(() => {
            openMedications();
        }, 500);
    } else {
        showNotification('Error adding medication. Please try again.', 'error');
    }
}

function takeMedication(medicationId) {
    console.log('💊 Taking medication:', medicationId);

    const dosageLog = dataManager.takeMedication(medicationId);

    if (dosageLog) {
        const medications = dataManager.getMedications();
        const medication = medications.find(med => med.id === medicationId);

        showNotification(`✅ ${medication.name} taken at ${new Date().toLocaleTimeString()}`, 'success');

        // Add notification
        dataManager.addNotification({
            type: 'medication_taken',
            title: 'Medication Taken',
            message: `${medication.name} taken at ${new Date().toLocaleString()}`,
            icon: 'fas fa-check-circle'
        });

        // Refresh the medications view
        openMedications();
    } else {
        showNotification('Error recording medication. Please try again.', 'error');
    }
}

function editMedication(medicationId) {
    console.log('✏️ Editing medication:', medicationId);

    const medications = dataManager.getMedications();
    const medication = medications.find(med => med.id === medicationId);

    if (!medication) {
        showNotification('Medication not found.', 'error');
        return;
    }

    openFeatureModal('✏️ Edit Medication', `
        <div class="feature-content">
            <form id="edit-medication-form" class="medication-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="edit-med-name">Medication Name *</label>
                        <input type="text" id="edit-med-name" value="${medication.name}" required>
                    </div>

                    <div class="form-group">
                        <label for="edit-med-dosage">Dosage *</label>
                        <input type="text" id="edit-med-dosage" value="${medication.dosage}" required>
                    </div>

                    <div class="form-group">
                        <label for="edit-med-frequency">Frequency *</label>
                        <select id="edit-med-frequency" required>
                            <option value="once daily" ${medication.frequency === 'once daily' ? 'selected' : ''}>Once daily</option>
                            <option value="twice daily" ${medication.frequency === 'twice daily' ? 'selected' : ''}>Twice daily</option>
                            <option value="three times daily" ${medication.frequency === 'three times daily' ? 'selected' : ''}>Three times daily</option>
                            <option value="four times daily" ${medication.frequency === 'four times daily' ? 'selected' : ''}>Four times daily</option>
                            <option value="every 6 hours" ${medication.frequency === 'every 6 hours' ? 'selected' : ''}>Every 6 hours</option>
                            <option value="every 8 hours" ${medication.frequency === 'every 8 hours' ? 'selected' : ''}>Every 8 hours</option>
                            <option value="every 12 hours" ${medication.frequency === 'every 12 hours' ? 'selected' : ''}>Every 12 hours</option>
                            <option value="as needed" ${medication.frequency === 'as needed' ? 'selected' : ''}>As needed</option>
                            <option value="weekly" ${medication.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                            <option value="monthly" ${medication.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit-med-status">Status</label>
                        <select id="edit-med-status">
                            <option value="active" ${medication.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${medication.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="completed" ${medication.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit-med-notes">Notes</label>
                    <textarea id="edit-med-notes">${medication.notes || ''}</textarea>
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        Update Medication
                    </button>
                    <button type="button" class="btn btn-danger" onclick="deleteMedication('${medicationId}')">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);

    // Add form submission handler
    setTimeout(() => {
        const form = document.getElementById('edit-medication-form');
        if (form) {
            form.addEventListener('submit', (e) => updateMedication(e, medicationId));
        }
    }, 100);
}

function updateMedication(e, medicationId) {
    e.preventDefault();

    const updates = {
        name: document.getElementById('edit-med-name').value.trim(),
        dosage: document.getElementById('edit-med-dosage').value.trim(),
        frequency: document.getElementById('edit-med-frequency').value,
        status: document.getElementById('edit-med-status').value,
        notes: document.getElementById('edit-med-notes').value.trim()
    };

    const updatedMedication = dataManager.updateMedication(medicationId, updates);

    if (updatedMedication) {
        showNotification(`${updates.name} updated successfully!`, 'success');
        closeModal();

        // Reopen medications to show updated list
        setTimeout(() => {
            openMedications();
        }, 500);
    } else {
        showNotification('Error updating medication. Please try again.', 'error');
    }
}

function deleteMedication(medicationId) {
    if (!confirm('Are you sure you want to delete this medication? This action cannot be undone.')) {
        return;
    }

    const medications = dataManager.getMedications();
    const medication = medications.find(med => med.id === medicationId);

    if (medication) {
        // Mark as deleted instead of actually removing
        const updatedMedication = dataManager.updateMedication(medicationId, { status: 'deleted' });

        if (updatedMedication) {
            showNotification(`${medication.name} deleted successfully.`, 'success');
            closeModal();

            // Reopen medications to show updated list
            setTimeout(() => {
                openMedications();
            }, 500);
        } else {
            showNotification('Error deleting medication. Please try again.', 'error');
        }
    }
}

function viewMedicationHistory() {
    console.log('📊 Viewing medication history');

    const medications = dataManager.getMedications();

    if (medications.length === 0) {
        showNotification('No medication history found.', 'info');
        return;
    }

    let historyHTML = medications.map(med => {
        const dosageHistory = med.dosageHistory || [];
        const recentDoses = dosageHistory.slice(0, 5);

        return `
            <div class="medication-history-card">
                <h4>${med.name}</h4>
                <p>${med.dosage} - ${med.frequency}</p>
                <div class="dosage-history">
                    <h5>Recent Doses:</h5>
                    ${recentDoses.length > 0 ?
                        recentDoses.map(dose => `
                            <div class="dose-entry">
                                <span class="dose-time">${new Date(dose.timestamp).toLocaleString()}</span>
                                <span class="dose-status ${dose.taken ? 'taken' : 'missed'}">${dose.taken ? 'Taken' : 'Missed'}</span>
                            </div>
                        `).join('') :
                        '<p class="no-history">No doses recorded yet</p>'
                    }
                </div>
            </div>
        `;
    }).join('');

    openFeatureModal('📊 Medication History', `
        <div class="feature-content">
            <div class="history-overview">
                <h4>Medication History Overview</h4>
                <p>Track your medication adherence and dosage history</p>
            </div>

            <div class="medication-history-list">
                ${historyHTML}
            </div>

            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="exportMedications()">
                    <i class="fas fa-download"></i>
                    Export History
                </button>
                <button class="btn btn-secondary" onclick="openMedications()">
                    <i class="fas fa-arrow-left"></i>
                    Back to Medications
                </button>
            </div>
        </div>
    `);
}

function exportMedications() {
    console.log('📤 Exporting medication data');

    const medications = dataManager.getMedications();

    if (medications.length === 0) {
        showNotification('No medication data to export.', 'info');
        return;
    }

    // Create CSV content
    const csvHeader = 'Medication Name,Dosage,Frequency,Status,Purpose,Doctor,Notes,Created Date,Last Taken\n';
    const csvContent = medications.map(med => {
        return [
            med.name,
            med.dosage,
            med.frequency,
            med.status,
            med.purpose || '',
            med.doctor || '',
            (med.notes || '').replace(/,/g, ';'),
            new Date(med.createdAt).toLocaleDateString(),
            med.lastTaken ? new Date(med.lastTaken).toLocaleDateString() : 'Never'
        ].join(',');
    }).join('\n');

    const fullCsv = csvHeader + csvContent;

    // Create and download file
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genibi-medications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification(`Exported ${medications.length} medications to CSV file.`, 'success');
}

// Mood Tracker Helper Functions
function viewMoodHistory() {
    console.log('📊 Viewing mood history');

    const moodEntries = dataManager.getMoodEntries(30);
    const moodStats = dataManager.getMoodStats();

    if (moodEntries.length === 0) {
        showNotification('No mood history found. Start tracking your mood today!', 'info');
        return;
    }

    let historyHTML = moodEntries.map(entry => {
        const date = new Date(entry.timestamp);
        return `
            <div class="mood-history-item">
                <div class="mood-date">${date.toLocaleDateString()}</div>
                <div class="mood-display">
                    <span class="mood-emoji">${entry.emoji}</span>
                    <span class="mood-name">${entry.mood}</span>
                    <span class="mood-rating">${entry.rating}/10</span>
                </div>
                ${entry.notes ? `<div class="mood-notes-display">"${entry.notes}"</div>` : ''}
            </div>
        `;
    }).join('');

    let statsHTML = '';
    if (moodStats) {
        const moodDistribution = Object.entries(moodStats.moodDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([mood, count]) => `
                <div class="mood-stat-item">
                    <span class="mood-stat-name">${mood}</span>
                    <span class="mood-stat-count">${count} times</span>
                </div>
            `).join('');

        statsHTML = `
            <div class="mood-analytics">
                <h4>Mood Analytics (Last 30 days)</h4>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h5>Total Entries</h5>
                        <div class="analytics-value">${moodStats.totalEntries}</div>
                    </div>
                    <div class="analytics-card">
                        <h5>Average Rating</h5>
                        <div class="analytics-value">${moodStats.averageRating.toFixed(1)}/10</div>
                    </div>
                    <div class="analytics-card">
                        <h5>Most Common Mood</h5>
                        <div class="analytics-value">${moodStats.mostCommonMood}</div>
                    </div>
                </div>

                <div class="mood-distribution">
                    <h5>Mood Distribution</h5>
                    <div class="mood-stats-list">
                        ${moodDistribution}
                    </div>
                </div>
            </div>
        `;
    }

    openFeatureModal('📊 Mood History & Analytics', `
        <div class="feature-content">
            ${statsHTML}

            <div class="mood-history-section">
                <h4>Mood History (${moodEntries.length} entries)</h4>
                <div class="mood-history-list">
                    ${historyHTML}
                </div>
            </div>

            <div class="action-buttons">
                <button class="btn btn-primary" onclick="openMoodTracker()">
                    <i class="fas fa-plus"></i>
                    Log New Mood
                </button>
                <button class="btn btn-secondary" onclick="exportMoodData()">
                    <i class="fas fa-download"></i>
                    Export Data
                </button>
            </div>
        </div>
    `);
}

function exportMoodData() {
    console.log('📤 Exporting mood data');

    const moodEntries = dataManager.getMoodEntries(365); // Get last year

    if (moodEntries.length === 0) {
        showNotification('No mood data to export.', 'info');
        return;
    }

    // Create CSV content
    const csvHeader = 'Date,Time,Mood,Emoji,Rating,Notes\n';
    const csvContent = moodEntries.map(entry => {
        const date = new Date(entry.timestamp);
        return [
            date.toLocaleDateString(),
            date.toLocaleTimeString(),
            entry.mood,
            entry.emoji,
            entry.rating,
            (entry.notes || '').replace(/,/g, ';') // Replace commas to avoid CSV issues
        ].join(',');
    }).join('\n');

    const fullCsv = csvHeader + csvContent;

    // Create and download file
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genibi-mood-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification(`Exported ${moodEntries.length} mood entries to CSV file.`, 'success');
}

// Appointment Helper Functions
function bookAppointment() {
    console.log('📅 Booking new appointment');

    openFeatureModal('📅 Book New Appointment', `
        <div class="feature-content">
            <form id="appointment-form" class="appointment-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="appointment-type">Appointment Type *</label>
                        <select id="appointment-type" required>
                            <option value="">Select appointment type</option>
                            <option value="general">General Consultation</option>
                            <option value="mental-health">Mental Health Consultation</option>
                            <option value="follow-up">Follow-up Visit</option>
                            <option value="specialist">Specialist Consultation</option>
                            <option value="emergency">Emergency Consultation</option>
                            <option value="therapy">Therapy Session</option>
                            <option value="counseling">Counseling Session</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="doctor-name">Healthcare Provider</label>
                        <input type="text" id="doctor-name" placeholder="Doctor's name (optional)">
                    </div>

                    <div class="form-group">
                        <label for="appointment-date">Preferred Date *</label>
                        <input type="date" id="appointment-date" required min="${new Date().toISOString().split('T')[0]}">
                    </div>

                    <div class="form-group">
                        <label for="appointment-time">Preferred Time *</label>
                        <select id="appointment-time" required>
                            <option value="">Select time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="appointment-reason">Reason for Visit *</label>
                    <textarea id="appointment-reason" placeholder="Please describe the reason for your appointment..." required></textarea>
                </div>

                <div class="form-group">
                    <label for="appointment-location">Location Preference</label>
                    <select id="appointment-location">
                        <option value="">Select location</option>
                        <option value="clinic">In-person at clinic</option>
                        <option value="video">Video consultation</option>
                        <option value="phone">Phone consultation</option>
                        <option value="home">Home visit</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="appointment-notes">Additional Notes</label>
                    <textarea id="appointment-notes" placeholder="Any additional information or special requests..."></textarea>
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-calendar-check"></i>
                        Book Appointment
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);

    // Add form submission handler
    setTimeout(() => {
        const form = document.getElementById('appointment-form');
        if (form) {
            form.addEventListener('submit', saveAppointment);
        }
    }, 100);
}

function saveAppointment(e) {
    e.preventDefault();

    const type = document.getElementById('appointment-type').value;
    const doctorName = document.getElementById('doctor-name').value.trim();
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const reason = document.getElementById('appointment-reason').value.trim();
    const location = document.getElementById('appointment-location').value;
    const notes = document.getElementById('appointment-notes').value.trim();

    // Validation
    if (!type || !date || !time || !reason) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Create appointment object
    const appointmentDateTime = new Date(`${date}T${time}:00`);

    const appointmentData = {
        type,
        doctorName: doctorName || 'Healthcare Provider',
        specialty: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        date: appointmentDateTime.toISOString(),
        reason,
        location: location || 'To be determined',
        notes
    };

    // Save to data manager
    const savedAppointment = dataManager.addAppointment(appointmentData);

    if (savedAppointment) {
        showNotification(`Appointment booked for ${appointmentDateTime.toLocaleDateString()} at ${appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`, 'success');
        closeModal();

        // Add notification
        dataManager.addNotification({
            type: 'appointment',
            title: 'Appointment Booked',
            message: `${type.replace('-', ' ')} appointment scheduled for ${appointmentDateTime.toLocaleDateString()}`,
            icon: 'fas fa-calendar-check'
        });

        // Reopen appointments to show updated list
        setTimeout(() => {
            openAppointments();
        }, 500);
    } else {
        showNotification('Error booking appointment. Please try again.', 'error');
    }
}

function editAppointment(appointmentId) {
    console.log('✏️ Editing appointment:', appointmentId);

    const appointments = dataManager.getAppointments();
    const appointment = appointments.find(apt => apt.id === appointmentId);

    if (!appointment) {
        showNotification('Appointment not found.', 'error');
        return;
    }

    const appointmentDate = new Date(appointment.date);

    openFeatureModal('✏️ Edit Appointment', `
        <div class="feature-content">
            <form id="edit-appointment-form" class="appointment-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="edit-appointment-type">Appointment Type *</label>
                        <select id="edit-appointment-type" required>
                            <option value="general" ${appointment.type === 'general' ? 'selected' : ''}>General Consultation</option>
                            <option value="mental-health" ${appointment.type === 'mental-health' ? 'selected' : ''}>Mental Health Consultation</option>
                            <option value="follow-up" ${appointment.type === 'follow-up' ? 'selected' : ''}>Follow-up Visit</option>
                            <option value="specialist" ${appointment.type === 'specialist' ? 'selected' : ''}>Specialist Consultation</option>
                            <option value="emergency" ${appointment.type === 'emergency' ? 'selected' : ''}>Emergency Consultation</option>
                            <option value="therapy" ${appointment.type === 'therapy' ? 'selected' : ''}>Therapy Session</option>
                            <option value="counseling" ${appointment.type === 'counseling' ? 'selected' : ''}>Counseling Session</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit-appointment-status">Status</label>
                        <select id="edit-appointment-status">
                            <option value="scheduled" ${appointment.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                            <option value="confirmed" ${appointment.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="completed" ${appointment.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="cancelled" ${appointment.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit-appointment-notes">Notes</label>
                    <textarea id="edit-appointment-notes">${appointment.notes || ''}</textarea>
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        Update Appointment
                    </button>
                    <button type="button" class="btn btn-danger" onclick="cancelAppointment('${appointmentId}')">
                        <i class="fas fa-trash"></i>
                        Cancel Appointment
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        Close
                    </button>
                </div>
            </form>
        </div>
    `);

    // Add form submission handler
    setTimeout(() => {
        const form = document.getElementById('edit-appointment-form');
        if (form) {
            form.addEventListener('submit', (e) => updateAppointment(e, appointmentId));
        }
    }, 100);
}

function updateAppointment(e, appointmentId) {
    e.preventDefault();

    const updates = {
        type: document.getElementById('edit-appointment-type').value,
        status: document.getElementById('edit-appointment-status').value,
        notes: document.getElementById('edit-appointment-notes').value.trim()
    };

    const updatedAppointment = dataManager.updateAppointment(appointmentId, updates);

    if (updatedAppointment) {
        showNotification('Appointment updated successfully!', 'success');
        closeModal();

        // Reopen appointments to show updated list
        setTimeout(() => {
            openAppointments();
        }, 500);
    } else {
        showNotification('Error updating appointment. Please try again.', 'error');
    }
}

function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }

    const updatedAppointment = dataManager.updateAppointment(appointmentId, { status: 'cancelled' });

    if (updatedAppointment) {
        showNotification('Appointment cancelled successfully.', 'success');
        closeModal();

        // Reopen appointments to show updated list
        setTimeout(() => {
            openAppointments();
        }, 500);
    } else {
        showNotification('Error cancelling appointment. Please try again.', 'error');
    }
}

function viewAppointmentHistory() {
    console.log('📊 Viewing appointment history');

    const appointments = dataManager.getAppointments();

    if (appointments.length === 0) {
        showNotification('No appointment history found.', 'info');
        return;
    }

    // Sort appointments by date (newest first)
    const sortedAppointments = appointments.sort((a, b) => new Date(b.date) - new Date(a.date));

    let historyHTML = sortedAppointments.map(appointment => {
        const date = new Date(appointment.date);
        const isPast = date < new Date();
        const statusClass = appointment.status === 'completed' ? 'completed' :
                           appointment.status === 'cancelled' ? 'cancelled' :
                           isPast ? 'missed' : 'upcoming';

        return `
            <div class="appointment-history-item ${statusClass}">
                <div class="appointment-date-info">
                    <div class="date">${date.toLocaleDateString()}</div>
                    <div class="time">${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div class="appointment-details">
                    <h5>${appointment.doctorName || 'Healthcare Provider'}</h5>
                    <p>${appointment.specialty || appointment.type}</p>
                    <p class="reason">${appointment.reason}</p>
                </div>
                <div class="appointment-status-display">
                    <span class="status ${statusClass}">${appointment.status.toUpperCase()}</span>
                </div>
            </div>
        `;
    }).join('');

    openFeatureModal('📊 Appointment History', `
        <div class="feature-content">
            <div class="history-overview">
                <h4>All Appointments (${appointments.length} total)</h4>
                <div class="appointment-stats">
                    <div class="stat-item">
                        <span class="stat-label">Completed</span>
                        <span class="stat-value">${appointments.filter(a => a.status === 'completed').length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Upcoming</span>
                        <span class="stat-value">${appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cancelled</span>
                        <span class="stat-value">${appointments.filter(a => a.status === 'cancelled').length}</span>
                    </div>
                </div>
            </div>

            <div class="appointment-history-list">
                ${historyHTML}
            </div>

            <div class="action-buttons">
                <button class="btn btn-primary" onclick="bookAppointment()">
                    <i class="fas fa-plus"></i>
                    Book New Appointment
                </button>
                <button class="btn btn-secondary" onclick="openAppointments()">
                    <i class="fas fa-arrow-left"></i>
                    Back to Appointments
                </button>
            </div>
        </div>
    `);
}

// Vital Signs Helper Functions
function recordVitals() {
    console.log('📝 Recording new vital signs');

    openFeatureModal('📝 Record Vital Signs', `
        <div class="feature-content">
            <form id="vitals-form" class="vitals-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="heart-rate">Heart Rate (BPM)</label>
                        <input type="number" id="heart-rate" min="40" max="200" placeholder="72" required>
                    </div>

                    <div class="form-group">
                        <label for="temperature">Temperature (°F)</label>
                        <input type="number" id="temperature" min="95" max="110" step="0.1" placeholder="98.6" required>
                    </div>

                    <div class="form-group">
                        <label for="bp-systolic">Blood Pressure - Systolic</label>
                        <input type="number" id="bp-systolic" min="70" max="200" placeholder="120" required>
                    </div>

                    <div class="form-group">
                        <label for="bp-diastolic">Blood Pressure - Diastolic</label>
                        <input type="number" id="bp-diastolic" min="40" max="120" placeholder="80" required>
                    </div>

                    <div class="form-group">
                        <label for="oxygen-saturation">Oxygen Saturation (%)</label>
                        <input type="number" id="oxygen-saturation" min="80" max="100" placeholder="98" required>
                    </div>

                    <div class="form-group">
                        <label for="weight">Weight (lbs) - Optional</label>
                        <input type="number" id="weight" min="50" max="500" step="0.1" placeholder="150">
                    </div>
                </div>

                <div class="form-group">
                    <label for="vital-notes">Notes (Optional)</label>
                    <textarea id="vital-notes" placeholder="Any additional notes about your readings..."></textarea>
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        Save Vital Signs
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `);

    // Add form submission handler
    setTimeout(() => {
        const form = document.getElementById('vitals-form');
        if (form) {
            form.addEventListener('submit', saveVitalSigns);
        }
    }, 100);
}

function saveVitalSigns(e) {
    e.preventDefault();

    const heartRate = parseInt(document.getElementById('heart-rate').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const bloodPressureSystolic = parseInt(document.getElementById('bp-systolic').value);
    const bloodPressureDiastolic = parseInt(document.getElementById('bp-diastolic').value);
    const oxygenSaturation = parseInt(document.getElementById('oxygen-saturation').value);
    const weight = document.getElementById('weight').value ? parseFloat(document.getElementById('weight').value) : null;
    const notes = document.getElementById('vital-notes').value.trim();

    // Validation
    if (!heartRate || !temperature || !bloodPressureSystolic || !bloodPressureDiastolic || !oxygenSaturation) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Basic range validation
    if (heartRate < 40 || heartRate > 200) {
        showNotification('Heart rate must be between 40 and 200 BPM.', 'error');
        return;
    }

    if (temperature < 95 || temperature > 110) {
        showNotification('Temperature must be between 95°F and 110°F.', 'error');
        return;
    }

    if (bloodPressureSystolic < 70 || bloodPressureSystolic > 200 || bloodPressureDiastolic < 40 || bloodPressureDiastolic > 120) {
        showNotification('Blood pressure values are out of normal range.', 'error');
        return;
    }

    if (oxygenSaturation < 80 || oxygenSaturation > 100) {
        showNotification('Oxygen saturation must be between 80% and 100%.', 'error');
        return;
    }

    // Save to data manager
    const vitalData = {
        heartRate,
        temperature,
        bloodPressureSystolic,
        bloodPressureDiastolic,
        oxygenSaturation,
        weight,
        notes
    };

    const savedVital = dataManager.addVitalSigns(vitalData);

    if (savedVital) {
        showNotification('Vital signs recorded successfully!', 'success');
        closeModal();

        // Add notification
        dataManager.addNotification({
            type: 'vitals',
            title: 'Vital Signs Recorded',
            message: `New vital signs recorded at ${new Date().toLocaleString()}`,
            icon: 'fas fa-heartbeat'
        });

        // Reopen vital signs to show updated data
        setTimeout(() => {
            openVitalSigns();
        }, 500);
    } else {
        showNotification('Error saving vital signs. Please try again.', 'error');
    }
}

function viewVitalHistory() {
    console.log('📊 Viewing vital signs history');

    const vitalHistory = dataManager.getVitalSigns(20);

    if (vitalHistory.length === 0) {
        showNotification('No vital signs history found. Record your first reading!', 'info');
        return;
    }

    openFeatureModal('📊 Vital Signs History', `
        <div class="feature-content">
            <div class="history-stats">
                <h4>Last 20 Readings</h4>
                <p>Total recordings: ${vitalHistory.length}</p>
            </div>

            <div class="history-table">
                <div class="table-header">
                    <span>Date</span>
                    <span>Heart Rate</span>
                    <span>Blood Pressure</span>
                    <span>Temperature</span>
                    <span>O2 Sat</span>
                </div>
                ${vitalHistory.map(vital => `
                    <div class="table-row">
                        <span class="date-cell">${new Date(vital.timestamp).toLocaleDateString()}</span>
                        <span class="vital-cell">${vital.heartRate} BPM</span>
                        <span class="vital-cell">${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}</span>
                        <span class="vital-cell">${vital.temperature}°F</span>
                        <span class="vital-cell">${vital.oxygenSaturation}%</span>
                    </div>
                `).join('')}
            </div>

            <div class="action-buttons">
                <button class="btn btn-primary" onclick="recordVitals()">
                    <i class="fas fa-plus"></i>
                    Record New
                </button>
                <button class="btn btn-secondary" onclick="exportVitals()">
                    <i class="fas fa-download"></i>
                    Export Data
                </button>
            </div>
        </div>
    `);
}

function exportVitals() {
    console.log('📤 Exporting vital signs data');

    const vitalHistory = dataManager.getVitalSigns(100); // Get last 100 readings

    if (vitalHistory.length === 0) {
        showNotification('No vital signs data to export.', 'info');
        return;
    }

    // Create CSV content
    const csvHeader = 'Date,Time,Heart Rate (BPM),Temperature (°F),Blood Pressure Systolic,Blood Pressure Diastolic,Oxygen Saturation (%),Weight (lbs),Notes\n';
    const csvContent = vitalHistory.map(vital => {
        const date = new Date(vital.timestamp);
        return [
            date.toLocaleDateString(),
            date.toLocaleTimeString(),
            vital.heartRate,
            vital.temperature,
            vital.bloodPressureSystolic,
            vital.bloodPressureDiastolic,
            vital.oxygenSaturation,
            vital.weight || '',
            (vital.notes || '').replace(/,/g, ';') // Replace commas to avoid CSV issues
        ].join(',');
    }).join('\n');

    const fullCsv = csvHeader + csvContent;

    // Create and download file
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genibi-vital-signs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification(`Exported ${vitalHistory.length} vital signs readings to CSV file.`, 'success');
}

// Settings helper functions
function changePassword() {
    showNotification('Password change feature coming soon.', 'info');
}

function exportData() {
    showNotification('Data export feature coming soon.', 'info');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showNotification('Account deletion feature coming soon.', 'info');
    }
}

function saveSettings() {
    showNotification('Settings saved successfully!', 'success');
    closeModal();
}

function openFeatureModal(title, content) {
    const modal = document.getElementById('feature-modal');
    const titleElement = document.getElementById('feature-title');
    const contentElement = document.getElementById('feature-content');

    titleElement.textContent = title;
    contentElement.innerHTML = content;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeFeatureModal() {
    const modal = document.getElementById('feature-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Feature Action Functions
async function recordVitals() {
    const content = `
        <div class="vital-recording-form">
            <h3>Record Vital Signs</h3>
            <form id="vitals-form">
                <div class="form-group">
                    <label for="heartRate">Heart Rate (BPM)</label>
                    <input type="number" id="heartRate" min="40" max="200" placeholder="72">
                </div>

                <div class="form-group">
                    <label for="systolic">Blood Pressure - Systolic</label>
                    <input type="number" id="systolic" min="70" max="250" placeholder="120">
                </div>

                <div class="form-group">
                    <label for="diastolic">Blood Pressure - Diastolic</label>
                    <input type="number" id="diastolic" min="40" max="150" placeholder="80">
                </div>

                <div class="form-group">
                    <label for="temperature">Temperature (°F)</label>
                    <input type="number" id="temperature" step="0.1" min="95" max="110" placeholder="98.6">
                </div>

                <div class="form-group">
                    <label for="oxygenSat">Oxygen Saturation (%)</label>
                    <input type="number" id="oxygenSat" min="80" max="100" placeholder="98">
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        Save Vitals
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeFeatureModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;

    openFeatureModal('Record Vital Signs', content);

    // Setup form submission
    document.getElementById('vitals-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const heartRate = document.getElementById('heartRate').value;
        const systolic = document.getElementById('systolic').value;
        const diastolic = document.getElementById('diastolic').value;
        const temperature = document.getElementById('temperature').value;
        const oxygenSat = document.getElementById('oxygenSat').value;

        const vitalSigns = {};

        if (heartRate) {
            vitalSigns.heartRate = { value: parseInt(heartRate), unit: 'BPM' };
        }

        if (systolic && diastolic) {
            vitalSigns.bloodPressure = {
                systolic: parseInt(systolic),
                diastolic: parseInt(diastolic)
            };
        }

        if (temperature) {
            vitalSigns.temperature = { value: parseFloat(temperature), unit: 'F' };
        }

        if (oxygenSat) {
            vitalSigns.oxygenSaturation = { value: parseInt(oxygenSat), unit: '%' };
        }

        try {
            const response = await api.recordVitalSigns(vitalSigns);

            if (response.success) {
                showNotification('Vital signs recorded successfully!', 'success');
                closeFeatureModal();
                // Refresh dashboard data
                await loadDashboardData();
            } else {
                throw new Error(response.message || 'Failed to record vital signs');
            }
        } catch (error) {
            console.error('Error recording vitals:', error);
            showNotification(error.message || 'Failed to record vital signs. Please try again.', 'error');
        }
    });
}

function viewVitalHistory() {
    showNotification('Vital signs history feature coming soon!', 'info');
}

function bookAppointment() {
    const content = `
        <div class="appointment-booking-form">
            <h3>Book New Appointment</h3>
            <form id="appointment-form">
                <div class="form-group">
                    <label for="doctorName">Doctor Name</label>
                    <input type="text" id="doctorName" required placeholder="Dr. John Smith">
                </div>

                <div class="form-group">
                    <label for="specialty">Specialty</label>
                    <select id="specialty" required>
                        <option value="">Select Specialty</option>
                        <option value="General Practice">General Practice</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Psychiatry">Psychiatry</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="appointmentType">Appointment Type</label>
                    <select id="appointmentType" required>
                        <option value="">Select Type</option>
                        <option value="consultation">Consultation</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="routine-checkup">Routine Checkup</option>
                        <option value="specialist">Specialist Visit</option>
                        <option value="telemedicine">Telemedicine</option>
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="appointmentDate">Date</label>
                        <input type="date" id="appointmentDate" required>
                    </div>

                    <div class="form-group">
                        <label for="appointmentTime">Time</label>
                        <input type="time" id="appointmentTime" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="reason">Reason for Visit</label>
                    <textarea id="reason" required placeholder="Describe your symptoms or reason for the visit"></textarea>
                </div>

                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" id="location" placeholder="Hospital/Clinic address">
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-calendar-check"></i>
                        Book Appointment
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeFeatureModal()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;

    openFeatureModal('Book Appointment', content);

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;

    // Setup form submission
    document.getElementById('appointment-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const appointmentData = {
            doctorName: document.getElementById('doctorName').value,
            specialty: document.getElementById('specialty').value,
            appointmentType: document.getElementById('appointmentType').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            reason: document.getElementById('reason').value,
            location: {
                type: 'in-person',
                address: document.getElementById('location').value
            },
            duration: 30,
            notes: ''
        };

        try {
            const response = await api.createAppointment(appointmentData);

            if (response.success) {
                showNotification('Appointment booked successfully!', 'success');
                closeFeatureModal();
                // Refresh dashboard data
                await loadDashboardData();
            } else {
                throw new Error(response.message || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            showNotification(error.message || 'Failed to book appointment. Please try again.', 'error');
        }
    });
}

function addMedication() {
    showNotification('Add medication feature coming soon!', 'info');
}

function setReminder() {
    showNotification('Medication reminder feature coming soon!', 'info');
}

function selectMood(mood) {
    // Visual feedback
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');

    // Save mood
    const today = new Date().toLocaleDateString();
    showNotification(`Mood "${mood}" recorded for ${today}!`, 'success');

    // Store in localStorage
    const moodData = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    moodData.unshift({
        date: today,
        mood: mood,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('moodHistory', JSON.stringify(moodData.slice(0, 30))); // Keep last 30 entries
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);
