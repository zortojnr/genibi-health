/**
 * Performance Configuration for GENIBI Mental Fitness
 * Optimized settings for fast, smooth navigation and transitions
 */

import { Platform } from 'react-native';

// Navigation performance settings
export const NAVIGATION_CONFIG = {
  // Fast transition durations (in milliseconds)
  TRANSITION_DURATION: {
    FAST: Platform.OS === 'ios' ? 200 : 150,
    NORMAL: Platform.OS === 'ios' ? 250 : 200,
    SLOW: Platform.OS === 'ios' ? 300 : 250,
  },
  
  // Enable native driver for better performance
  USE_NATIVE_DRIVER: true,
  
  // Gesture settings for smooth navigation
  GESTURE_CONFIG: {
    enabled: true,
    direction: 'horizontal',
    responseDistance: 50,
  },
  
  // Screen options for optimal performance
  SCREEN_OPTIONS: {
    // Disable animations for instant screens
    INSTANT: {
      animationEnabled: false,
      gestureEnabled: false,
    },
    
    // Fast animations for login/auth flows
    FAST: {
      animationEnabled: true,
      gestureEnabled: true,
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: Platform.OS === 'ios' ? 200 : 150,
            useNativeDriver: true,
          },
        },
        close: {
          animation: 'timing',
          config: {
            duration: Platform.OS === 'ios' ? 150 : 100,
            useNativeDriver: true,
          },
        },
      },
    },
  },
};

// Component performance settings
export const COMPONENT_CONFIG = {
  // Optimize re-renders
  USE_MEMO: true,
  USE_CALLBACK: true,
  
  // Lazy loading settings
  LAZY_LOAD: {
    enabled: true,
    threshold: 0.1, // Load when 10% visible
  },
  
  // Image optimization
  IMAGE_CONFIG: {
    resizeMode: 'cover',
    cache: 'force-cache',
    priority: 'high',
  },
};

// Animation performance settings
export const ANIMATION_CONFIG = {
  // Reduced motion support
  RESPECT_REDUCED_MOTION: true,
  
  // Fast animation durations
  DURATION: {
    MICRO: 100,   // Button press, small UI changes
    SHORT: 200,   // Card animations, small transitions
    MEDIUM: 300,  // Screen transitions, modal animations
    LONG: 500,    // Complex animations (use sparingly)
  },
  
  // Easing functions for smooth animations
  EASING: {
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    SPRING: 'spring',
  },
};

// Network performance settings
export const NETWORK_CONFIG = {
  // Request timeouts
  TIMEOUT: {
    FAST: 3000,    // Login, quick actions
    NORMAL: 5000,  // Data fetching
    SLOW: 10000,   // File uploads, heavy operations
  },
  
  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000,
  },
  
  // Cache settings
  CACHE: {
    enabled: true,
    duration: 300000, // 5 minutes
  },
};

// Platform-specific optimizations
export const PLATFORM_CONFIG = {
  ios: {
    // iOS-specific optimizations
    enableHermes: true,
    enableFabric: true,
    enableTurboModules: true,
  },
  android: {
    // Android-specific optimizations
    enableHermes: true,
    enableProguard: true,
    enableSeparateBuildPerCPUArchitecture: true,
  },
  web: {
    // Web-specific optimizations
    enableServiceWorker: true,
    enableCodeSplitting: true,
    enableTreeShaking: true,
  },
};

// Memory management settings
export const MEMORY_CONFIG = {
  // Garbage collection hints
  CLEANUP_INTERVAL: 30000, // 30 seconds
  
  // Image cache limits
  IMAGE_CACHE_LIMIT: 50, // Maximum cached images
  
  // Component cleanup
  UNMOUNT_CLEANUP: true,
};

// Development vs Production settings
export const ENV_CONFIG = {
  development: {
    // Enable performance monitoring in dev
    enablePerformanceMonitoring: true,
    enableDebugMode: true,
    logPerformanceMetrics: true,
  },
  production: {
    // Optimize for production
    enablePerformanceMonitoring: false,
    enableDebugMode: false,
    logPerformanceMetrics: false,
    enableMinification: true,
    enableCompression: true,
  },
};

// Export default configuration based on environment
const isDevelopment = __DEV__;

export const PERFORMANCE_CONFIG = {
  navigation: NAVIGATION_CONFIG,
  components: COMPONENT_CONFIG,
  animations: ANIMATION_CONFIG,
  network: NETWORK_CONFIG,
  platform: PLATFORM_CONFIG[Platform.OS as keyof typeof PLATFORM_CONFIG],
  memory: MEMORY_CONFIG,
  environment: isDevelopment ? ENV_CONFIG.development : ENV_CONFIG.production,
};

export default PERFORMANCE_CONFIG;
