import axios from 'axios';

// OpenAI API configuration
// Note: In production, this should be handled by your backend API
const OPENAI_API_URL = 'http://localhost:5000/api/chat/message';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  suggestions: string[];
  resources?: string[];
}

class OpenAIService {
  private systemPrompt = `You are GENIBI, a compassionate mental health assistant specifically designed for Nigerian undergraduate students. Your role is to:

1. Provide supportive, empathetic responses to mental health concerns
2. Detect early warning signs of mental health issues (depression, anxiety, PTSD, panic attacks, substance abuse)
3. Offer coping strategies and wellness tips
4. Provide culturally sensitive advice relevant to Nigerian students
5. Recommend professional help when necessary
6. Never provide medical diagnoses or replace professional treatment

Guidelines:
- Be warm, understanding, and non-judgmental
- Use simple, accessible language
- Respect Nigerian cultural context
- Encourage help-seeking when appropriate
- Provide practical coping strategies
- Always prioritize user safety

Risk Assessment:
- LOW: General wellness, mild stress, academic pressure
- MEDIUM: Persistent sadness, anxiety, sleep issues, social withdrawal
- HIGH: Severe depression symptoms, panic attacks, substance use concerns
- EMERGENCY: Suicidal thoughts, self-harm, immediate danger

Always end responses with appropriate resources or next steps.`;

  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dummy-token', // Backend will handle auth
          },
        }
      );

      // Backend returns the complete response
      return response.data.data;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  private assessRiskLevel(messages: ChatMessage[]): 'low' | 'medium' | 'high' | 'emergency' {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
    
    // Emergency keywords
    const emergencyKeywords = ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm'];
    if (emergencyKeywords.some(keyword => lastUserMessage.includes(keyword))) {
      return 'emergency';
    }

    // High risk keywords
    const highRiskKeywords = ['depressed', 'hopeless', 'worthless', 'panic attack', 'substance', 'drugs', 'alcohol'];
    if (highRiskKeywords.some(keyword => lastUserMessage.includes(keyword))) {
      return 'high';
    }

    // Medium risk keywords
    const mediumRiskKeywords = ['anxious', 'stressed', 'overwhelmed', 'sad', 'lonely', 'insomnia', 'sleep'];
    if (mediumRiskKeywords.some(keyword => lastUserMessage.includes(keyword))) {
      return 'medium';
    }

    return 'low';
  }

  private generateSuggestions(riskLevel: string): string[] {
    switch (riskLevel) {
      case 'emergency':
        return [
          'Contact emergency services immediately',
          'Reach out to a trusted friend or family member',
          'Call a crisis helpline',
          'Go to the nearest hospital emergency room'
        ];
      case 'high':
        return [
          'Consider speaking with a counselor or therapist',
          'Practice deep breathing exercises',
          'Reach out to supportive friends or family',
          'Maintain a regular sleep schedule'
        ];
      case 'medium':
        return [
          'Try mindfulness or meditation',
          'Engage in physical exercise',
          'Talk to someone you trust',
          'Practice stress management techniques'
        ];
      default:
        return [
          'Maintain healthy habits',
          'Stay connected with friends',
          'Practice self-care',
          'Keep a positive routine'
        ];
    }
  }

  private getRelevantResources(riskLevel: string): string[] {
    const baseResources = [
      'GENIBI E-Library',
      'Campus Counseling Services',
      'Peer Support Groups'
    ];

    if (riskLevel === 'emergency' || riskLevel === 'high') {
      return [
        ...baseResources,
        'Emergency Mental Health Services',
        'Crisis Intervention Centers',
        'Professional Therapists Directory'
      ];
    }

    return baseResources;
  }
}

export const openAIService = new OpenAIService();
