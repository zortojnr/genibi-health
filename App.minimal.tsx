import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Minimal, crash-proof version of GENIBI Mental Fitness
export default function App() {
  const handleFeature = (feature: string) => {
    Alert.alert('GENIBI Mental Fitness', `${feature} feature coming soon!`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GENIBI</Text>
        <Text style={styles.headerSubtitle}>Mental Fitness</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.welcomeText}>
          Welcome to GENIBI Mental Fitness - Your companion for mental well-being
        </Text>

        {/* Feature Cards */}
        <TouchableOpacity style={styles.card} onPress={() => handleFeature('AI Chatbot')}>
          <Text style={styles.cardTitle}>🤖 AI Mental Health Assistant</Text>
          <Text style={styles.cardDescription}>
            Chat with our AI assistant for mental health support and guidance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleFeature('Mood Tracking')}>
          <Text style={styles.cardTitle}>📊 Mood Tracking</Text>
          <Text style={styles.cardDescription}>
            Track your daily mood and mental wellness progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleFeature('Resources')}>
          <Text style={styles.cardTitle}>📚 Mental Health Resources</Text>
          <Text style={styles.cardDescription}>
            Access curated mental health resources and educational content
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleFeature('Community')}>
          <Text style={styles.cardTitle}>👥 Community Support</Text>
          <Text style={styles.cardDescription}>
            Connect with others on their mental wellness journey
          </Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About GENIBI</Text>
          <Text style={styles.infoText}>
            GENIBI Mental Fitness is designed specifically for Nigerian undergraduate students 
            to enhance mental well-being through AI-powered support, mood tracking, and 
            community resources.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>GENIBI Team © 2024</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    lineHeight: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#4A90E2',
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 12,
  },
});
