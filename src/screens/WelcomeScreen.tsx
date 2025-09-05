import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { usePerformance } from '../hooks/usePerformance';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setAnonymousMode } = useAuth();
  const { navigateWithPerformance } = usePerformance();

  // Optimized navigation handlers for instant transitions
  const handleGetStarted = useCallback(() => {
    navigateWithPerformance(navigation, 'Login');
  }, [navigation, navigateWithPerformance]);

  const handleAnonymousAccess = useCallback(async () => {
    await setAnonymousMode(true);
    navigateWithPerformance(navigation, 'Home');
  }, [setAnonymousMode, navigation, navigateWithPerformance]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo/Icon Area */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>GENIBI</Text>
            </View>
          </View>

          {/* Title and Description */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Mental Fitness</Text>
            <Text style={styles.subtitle}>
              Your companion for mental well-being
            </Text>
            <Text style={styles.description}>
              Designed specifically for Nigerian undergraduate students to enhance mental health, 
              provide support, and connect you with resources when you need them most.
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <FeatureItem text="24/7 AI Mental Health Assistant" />
            <FeatureItem text="Anonymous Support Option" />
            <FeatureItem text="E-Library & Resources" />
            <FeatureItem text="Professional Referrals" />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleGetStarted}
              style={[styles.button, styles.primaryButton]}
              labelStyle={styles.buttonLabel}
            >
              Get Started
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleAnonymousAccess}
              style={[styles.button, styles.secondaryButton]}
              labelStyle={[styles.buttonLabel, styles.secondaryButtonLabel]}
            >
              Continue Anonymously
            </Button>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Safe • Confidential • Supportive
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureBullet} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.sm,
  },
  featuresContainer: {
    marginVertical: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: theme.spacing.md,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  button: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  secondaryButton: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: theme.spacing.xs,
  },
  secondaryButtonLabel: {
    color: '#fff',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: theme.spacing.md,
  },
});

export default WelcomeScreen;
