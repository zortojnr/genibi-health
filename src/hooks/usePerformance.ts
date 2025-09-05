/**
 * Performance Hook for GENIBI Mental Fitness
 * Provides optimized navigation and interaction utilities
 */

import { useCallback, useMemo } from 'react';
import { InteractionManager, Platform } from 'react-native';
import { PERFORMANCE_CONFIG } from '../config/performance';

export const usePerformance = () => {
  // Optimized navigation function
  const navigateWithPerformance = useCallback((navigation: any, routeName: string, params?: any) => {
    // Use InteractionManager to ensure smooth transitions
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(routeName, params);
    });
  }, []);

  // Optimized navigation replacement (for auth flows)
  const replaceWithPerformance = useCallback((navigation: any, routeName: string, params?: any) => {
    InteractionManager.runAfterInteractions(() => {
      navigation.replace(routeName, params);
    });
  }, []);

  // Optimized navigation reset (for complete flow changes)
  const resetWithPerformance = useCallback((navigation: any, routes: any) => {
    InteractionManager.runAfterInteractions(() => {
      navigation.reset(routes);
    });
  }, []);

  // Debounced action handler to prevent rapid taps
  const createDebouncedHandler = useCallback((handler: () => void, delay: number = 300) => {
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handler, delay);
    };
  }, []);

  // Throttled action handler for performance-critical actions
  const createThrottledHandler = useCallback((handler: () => void, delay: number = 200) => {
    let lastCall = 0;
    
    return () => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        handler();
      }
    };
  }, []);

  // Optimized async handler with loading states
  const createAsyncHandler = useCallback((
    asyncFn: () => Promise<void>,
    setLoading: (loading: boolean) => void,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    return async () => {
      setLoading(true);
      try {
        await asyncFn();
        onSuccess?.();
      } catch (error) {
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  // Get optimized transition config for current platform
  const getTransitionConfig = useMemo(() => {
    return PERFORMANCE_CONFIG.navigation.SCREEN_OPTIONS.FAST;
  }, []);

  // Get optimized animation duration
  const getAnimationDuration = useCallback((type: 'MICRO' | 'SHORT' | 'MEDIUM' | 'LONG' = 'SHORT') => {
    return PERFORMANCE_CONFIG.animations.DURATION[type];
  }, []);

  // Check if reduced motion is preferred
  const shouldReduceMotion = useMemo(() => {
    // In a real app, you'd check system accessibility settings
    // For now, return false to enable animations
    return false;
  }, []);

  // Optimized image props
  const getOptimizedImageProps = useMemo(() => {
    return {
      ...PERFORMANCE_CONFIG.components.IMAGE_CONFIG,
      fadeDuration: shouldReduceMotion ? 0 : 200,
    };
  }, [shouldReduceMotion]);

  // Performance monitoring (development only)
  const measurePerformance = useCallback((label: string, fn: () => void) => {
    if (__DEV__ && PERFORMANCE_CONFIG.environment.enablePerformanceMonitoring) {
      const start = Date.now();
      fn();
      const end = Date.now();
      console.log(`[Performance] ${label}: ${end - start}ms`);
    } else {
      fn();
    }
  }, []);

  // Memory cleanup helper
  const scheduleCleanup = useCallback((cleanupFn: () => void) => {
    return setTimeout(cleanupFn, PERFORMANCE_CONFIG.memory.CLEANUP_INTERVAL);
  }, []);

  // Platform-specific optimizations
  const platformOptimizations = useMemo(() => {
    return {
      useNativeDriver: PERFORMANCE_CONFIG.navigation.USE_NATIVE_DRIVER,
      enableHermes: PERFORMANCE_CONFIG.platform.enableHermes,
      gestureEnabled: PERFORMANCE_CONFIG.navigation.GESTURE_CONFIG.enabled,
    };
  }, []);

  return {
    // Navigation helpers
    navigateWithPerformance,
    replaceWithPerformance,
    resetWithPerformance,
    
    // Action handlers
    createDebouncedHandler,
    createThrottledHandler,
    createAsyncHandler,
    
    // Configuration getters
    getTransitionConfig,
    getAnimationDuration,
    getOptimizedImageProps,
    
    // Performance utilities
    measurePerformance,
    scheduleCleanup,
    
    // Platform info
    platformOptimizations,
    shouldReduceMotion,
  };
};

export default usePerformance;
