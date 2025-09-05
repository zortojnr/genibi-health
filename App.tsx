import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';

// Context
import { AuthProvider } from './src/context/AuthContext';
import { theme } from './src/theme/theme';
import ErrorBoundary from './src/components/ErrorBoundary';

// Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Chatbot: undefined;
  Profile: undefined;
  Resources: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Optimized transition configurations for fast, smooth animations
const getTransitionConfig = () => {
  if (Platform.OS === 'ios') {
    return {
      ...TransitionPresets.SlideFromRightIOS,
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: 200, // Reduced from default 350ms
            useNativeDriver: true,
          },
        },
        close: {
          animation: 'timing',
          config: {
            duration: 150, // Reduced from default 350ms
            useNativeDriver: true,
          },
        },
      },
    };
  } else {
    return {
      ...TransitionPresets.FadeFromBottomAndroid,
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: 150, // Reduced from default 300ms
            useNativeDriver: true,
          },
        },
        close: {
          animation: 'timing',
          config: {
            duration: 100, // Reduced from default 300ms
            useNativeDriver: true,
          },
        },
      },
    };
  }
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: theme.colors.primary,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  // Apply optimized transitions globally
                  ...getTransitionConfig(),
                  // Enable gesture handling for faster navigation
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  // Optimize header rendering
                  headerBackTitleVisible: false,
                  // Reduce header animation duration
                  headerTransitionPreset: 'fade',
                }}
              >

              {/* Welcome Screen - No header for clean first impression */}
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                  headerShown: false,
                  // Instant loading for welcome screen
                  animationEnabled: false,
                }}
              />

              {/* Login Screen - Optimized for fast transition */}
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: 'Sign In',
                  // Fast slide transition
                  ...getTransitionConfig(),
                  // Pre-load for instant appearance
                  lazy: false,
                }}
              />

              {/* Signup Screen - Fast transition */}
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{
                  title: 'Create Account',
                  ...getTransitionConfig(),
                  lazy: false,
                }}
              />

              {/* Home Screen - No header, instant loading */}
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false,
                  // Instant transition to home
                  animationEnabled: false,
                }}
              />

              {/* Other screens with optimized transitions */}
              <Stack.Screen
                name="Chatbot"
                component={ChatbotScreen}
                options={{
                  title: 'Mental Health Assistant',
                  ...getTransitionConfig(),
                }}
              />

              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  title: 'Profile',
                  ...getTransitionConfig(),
                }}
              />

              <Stack.Screen
                name="Resources"
                component={ResourcesScreen}
                options={{
                  title: 'Resources & E-Library',
                  ...getTransitionConfig(),
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  </ErrorBoundary>
  );
}
