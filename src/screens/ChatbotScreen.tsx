import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, Card, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { openAIService, ChatMessage, ChatResponse } from '../services/openai';
import { useAuth } from '../context/AuthContext';

type ChatbotScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chatbot'>;

interface Props {
  navigation: ChatbotScreenNavigationProp;
}

interface MessageWithResponse extends ChatMessage {
  response?: ChatResponse;
}

const ChatbotScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<MessageWithResponse[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { isAnonymous } = useAuth();

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: MessageWithResponse = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm GENIBI, your mental health companion. I'm here to listen, support, and help you navigate your mental wellness journey. 

How are you feeling today? You can share anything that's on your mind - I'm here to help.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const quickResponses = [
    "I'm feeling anxious",
    "I'm stressed about exams",
    "I feel lonely",
    "I'm having trouble sleeping",
    "I need motivation",
    "I'm feeling overwhelmed",
  ];

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: MessageWithResponse = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMessage];
      const response = await openAIService.sendMessage(conversationHistory);

      const assistantMessage: MessageWithResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        response: response,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle high-risk situations
      if (response.riskLevel === 'emergency' || response.riskLevel === 'high') {
        setTimeout(() => {
          Alert.alert(
            'Support Available',
            'I notice you might be going through a difficult time. Would you like me to connect you with professional support resources?',
            [
              { text: 'Not now', style: 'cancel' },
              { text: 'Yes, please', onPress: () => navigation.navigate('Resources') },
            ]
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: MessageWithResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please reach out to emergency services or a trusted person immediately.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickResponse = (text: string) => {
    sendMessage(text);
  };

  const renderMessage = ({ item }: { item: MessageWithResponse }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
        <Card style={[styles.messageCard, isUser ? styles.userCard : styles.assistantCard]}>
          <Card.Content style={styles.messageContent}>
            <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
              {item.content}
            </Text>
            {!isUser && item.response && (
              <View style={styles.responseExtras}>
                {item.response.riskLevel !== 'low' && (
                  <Chip
                    style={[styles.riskChip, { backgroundColor: getRiskColor(item.response.riskLevel) }]}
                    textStyle={styles.riskChipText}
                  >
                    {item.response.riskLevel.toUpperCase()} PRIORITY
                  </Chip>
                )}
                {item.response.suggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionsTitle}>Suggestions:</Text>
                    {item.response.suggestions.map((suggestion, index) => (
                      <Text key={index} style={styles.suggestionText}>
                        • {suggestion}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'emergency': return theme.colors.error;
      case 'high': return theme.colors.warning;
      case 'medium': return theme.colors.accent;
      default: return theme.colors.info;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Privacy Notice */}
        {isAnonymous && (
          <View style={styles.privacyNotice}>
            <Text style={styles.privacyText}>
              🔒 Anonymous mode - Your conversation is private and secure
            </Text>
          </View>
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Quick Responses */}
        {messages.length <= 1 && (
          <View style={styles.quickResponsesContainer}>
            <Text style={styles.quickResponsesTitle}>Quick responses:</Text>
            <View style={styles.quickResponsesGrid}>
              {quickResponses.map((response, index) => (
                <Chip
                  key={index}
                  onPress={() => handleQuickResponse(response)}
                  style={styles.quickResponseChip}
                  textStyle={styles.quickResponseText}
                >
                  {response}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            mode="outlined"
            multiline
            style={styles.textInput}
            theme={{ colors: { primary: theme.colors.primary } }}
            disabled={loading}
          />
          <Button
            mode="contained"
            onPress={() => sendMessage(inputText)}
            loading={loading}
            disabled={loading || !inputText.trim()}
            style={styles.sendButton}
            icon="send"
          >
            Send
          </Button>
        </View>
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
  privacyNotice: {
    backgroundColor: theme.colors.calm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  privacyText: {
    fontSize: 12,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    ...theme.shadows.small,
  },
  userCard: {
    backgroundColor: theme.colors.primary,
  },
  assistantCard: {
    backgroundColor: theme.colors.surface,
  },
  messageContent: {
    paddingVertical: theme.spacing.sm,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: theme.spacing.xs,
    marginHorizontal: theme.spacing.sm,
  },
  responseExtras: {
    marginTop: theme.spacing.sm,
  },
  riskChip: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  riskChipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    marginTop: theme.spacing.sm,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  suggestionText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  quickResponsesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.placeholder + '20',
  },
  quickResponsesTitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.sm,
  },
  quickResponsesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  quickResponseChip: {
    backgroundColor: theme.colors.calm,
  },
  quickResponseText: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.placeholder + '20',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: theme.borderRadius.round,
    minWidth: 60,
  },
});

export default ChatbotScreen;
