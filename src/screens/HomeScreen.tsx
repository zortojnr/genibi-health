import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isAnonymous } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = () => {
    if (isAnonymous) return 'Friend';
    if (user?.displayName) return user.displayName.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'Friend';
  };

  const quickActions = [
    {
      title: 'Chat with AI Assistant',
      subtitle: 'Get instant mental health support',
      icon: 'robot',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Chatbot'),
    },
    {
      title: 'Daily Check-in',
      subtitle: 'Track your mood and feelings',
      icon: 'heart',
      color: theme.colors.secondary,
      onPress: () => {}, // TODO: Implement mood tracking
    },
    {
      title: 'Resources & E-Library',
      subtitle: 'Access mental health resources',
      icon: 'book-open',
      color: theme.colors.accent,
      onPress: () => navigation.navigate('Resources'),
    },
    {
      title: 'Emergency Support',
      subtitle: 'Get immediate help',
      icon: 'phone',
      color: theme.colors.error,
      onPress: () => {}, // TODO: Implement emergency contacts
    },
  ];

  const wellnessTips = [
    'Take 5 deep breaths when feeling overwhelmed',
    'Stay hydrated - drink at least 8 glasses of water daily',
    'Get 7-9 hours of sleep for better mental clarity',
    'Connect with a friend or family member today',
    'Practice gratitude by writing down 3 things you\'re thankful for',
  ];

  const todaysTip = wellnessTips[new Date().getDay() % wellnessTips.length];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{getUserName()}</Text>
              {isAnonymous && (
                <Text style={styles.anonymousNote}>
                  You're browsing anonymously
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.profileButton}
            >
              <Avatar.Icon
                size={50}
                icon="account"
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <Card style={[styles.card, { borderLeftColor: action.color }]}>
                  <Card.Content style={styles.cardContent}>
                    <Avatar.Icon
                      size={40}
                      icon={action.icon}
                      style={[styles.actionIcon, { backgroundColor: action.color }]}
                    />
                    <View style={styles.actionText}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Wellness Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Wellness Tip</Text>
          <Card style={[styles.card, styles.tipCard]}>
            <Card.Content>
              <View style={styles.tipContent}>
                <Avatar.Icon
                  size={40}
                  icon="lightbulb"
                  style={styles.tipIcon}
                />
                <Text style={styles.tipText}>{todaysTip}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Mental Health Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mental Health Resources</Text>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.resourceTitle}>
                Need someone to talk to?
              </Text>
              <Text style={styles.resourceText}>
                Our platform connects you with professional counselors, 
                peer support groups, and emergency services when you need them most.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Resources')}
                style={styles.resourceButton}
              >
                Explore Resources
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Emergency Notice */}
        <View style={styles.section}>
          <Card style={[styles.card, styles.emergencyCard]}>
            <Card.Content>
              <Text style={styles.emergencyTitle}>
                🚨 In Crisis? Get Help Now
              </Text>
              <Text style={styles.emergencyText}>
                If you're having thoughts of self-harm or suicide, 
                please reach out for immediate help.
              </Text>
              <Button
                mode="contained"
                onPress={() => {}} // TODO: Implement emergency contacts
                style={styles.emergencyButton}
                buttonColor={theme.colors.error}
              >
                Emergency Contacts
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  anonymousNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: theme.spacing.xs,
  },
  profileButton: {
    marginLeft: theme.spacing.md,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  actionsGrid: {
    gap: theme.spacing.md,
  },
  actionCard: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    ...theme.shadows.small,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: theme.spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  actionSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  tipCard: {
    backgroundColor: theme.colors.wellness,
    borderLeftColor: theme.colors.secondary,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    backgroundColor: theme.colors.secondary,
    marginRight: theme.spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  resourceText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  resourceButton: {
    borderRadius: theme.borderRadius.lg,
  },
  emergencyCard: {
    backgroundColor: theme.colors.emergency,
    borderLeftColor: theme.colors.error,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
  emergencyText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  emergencyButton: {
    borderRadius: theme.borderRadius.lg,
  },
});

export default HomeScreen;
