// Global variables
let currentMood = null;
let moodHistory = [];
let chatMessages = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadMoodHistory();
    setupEventListeners();
});

function initializeApp() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize mood chart
    initializeMoodChart();
    
    // Load sample mood entries
    loadSampleMoodEntries();
}

function setupEventListeners() {
    // Chat input
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (chatInput && sendBtn) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', sendMessage);
    }

    // App navigation
    document.querySelectorAll('.app-nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Mood selector
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            selectMood(mood);
        });
    });

    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// App functionality
function openApp() {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeApp() {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function switchTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.app-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.app-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to selected tab and button
    const selectedTab = document.getElementById(tabName);
    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedBtn) selectedBtn.classList.add('active');
}

function openFeature(feature) {
    openApp();
    switchTab(feature);
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Chat functionality
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${text}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const responses = [
        "I understand how you're feeling. It's completely normal to experience these emotions. Would you like to talk more about what's troubling you?",
        "Thank you for sharing that with me. Remember that seeking help is a sign of strength, not weakness. How can I support you today?",
        "That sounds challenging. Many students go through similar experiences. Have you tried any coping strategies that have helped you before?",
        "I'm here to listen and support you. Your mental health is important, and it's okay to take things one step at a time.",
        "It's great that you're being mindful of your mental health. What would you like to focus on improving today?",
        "I hear you. Sometimes talking about our feelings can help us process them better. What's been on your mind lately?",
        "That's a very valid concern. Many Nigerian students face similar challenges. Would you like some specific strategies to help with this?",
        "Thank you for trusting me with your thoughts. Remember, you're not alone in this journey. How are you taking care of yourself today?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Mood tracking functionality
function selectMood(mood) {
    currentMood = mood;
    
    // Update mood selector visual feedback
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.style.background = '#f8f9fa';
        btn.style.transform = 'scale(1)';
    });
    
    const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
    if (selectedBtn) {
        selectedBtn.style.background = '#4A90E2';
        selectedBtn.style.transform = 'scale(1.1)';
    }
    
    // Save mood entry
    saveMoodEntry(mood);
    
    // Show confirmation
    showNotification(`Mood "${mood}" recorded for today!`);
}

function saveMoodEntry(mood) {
    const today = new Date().toLocaleDateString();
    const entry = {
        date: today,
        mood: mood,
        timestamp: new Date().toISOString()
    };
    
    moodHistory.unshift(entry);
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    updateMoodEntries();
}

function loadMoodHistory() {
    const saved = localStorage.getItem('moodHistory');
    if (saved) {
        moodHistory = JSON.parse(saved);
    }
    updateMoodEntries();
}

function updateMoodEntries() {
    const entriesContainer = document.getElementById('mood-entries');
    if (!entriesContainer) return;
    
    entriesContainer.innerHTML = '';
    
    moodHistory.slice(0, 5).forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'mood-entry';
        entryDiv.innerHTML = `
            <span>${entry.date}</span>
            <span>${getMoodEmoji(entry.mood)} ${entry.mood}</span>
        `;
        entriesContainer.appendChild(entryDiv);
    });
}

function getMoodEmoji(mood) {
    const emojis = {
        'great': '😊',
        'good': '🙂',
        'okay': '😐',
        'sad': '😔',
        'stressed': '😰'
    };
    return emojis[mood] || '😐';
}

function loadSampleMoodEntries() {
    if (moodHistory.length === 0) {
        const sampleEntries = [
            { date: '2024-01-15', mood: 'good', timestamp: new Date().toISOString() },
            { date: '2024-01-14', mood: 'great', timestamp: new Date().toISOString() },
            { date: '2024-01-13', mood: 'okay', timestamp: new Date().toISOString() },
            { date: '2024-01-12', mood: 'stressed', timestamp: new Date().toISOString() },
            { date: '2024-01-11', mood: 'good', timestamp: new Date().toISOString() }
        ];
        moodHistory = sampleEntries;
        updateMoodEntries();
    }
}

// Mood chart initialization
function initializeMoodChart() {
    const canvas = document.getElementById('mood-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simple chart drawing
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(50, 150, 30, 50);
    ctx.fillRect(100, 120, 30, 80);
    ctx.fillRect(150, 100, 30, 100);
    ctx.fillRect(200, 130, 30, 70);
    ctx.fillRect(250, 110, 30, 90);
    
    // Chart labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Inter';
    ctx.fillText('Mon', 55, 220);
    ctx.fillText('Tue', 105, 220);
    ctx.fillText('Wed', 155, 220);
    ctx.fillText('Thu', 205, 220);
    ctx.fillText('Fri', 255, 220);
    
    ctx.fillText('Mood Trend - This Week', 50, 30);
}

// Utility functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4A90E2;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
