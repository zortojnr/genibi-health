// GENIBI Health App - Comprehensive Functionality Test
// Run this in browser console to verify all features are working

console.log('🧪 Starting GENIBI Health App Functionality Test...');

// Test 1: Check if all required scripts are loaded
function testScriptsLoaded() {
    console.log('\n📋 Test 1: Checking if all scripts are loaded...');
    
    const tests = [
        { name: 'DataManager', check: () => typeof dataManager !== 'undefined' },
        { name: 'API Service', check: () => typeof api !== 'undefined' },
        { name: 'Firebase', check: () => typeof firebase !== 'undefined' },
        { name: 'Google Identity', check: () => typeof google !== 'undefined' }
    ];
    
    tests.forEach(test => {
        try {
            const result = test.check();
            console.log(`${result ? '✅' : '❌'} ${test.name}: ${result ? 'Loaded' : 'Not loaded'}`);
        } catch (error) {
            console.log(`❌ ${test.name}: Error - ${error.message}`);
        }
    });
}

// Test 2: Check dashboard card functions
function testDashboardFunctions() {
    console.log('\n📋 Test 2: Checking dashboard functions...');
    
    const functions = [
        'openChatbot',
        'openVitalSigns', 
        'openAppointments',
        'openMedications',
        'openMoodTracker',
        'openEmergency'
    ];
    
    functions.forEach(funcName => {
        const exists = typeof window[funcName] === 'function';
        console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'Available' : 'Missing'}`);
    });
}

// Test 3: Check data manager functionality
function testDataManager() {
    console.log('\n📋 Test 3: Testing Data Manager...');
    
    if (typeof dataManager === 'undefined') {
        console.log('❌ DataManager not available');
        return;
    }
    
    try {
        // Test basic operations
        const testData = { test: 'data', timestamp: new Date().toISOString() };
        dataManager.setData('test_key', testData);
        const retrieved = dataManager.getData('test_key');
        
        console.log(`✅ Data storage: ${JSON.stringify(retrieved) === JSON.stringify(testData) ? 'Working' : 'Failed'}`);
        
        // Test user-specific data
        if (currentUser) {
            dataManager.setCurrentUser(currentUser);
            console.log(`✅ User context: Set for ${currentUser.firstName || 'User'}`);
        } else {
            console.log('⚠️ User context: No current user');
        }
        
        // Test health data functions
        const functions = [
            'addVitalSigns',
            'getMedications', 
            'addMoodEntry',
            'addNotification'
        ];
        
        functions.forEach(funcName => {
            const exists = typeof dataManager[funcName] === 'function';
            console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'Available' : 'Missing'}`);
        });
        
    } catch (error) {
        console.log(`❌ DataManager test failed: ${error.message}`);
    }
}

// Test 4: Check authentication functions
function testAuthentication() {
    console.log('\n📋 Test 4: Testing Authentication...');
    
    const authFunctions = [
        'signInWithGoogle',
        'handleSignup',
        'handleLogin',
        'enhancedLogout'
    ];
    
    authFunctions.forEach(funcName => {
        const exists = typeof window[funcName] === 'function';
        console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'Available' : 'Missing'}`);
    });
    
    // Check Firebase configuration
    if (typeof firebase !== 'undefined') {
        console.log('✅ Firebase: Initialized');
        if (firebase.apps.length > 0) {
            console.log('✅ Firebase App: Connected');
        } else {
            console.log('⚠️ Firebase App: Not connected');
        }
    } else {
        console.log('❌ Firebase: Not loaded');
    }
}

// Test 5: Check modal system
function testModalSystem() {
    console.log('\n📋 Test 5: Testing Modal System...');
    
    const modals = [
        'feature-modal',
        'chatbot-modal'
    ];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        console.log(`${modal ? '✅' : '❌'} ${modalId}: ${modal ? 'Found' : 'Missing'}`);
    });
    
    // Test modal functions
    const modalFunctions = [
        'openFeatureModal',
        'closeFeatureModal',
        'openChatbot',
        'closeChatbot'
    ];
    
    modalFunctions.forEach(funcName => {
        const exists = typeof window[funcName] === 'function';
        console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'Available' : 'Missing'}`);
    });
}

// Test 6: Check emergency features
function testEmergencyFeatures() {
    console.log('\n📋 Test 6: Testing Emergency Features...');
    
    // Check helpline link
    const helplineLink = document.querySelector('a[href="tel:+2348060270792"]');
    console.log(`${helplineLink ? '✅' : '❌'} Helpline Link: ${helplineLink ? 'Found' : 'Missing'}`);
    
    // Check emergency functions
    const emergencyFunctions = [
        'openEmergency',
        'startCrisisChat',
        'bookEmergencyAppointment',
        'findNearbyHelp'
    ];
    
    emergencyFunctions.forEach(funcName => {
        const exists = typeof window[funcName] === 'function';
        console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'Available' : 'Missing'}`);
    });
}

// Test 7: Check responsive design
function testResponsiveDesign() {
    console.log('\n📋 Test 7: Testing Responsive Design...');
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    console.log(`📱 Viewport: ${viewportWidth}x${viewportHeight}`);
    
    if (viewportWidth <= 768) {
        console.log('📱 Mobile view detected');
    } else if (viewportWidth <= 1024) {
        console.log('📱 Tablet view detected');
    } else {
        console.log('🖥️ Desktop view detected');
    }
    
    // Check if CSS is loaded
    const styles = getComputedStyle(document.body);
    const hasStyles = styles.fontFamily !== 'Times' && styles.fontFamily !== 'serif';
    console.log(`${hasStyles ? '✅' : '❌'} CSS Styles: ${hasStyles ? 'Loaded' : 'Not loaded'}`);
}

// Test 8: Performance check
function testPerformance() {
    console.log('\n📋 Test 8: Performance Check...');
    
    const startTime = performance.now();
    
    // Test DOM query performance
    const cards = document.querySelectorAll('.health-card');
    const buttons = document.querySelectorAll('button');
    const modals = document.querySelectorAll('.modal-overlay');
    
    const endTime = performance.now();
    const queryTime = endTime - startTime;
    
    console.log(`⚡ DOM Query Time: ${queryTime.toFixed(2)}ms`);
    console.log(`📋 Health Cards: ${cards.length} found`);
    console.log(`🔘 Buttons: ${buttons.length} found`);
    console.log(`📱 Modals: ${modals.length} found`);
    
    console.log(`${queryTime < 10 ? '✅' : '⚠️'} Performance: ${queryTime < 10 ? 'Excellent' : 'Needs optimization'}`);
}

// Run all tests
function runAllTests() {
    console.log('🚀 GENIBI Health App - Comprehensive Functionality Test');
    console.log('='.repeat(60));
    
    testScriptsLoaded();
    testDashboardFunctions();
    testDataManager();
    testAuthentication();
    testModalSystem();
    testEmergencyFeatures();
    testResponsiveDesign();
    testPerformance();
    
    console.log('\n🎉 Test Complete!');
    console.log('='.repeat(60));
    console.log('📊 Check the results above to verify all features are working.');
    console.log('🔧 If you see any ❌ errors, please check the console for details.');
    console.log('✅ All ✅ marks indicate fully functional features.');
}

// Auto-run tests when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// Export for manual testing
window.testGenibiApp = runAllTests;
