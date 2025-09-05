/**
 * Performance Testing Script for GENIBI Mental Fitness
 * Tests login page transition speed across different scenarios
 */

// Performance measurement utilities
const PerformanceTest = {
    // Measure transition time
    measureTransition: (elementSelector, action, callback) => {
        const element = document.querySelector(elementSelector);
        if (!element) {
            console.error(`Element not found: ${elementSelector}`);
            return;
        }

        const startTime = performance.now();
        
        // Execute the action
        action();
        
        // Wait for transition to complete
        const observer = new MutationObserver(() => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            console.log(`Transition completed in ${duration.toFixed(2)}ms`);
            if (callback) callback(duration);
            
            observer.disconnect();
        });
        
        observer.observe(element, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    },

    // Test login form submission speed
    testLoginSpeed: () => {
        console.log('🚀 Testing login form submission speed...');
        
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!form || !emailInput || !passwordInput) {
            console.error('Login form elements not found');
            return;
        }

        // Fill in test credentials
        emailInput.value = 'test@example.com';
        passwordInput.value = 'password123';
        
        const startTime = performance.now();
        
        // Simulate form submission
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
        
        // Measure time to visual feedback
        setTimeout(() => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.log(`✅ Login form response time: ${duration.toFixed(2)}ms`);
        }, 10);
    },

    // Test navigation transitions
    testNavigationSpeed: () => {
        console.log('🔄 Testing navigation transitions...');
        
        const authContainer = document.getElementById('auth-container');
        const mainApp = document.getElementById('main-app');
        
        if (!authContainer || !mainApp) {
            console.error('Navigation containers not found');
            return;
        }

        // Test auth to main app transition
        PerformanceTest.measureTransition('#auth-container', () => {
            authContainer.classList.add('hidden');
            mainApp.classList.remove('hidden');
        }, (duration) => {
            console.log(`✅ Auth → Main App transition: ${duration.toFixed(2)}ms`);
            
            // Test reverse transition
            setTimeout(() => {
                PerformanceTest.measureTransition('#main-app', () => {
                    mainApp.classList.add('hidden');
                    authContainer.classList.remove('hidden');
                }, (duration) => {
                    console.log(`✅ Main App → Auth transition: ${duration.toFixed(2)}ms`);
                });
            }, 100);
        });
    },

    // Test button responsiveness
    testButtonResponse: () => {
        console.log('🔘 Testing button responsiveness...');
        
        const buttons = document.querySelectorAll('.btn');
        let totalResponseTime = 0;
        let buttonCount = 0;
        
        buttons.forEach((button, index) => {
            const startTime = performance.now();
            
            // Simulate click
            button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            
            // Measure visual feedback time
            requestAnimationFrame(() => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                totalResponseTime += duration;
                buttonCount++;
                
                if (buttonCount === buttons.length) {
                    const avgResponse = totalResponseTime / buttonCount;
                    console.log(`✅ Average button response time: ${avgResponse.toFixed(2)}ms`);
                }
            });
        });
    },

    // Test input field responsiveness
    testInputResponse: () => {
        console.log('📝 Testing input field responsiveness...');
        
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        let totalResponseTime = 0;
        let inputCount = 0;
        
        inputs.forEach((input) => {
            const startTime = performance.now();
            
            // Simulate focus
            input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            
            // Measure visual feedback time
            requestAnimationFrame(() => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                totalResponseTime += duration;
                inputCount++;
                
                if (inputCount === inputs.length) {
                    const avgResponse = totalResponseTime / inputCount;
                    console.log(`✅ Average input response time: ${avgResponse.toFixed(2)}ms`);
                }
            });
        });
    },

    // Run all performance tests
    runAllTests: () => {
        console.log('🧪 Starting GENIBI Performance Tests...');
        console.log('==========================================');
        
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                PerformanceTest.executeTests();
            });
        } else {
            PerformanceTest.executeTests();
        }
    },

    executeTests: () => {
        // Test in sequence with delays to avoid interference
        PerformanceTest.testButtonResponse();
        
        setTimeout(() => {
            PerformanceTest.testInputResponse();
        }, 500);
        
        setTimeout(() => {
            PerformanceTest.testNavigationSpeed();
        }, 1000);
        
        setTimeout(() => {
            PerformanceTest.testLoginSpeed();
        }, 1500);
        
        setTimeout(() => {
            console.log('==========================================');
            console.log('🎉 Performance tests completed!');
            console.log('Target: All transitions < 100ms for optimal UX');
        }, 2000);
    },

    // Device-specific performance test
    testDevicePerformance: () => {
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory || 'Unknown',
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : 'Unknown'
        };
        
        console.log('📱 Device Performance Info:');
        console.log(deviceInfo);
        
        // Adjust expectations based on device capabilities
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 2 || (navigator.deviceMemory && navigator.deviceMemory <= 2);
        
        if (isMobile) {
            console.log('📱 Mobile device detected - optimizing for touch interactions');
        }
        
        if (isLowEnd) {
            console.log('⚡ Low-end device detected - prioritizing performance over animations');
        }
    }
};

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
    // Add to global scope for manual testing
    window.PerformanceTest = PerformanceTest;
    
    // Auto-run on page load
    PerformanceTest.runAllTests();
    PerformanceTest.testDevicePerformance();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTest;
}
