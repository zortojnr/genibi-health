import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Card, Button, Searchbar, Chip, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';

type ResourcesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Resources'>;

interface Props {
  navigation: ResourcesScreenNavigationProp;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'audio' | 'contact' | 'website';
  url?: string;
  phone?: string;
  emergency?: boolean;
}

const ResourcesScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'counseling', label: 'Counseling' },
    { id: 'self-help', label: 'Self-Help' },
    { id: 'academic', label: 'Academic Support' },
    { id: 'wellness', label: 'Wellness' },
  ];

  const resources: Resource[] = [
    // Emergency Resources
    {
      id: '1',
      title: 'National Suicide Prevention Lifeline',
      description: '24/7 crisis support for immediate help',
      category: 'emergency',
      type: 'contact',
      phone: '199',
      emergency: true,
    },
    {
      id: '2',
      title: 'Campus Security Emergency',
      description: 'Immediate campus emergency response',
      category: 'emergency',
      type: 'contact',
      phone: '911',
      emergency: true,
    },
    
    // Counseling Resources
    {
      id: '3',
      title: 'University Counseling Center',
      description: 'Free counseling services for students',
      category: 'counseling',
      type: 'contact',
      phone: '+234-xxx-xxx-xxxx',
    },
    {
      id: '4',
      title: 'Online Therapy Platform',
      description: 'Connect with licensed therapists online',
      category: 'counseling',
      type: 'website',
      url: 'https://example-therapy.com',
    },
    
    // Self-Help Resources
    {
      id: '5',
      title: 'Managing Anxiety: A Student Guide',
      description: 'Practical strategies for dealing with anxiety in university',
      category: 'self-help',
      type: 'article',
      url: 'https://example.com/anxiety-guide',
    },
    {
      id: '6',
      title: 'Mindfulness for Students',
      description: '10-minute daily meditation practices',
      category: 'self-help',
      type: 'audio',
      url: 'https://example.com/mindfulness',
    },
    {
      id: '7',
      title: 'Stress Management Techniques',
      description: 'Video series on managing academic stress',
      category: 'self-help',
      type: 'video',
      url: 'https://example.com/stress-management',
    },
    
    // Academic Support
    {
      id: '8',
      title: 'Academic Success Center',
      description: 'Study skills and academic support services',
      category: 'academic',
      type: 'contact',
      phone: '+234-xxx-xxx-xxxx',
    },
    {
      id: '9',
      title: 'Time Management for Students',
      description: 'Learn effective time management strategies',
      category: 'academic',
      type: 'article',
      url: 'https://example.com/time-management',
    },
    
    // Wellness Resources
    {
      id: '10',
      title: 'Healthy Sleep Habits',
      description: 'Guide to better sleep for students',
      category: 'wellness',
      type: 'article',
      url: 'https://example.com/sleep-guide',
    },
    {
      id: '11',
      title: 'Campus Fitness Center',
      description: 'Physical fitness and wellness programs',
      category: 'wellness',
      type: 'contact',
      phone: '+234-xxx-xxx-xxxx',
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (type: string, emergency?: boolean) => {
    if (emergency) return 'alert-circle';
    switch (type) {
      case 'article': return 'file-document';
      case 'video': return 'play-circle';
      case 'audio': return 'headphones';
      case 'contact': return 'phone';
      case 'website': return 'web';
      default: return 'information';
    }
  };

  const getResourceColor = (emergency?: boolean) => {
    return emergency ? theme.colors.error : theme.colors.primary;
  };

  const handleResourcePress = async (resource: Resource) => {
    if (resource.phone) {
      const phoneUrl = `tel:${resource.phone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        Linking.openURL(phoneUrl);
      }
    } else if (resource.url) {
      const canOpen = await Linking.canOpenURL(resource.url);
      if (canOpen) {
        Linking.openURL(resource.url);
      }
    }
  };

  const emergencyResources = resources.filter(r => r.emergency);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Emergency Section */}
        {emergencyResources.length > 0 && (
          <Card style={[styles.card, styles.emergencyCard]}>
            <Card.Content>
              <Text style={styles.emergencyTitle}>🚨 Emergency Resources</Text>
              <Text style={styles.emergencyDescription}>
                If you're in immediate danger or having thoughts of self-harm, please reach out now:
              </Text>
              {emergencyResources.map(resource => (
                <Button
                  key={resource.id}
                  mode="contained"
                  onPress={() => handleResourcePress(resource)}
                  style={styles.emergencyButton}
                  buttonColor={theme.colors.error}
                  icon="phone"
                >
                  {resource.title} - {resource.phone}
                </Button>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Search */}
        <Searchbar
          placeholder="Search resources..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          theme={{ colors: { primary: theme.colors.primary } }}
        />

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesRow}>
              {categories.map(category => (
                <Chip
                  key={category.id}
                  selected={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.selectedCategoryChip
                  ]}
                  textStyle={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.selectedCategoryChipText
                  ]}
                >
                  {category.label}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Resources List */}
        <View style={styles.resourcesList}>
          {filteredResources.map(resource => (
            <TouchableOpacity
              key={resource.id}
              onPress={() => handleResourcePress(resource)}
            >
              <Card style={[styles.card, styles.resourceCard]}>
                <Card.Content style={styles.resourceContent}>
                  <Avatar.Icon
                    size={40}
                    icon={getResourceIcon(resource.type, resource.emergency)}
                    style={[
                      styles.resourceIcon,
                      { backgroundColor: getResourceColor(resource.emergency) }
                    ]}
                  />
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceDescription}>{resource.description}</Text>
                    <View style={styles.resourceMeta}>
                      <Chip
                        style={styles.typeChip}
                        textStyle={styles.typeChipText}
                      >
                        {resource.type.toUpperCase()}
                      </Chip>
                      {resource.emergency && (
                        <Chip
                          style={styles.emergencyChip}
                          textStyle={styles.emergencyChipText}
                        >
                          EMERGENCY
                        </Chip>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {filteredResources.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No resources found matching your search.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need to add a resource? Contact our support team.
          </Text>
          <Button
            mode="outlined"
            onPress={() => {}} // TODO: Implement contact support
            style={styles.contactButton}
          >
            Contact Support
          </Button>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  emergencyCard: {
    backgroundColor: theme.colors.emergency,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
  emergencyDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  emergencyButton: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  searchbar: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.lg,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  categoryChip: {
    backgroundColor: theme.colors.surface,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primary,
  },
  categoryChipText: {
    color: theme.colors.text,
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  resourcesList: {
    gap: theme.spacing.sm,
  },
  resourceCard: {
    backgroundColor: theme.colors.surface,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resourceIcon: {
    marginRight: theme.spacing.md,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  resourceDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  resourceMeta: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  typeChip: {
    backgroundColor: theme.colors.calm,
    height: 24,
  },
  typeChipText: {
    fontSize: 10,
    color: theme.colors.primary,
  },
  emergencyChip: {
    backgroundColor: theme.colors.error,
    height: 24,
  },
  emergencyChipText: {
    fontSize: 10,
    color: '#fff',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noResultsText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.placeholder + '20',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  contactButton: {
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
  },
});

export default ResourcesScreen;
