'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemo?: boolean;
}

export default function ChatbotModal({ isOpen, onClose, isDemo = false }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const userName = isDemo ? 'Demo User' : user?.displayName?.split(' ')[0] || 'there';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `Hello ${userName}! I'm your AI Health Assistant. I'm here to help with health guidance and support. How can I assist you today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, userName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('stress') || message.includes('anxiety') || message.includes('worried')) {
      return `${userName}, I understand you're feeling stressed. Try taking 5 deep breaths. Would you like me to guide you through a breathing exercise? Remember, our 24/7 helpline is available at +234 806 027 0792.`;
    }

    if (message.includes('appointment') || message.includes('doctor') || message.includes('schedule')) {
      return `To book an appointment, ${userName}, you can call our helpline at +234 806 027 0792 or use the Appointments feature in your dashboard.`;
    }

    if (message.includes('emergency') || message.includes('crisis') || message.includes('help') || message.includes('urgent')) {
      return `${userName}, if this is a medical emergency, please call emergency services immediately or contact our 24/7 helpline at +234 806 027 0792. I'm here to support you.`;
    }

    if (message.includes('medication') || message.includes('pills') || message.includes('prescription')) {
      return `For medication questions, ${userName}, always consult your healthcare provider. You can track your medications using the Medications feature in your dashboard.`;
    }

    if (message.includes('mood') || message.includes('feeling') || message.includes('sad') || message.includes('happy')) {
      return `${userName}, tracking your mood is important for mental health. Use our Mood Tracker to log how you're feeling today. Your emotional wellness matters.`;
    }

    if (message.includes('vital') || message.includes('heart') || message.includes('pressure') || message.includes('health')) {
      return `${userName}, monitoring your vital signs is crucial for health. Use our Vital Signs tracker to record your heart rate, blood pressure, and temperature.`;
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return `You're welcome, ${userName}! I'm always here to help with your health and wellness questions. Is there anything else I can assist you with?`;
    }

    return `Thank you for your message, ${userName}. I'm here to help with your health and wellness. You can ask me about stress management, appointments, medications, mood tracking, or any health concerns. How can I assist you today?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmergencyCall = () => {
    window.open('tel:+2348060270792', '_self');
    toast.success('Calling emergency support...');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl h-[600px] rounded-2xl bg-white shadow-large flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <Bot className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">AI Health Assistant</h3>
                  <p className="text-sm text-neutral-600">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEmergencyCall}
                  className="text-error-600 border-error-200 hover:bg-error-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Emergency
                </Button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      message.type === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`mt-1 text-xs ${
                        message.type === 'user' ? 'text-primary-100' : 'text-neutral-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl bg-neutral-100 px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-neutral-200 p-4">
              {isDemo && (
                <div className="mb-3 rounded-lg bg-warning-50 border border-warning-200 p-3">
                  <p className="text-sm text-warning-800">
                    📝 <strong>Demo Mode:</strong> This is a simulated AI assistant. 
                    Sign up for access to our advanced AI health guidance.
                  </p>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-neutral-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
