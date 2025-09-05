import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import { theme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { usePerformance } from '../../hooks/usePerformance';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signInWithGoogle, setAnonymousMode } = useAuth();
  const { navigateWithPerformance, createAsyncHandler, createDebouncedHandler } = usePerformance();

  // Optimized login handler using performance utilities
  const handleLogin = useCallback(
    createAsyncHandler(
      async () => {
        if (!email || !password) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        await signIn(email, password);
      },
      setLoading,
      () => navigateWithPerformance(navigation, 'Home'),
      (error: any) => Alert.alert('Login Failed', error.message || 'An error occurred during login')
    ),
    [email, password, signIn, navigation, createAsyncHandler, navigateWithPerformance]
  );

  const handleGoogleSignIn = useCallback(
    createAsyncHandler(
      async () => {
        await signInWithGoogle();
      },
      setLoading,
      () => navigateWithPerformance(navigation, 'Home'),
      (error: any) => Alert.alert('Google Sign-In Failed', error.message || 'An error occurred during Google sign-in')
    ),
    [signInWithGoogle, navigation, createAsyncHandler, navigateWithPerformance]
  );

  const handleAnonymousAccess = useCallback(async () => {
    await setAnonymousMode(true);
    navigateWithPerformance(navigation, 'Home');
  }, [setAnonymousMode, navigation, navigateWithPerformance]);

  const navigateToSignup = useCallback(() => {
    navigateWithPerformance(navigation, 'Signup');
  }, [navigation, navigateWithPerformance]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your mental wellness journey
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                labelStyle={styles.buttonLabel}
              >
                Sign In
              </Button>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <Divider style={styles.divider} />
            </View>

            {/* Alternative Sign-in Options */}
            <View style={styles.alternativeOptions}>
              <Button
                mode="outlined"
                onPress={handleGoogleSignIn}
                loading={loading}
                disabled={loading}
                style={styles.googleButton}
                labelStyle={styles.googleButtonLabel}
                icon="google"
              >
                Continue with Google
              </Button>

              <Button
                mode="text"
                onPress={handleAnonymousAccess}
                style={styles.anonymousButton}
                labelStyle={styles.anonymousButtonLabel}
              >
                Continue Anonymously
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.linkText} onPress={navigateToSignup}>
                  Sign Up
                </Text>
              </Text>
            </View>

            {/* Support Info */}
            <View style={styles.supportInfo}>
              <Text style={styles.supportText}>
                Need help? Your privacy and safety are our priority.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.placeholder,
    fontSize: 14,
  },
  alternativeOptions: {
    marginBottom: theme.spacing.lg,
  },
  googleButton: {
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
  },
  googleButtonLabel: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  anonymousButton: {
    paddingVertical: theme.spacing.sm,
  },
  anonymousButtonLabel: {
    color: theme.colors.placeholder,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  supportInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  supportText: {
    fontSize: 12,
    color: theme.colors.placeholder,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LoginScreen;
