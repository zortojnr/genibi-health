import express from 'express';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: string;
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  suggestions: string[];
  resources?: string[];
}

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const systemPrompt = `You are GENIBI, a compassionate mental health assistant specifically designed for Nigerian undergraduate students. Your role is to:

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

// Validation middleware
const validateChatMessage = [
  body('messages')
    .isArray({ min: 1 })
    .withMessage('Messages array is required and must not be empty'),
  body('messages.*.role')
    .isIn(['user', 'assistant', 'system'])
    .withMessage('Invalid message role'),
  body('messages.*.content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),
];

// POST /api/chat/message - Send message to AI assistant
router.post('/message', validateChatMessage, async (req: AuthenticatedRequest, res: any) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { messages }: { messages: ChatMessage[] } = req.body;

    if (!OPENAI_API_KEY) {
      throw createError('OpenAI API key not configured', 500);
    }

    // Prepare messages for OpenAI
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: openAIMessages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    // Analyze risk level based on conversation
    const riskLevel = assessRiskLevel(messages);
    const suggestions = generateSuggestions(riskLevel);
    const resources = getRelevantResources(riskLevel);

    const chatResponse: ChatResponse = {
      message: aiMessage,
      riskLevel,
      suggestions,
      resources,
    };

    // Log conversation for monitoring (anonymized)
    console.log('Chat interaction:', {
      userId: req.userId,
      riskLevel,
      timestamp: new Date().toISOString(),
      messageCount: messages.length,
    });

    res.json({
      success: true,
      data: chatResponse,
    });

  } catch (error: any) {
    console.error('Chat API error:', error);

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        error: 'Request timeout',
        message: 'The AI assistant is taking too long to respond. Please try again.',
      });
    }

    throw createError('Failed to get response from AI assistant', 500);
  }
});

// GET /api/chat/quick-responses - Get quick response suggestions
router.get('/quick-responses', (req: AuthenticatedRequest, res) => {
  const quickResponses = [
    "I'm feeling anxious about exams",
    "I'm having trouble sleeping",
    "I feel overwhelmed with coursework",
    "I'm feeling lonely and isolated",
    "I need help managing stress",
    "I'm worried about my future",
    "I'm having relationship problems",
    "I feel like I'm not good enough",
  ];

  res.json({
    success: true,
    data: quickResponses,
  });
});

// Helper functions
function assessRiskLevel(messages: ChatMessage[]): 'low' | 'medium' | 'high' | 'emergency' {
  const lastUserMessage = messages
    .filter(m => m.role === 'user')
    .pop()?.content.toLowerCase() || '';

  // Emergency keywords
  const emergencyKeywords = [
    'suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm',
    'want to die', 'better off dead', 'no point living'
  ];
  if (emergencyKeywords.some(keyword => lastUserMessage.includes(keyword))) {
    return 'emergency';
  }

  // High risk keywords
  const highRiskKeywords = [
    'depressed', 'hopeless', 'worthless', 'panic attack', 'substance',
    'drugs', 'alcohol', 'cutting', 'severe anxiety'
  ];
  if (highRiskKeywords.some(keyword => lastUserMessage.includes(keyword))) {
    return 'high';
  }

  // Medium risk keywords
  const mediumRiskKeywords = [
    'anxious', 'stressed', 'overwhelmed', 'sad', 'lonely', 'insomnia',
    'sleep problems', 'crying', 'worried'
  ];
  if (mediumRiskKeywords.some(keyword => lastUserMessage.includes(keyword))) {
    return 'medium';
  }

  return 'low';
}

function generateSuggestions(riskLevel: string): string[] {
  switch (riskLevel) {
    case 'emergency':
      return [
        'Contact emergency services immediately (199)',
        'Reach out to a trusted friend or family member now',
        'Go to the nearest hospital emergency room',
        'Call campus security for immediate help'
      ];
    case 'high':
      return [
        'Consider speaking with a counselor or therapist',
        'Contact your university counseling center',
        'Practice deep breathing exercises',
        'Reach out to supportive friends or family',
        'Maintain a regular sleep schedule'
      ];
    case 'medium':
      return [
        'Try mindfulness or meditation',
        'Engage in physical exercise',
        'Talk to someone you trust',
        'Practice stress management techniques',
        'Consider joining a support group'
      ];
    default:
      return [
        'Maintain healthy daily routines',
        'Stay connected with friends and family',
        'Practice regular self-care',
        'Keep a positive mindset',
        'Continue healthy habits'
      ];
  }
}

function getRelevantResources(riskLevel: string): string[] {
  const baseResources = [
    'GENIBI E-Library',
    'Campus Counseling Services',
    'Peer Support Groups',
    'Mental Health Resources'
  ];

  if (riskLevel === 'emergency' || riskLevel === 'high') {
    return [
      'Emergency Mental Health Services',
      'Crisis Intervention Centers',
      'Professional Therapists Directory',
      'Suicide Prevention Hotline',
      ...baseResources,
    ];
  }

  return baseResources;
}

// Risk assessment function
function assessRiskLevel(messages: ChatMessage[]): 'low' | 'medium' | 'high' | 'emergency' {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';

  // Emergency keywords
  if (lastUserMessage.includes('suicide') || lastUserMessage.includes('kill myself') ||
      lastUserMessage.includes('end my life') || lastUserMessage.includes('self-harm') ||
      lastUserMessage.includes('hurt myself')) {
    return 'emergency';
  }

  // High risk keywords
  if (lastUserMessage.includes('severe depression') || lastUserMessage.includes('panic attack') ||
      lastUserMessage.includes('substance abuse') || lastUserMessage.includes('can\'t cope')) {
    return 'high';
  }

  // Medium risk keywords
  if (lastUserMessage.includes('depression') || lastUserMessage.includes('anxiety') ||
      lastUserMessage.includes('insomnia') || lastUserMessage.includes('withdrawal')) {
    return 'medium';
  }

  return 'low';
}

// Generate suggestions based on risk level
function generateSuggestions(riskLevel: string): string[] {
  switch (riskLevel) {
    case 'emergency':
      return [
        'Contact emergency services immediately',
        'Call our crisis helpline: +234 806 027 0792',
        'Reach out to a trusted friend or family member',
        'Go to the nearest emergency room'
      ];
    case 'high':
      return [
        'Schedule an appointment with a mental health professional',
        'Contact our helpline for immediate support',
        'Practice grounding techniques',
        'Avoid being alone - stay with supportive people'
      ];
    case 'medium':
      return [
        'Consider speaking with a counselor',
        'Practice relaxation techniques',
        'Maintain a regular sleep schedule',
        'Engage in physical activity'
      ];
    default:
      return [
        'Continue healthy habits',
        'Practice mindfulness',
        'Stay connected with friends',
        'Maintain work-life balance'
      ];
  }
}

// Get relevant resources based on risk level
function getRelevantResources(riskLevel: string): string[] {
  const baseResources = [
    'Genibi 24/7 Helpline: +234 806 027 0792',
    'Campus Counseling Center',
    'Mental Health First Aid Guide'
  ];

  switch (riskLevel) {
    case 'emergency':
      return [
        'Emergency Services: 199',
        'Crisis Helpline: +234 806 027 0792',
        'Suicide Prevention Lifeline',
        ...baseResources
      ];
    case 'high':
      return [
        'Mental Health Professionals Directory',
        'Crisis Support Groups',
        'Therapy Appointment Booking',
        ...baseResources
      ];
    case 'medium':
      return [
        'Counseling Services',
        'Support Groups',
        'Wellness Programs',
        ...baseResources
      ];
    default:
      return [
        'Wellness Tips',
        'Stress Management Resources',
        'Healthy Living Guide',
        ...baseResources
      ];
  }
}

export default router;
