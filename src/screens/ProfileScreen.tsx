import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Button, List, Switch, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isAnonymous, signOut, setAnonymousMode } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [anonymousMode, setAnonymousModeLocal] = React.useState(isAnonymous);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.navigate('Welcome');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleAnonymousModeToggle = async (value: boolean) => {
    setAnonymousModeLocal(value);
    await setAnonymousMode(value);
    if (value) {
      Alert.alert(
        'Anonymous Mode Enabled',
        'Your activity will not be tracked or stored. You can still access all features.'
      );
    }
  };

  const getUserInfo = () => {
    if (isAnonymous) {
      return {
        name: 'Anonymous User',
        email: 'Not signed in',
        university: 'Not specified',
      };
    }
    
    return {
      name: user?.displayName || 'User',
      email: user?.email || 'No email',
      university: 'University of Lagos', // This would come from user profile data
    };
  };

  const userInfo = getUserInfo();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Icon
              size={80}
              icon={isAnonymous ? 'incognito' : 'account'}
              style={[
                styles.avatar,
                { backgroundColor: isAnonymous ? theme.colors.placeholder : theme.colors.primary }
              ]}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
              <Text style={styles.userUniversity}>{userInfo.university}</Text>
              {isAnonymous && (
                <Text style={styles.anonymousLabel}>Anonymous Mode</Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Account Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            {!isAnonymous && (
              <>
                <List.Item
                  title="Edit Profile"
                  description="Update your personal information"
                  left={(props) => <List.Icon {...props} icon="account-edit" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => {}} // TODO: Implement profile editing
                />
                
                <List.Item
                  title="Change Password"
                  description="Update your account password"
                  left={(props) => <List.Icon {...props} icon="lock" />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => {}} // TODO: Implement password change
                />
              </>
            )}

            <List.Item
              title="Anonymous Mode"
              description="Browse without tracking"
              left={(props) => <List.Icon {...props} icon="incognito" />}
              right={() => (
                <Switch
                  value={anonymousMode}
                  onValueChange={handleAnonymousModeToggle}
                  color={theme.colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <List.Item
              title="Notifications"
              description="Wellness reminders and updates"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="Crisis Support"
              description="Emergency contacts and resources"
              left={(props) => <List.Icon {...props} icon="phone" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}} // TODO: Implement crisis support
            />
            
            <List.Item
              title="Data & Privacy"
              description="Manage your data and privacy settings"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}} // TODO: Implement privacy settings
            />
          </Card.Content>
        </Card>

        {/* Support & Information */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Support & Information</Text>
            
            <List.Item
              title="Help & FAQ"
              description="Get answers to common questions"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}} // TODO: Implement help section
            />
            
            <List.Item
              title="Contact Support"
              description="Get help from our team"
              left={(props) => <List.Icon {...props} icon="email" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}} // TODO: Implement contact support
            />
            
            <List.Item
              title="About GENIBI"
              description="Learn more about our mission"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}} // TODO: Implement about page
            />
            
            <List.Item
              title="Terms & Privacy"
              description="Review our policies"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}} // TODO: Implement terms and privacy
            />
          </Card.Content>
        </Card>

        {/* Sign Out Button */}
        {!isAnonymous && (
          <Button
            mode="outlined"
            onPress={handleSignOut}
            style={styles.signOutButton}
            labelStyle={styles.signOutLabel}
            icon="logout"
          >
            Sign Out
          </Button>
        )}

        {/* App Version */}
        <Text style={styles.versionText}>
          GENIBI Mental Fitness v1.0.0
        </Text>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },
  userUniversity: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  anonymousLabel: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  sectionCard: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  signOutButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.lg,
  },
  signOutLabel: {
    color: theme.colors.error,
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: theme.spacing.md,
  },
});

export default ProfileScreen;
