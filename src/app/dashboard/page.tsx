'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Phone, 
  Pills, 
  Calendar, 
  Smile, 
  FileText, 
  Leaf,
  Bot,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/ui/loading-screen';
import Button from '@/components/ui/button';
import DashboardCard from '@/components/dashboard/dashboard-card';
import ChatbotModal from '@/components/chatbot/chatbot-modal';
import FeatureModal from '@/components/dashboard/feature-modal';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('🔴 Connecting...');
  
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true' || user?.isDemo;

  useEffect(() => {
    if (!isAuthenticated && !isDemo) {
      router.push('/');
      return;
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setConnectionStatus('🟢 Connected');
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isDemo, router]);

  const handleLogout = async () => {
    if (isDemo) {
      router.push('/');
    } else {
      await logout();
      router.push('/');
    }
  };

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    setShowFeatureModal(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const userName = isDemo ? 'Demo User' : user?.displayName || 'User';
  const userEmail = isDemo ? 'demo@genibi.com' : user?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-primary-500 heartbeat" />
                <Activity className="absolute inset-0 h-8 w-8 text-secondary-500 ecg-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-health">GENIBI</h1>
                <p className="text-xs text-neutral-600">NT Healthcare Plus</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              <span className="hidden text-sm text-neutral-600 sm:inline">
                {connectionStatus}
              </span>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-neutral-900">
                  Welcome, {userName.split(' ')[0]}!
                </p>
                <p className="text-xs text-neutral-600">{userEmail}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-neutral-600 hover:text-neutral-900"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-neutral-900">Your Health Dashboard</h2>
          <p className="mt-2 text-neutral-600">
            Monitor your health, book appointments, and access 24/7 support
          </p>
          {isDemo && (
            <div className="mt-4 rounded-lg bg-warning-50 border border-warning-200 p-4">
              <p className="text-sm text-warning-800">
                📝 <strong>Demo Mode:</strong> You're exploring GENIBI in demo mode. 
                Sign up for full access to all features and real data storage.
              </p>
            </div>
          )}
        </motion.div>

        {/* Dashboard Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {dashboardFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <DashboardCard
                {...feature}
                onClick={() => 
                  feature.id === 'chatbot' 
                    ? setShowChatbot(true) 
                    : handleFeatureClick(feature.id)
                }
                isDemo={isDemo}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 rounded-2xl bg-white p-6 shadow-soft"
        >
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChatbot(true)}
            >
              <Bot className="mr-2 h-4 w-4" />
              Ask AI Assistant
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeatureClick('emergency')}
            >
              <Phone className="mr-2 h-4 w-4" />
              Emergency Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeatureClick('appointments')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeatureClick('mood')}
            >
              <Smile className="mr-2 h-4 w-4" />
              Log Mood
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Modals */}
      <ChatbotModal
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        isDemo={isDemo}
      />

      <FeatureModal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        featureId={selectedFeature}
        isDemo={isDemo}
      />
    </div>
  );
}

const dashboardFeatures = [
  {
    id: 'chatbot',
    title: 'AI Health Assistant',
    description: 'Chat with our AI for health guidance and support',
    icon: Bot,
    color: 'primary',
    urgent: false,
  },
  {
    id: 'emergency',
    title: 'Emergency Support',
    description: '24/7 mental health crisis support',
    icon: Phone,
    color: 'error',
    urgent: true,
  },
  {
    id: 'medications',
    title: 'Medications',
    description: 'Manage your prescriptions and reminders',
    icon: Pills,
    color: 'secondary',
    urgent: false,
  },
  {
    id: 'vitals',
    title: 'Vital Signs',
    description: 'Track your heart rate, blood pressure, and more',
    icon: Activity,
    color: 'primary',
    urgent: false,
  },
  {
    id: 'appointments',
    title: 'Appointments',
    description: 'Schedule and manage your medical appointments',
    icon: Calendar,
    color: 'secondary',
    urgent: false,
  },
  {
    id: 'mood',
    title: 'Mood Tracker',
    description: 'Track your daily mood and emotional wellness',
    icon: Smile,
    color: 'success',
    urgent: false,
  },
  {
    id: 'records',
    title: 'Health Records',
    description: 'Access your medical history and reports',
    icon: FileText,
    color: 'neutral',
    urgent: false,
  },
  {
    id: 'wellness',
    title: 'Wellness',
    description: 'Fitness tracking and wellness programs',
    icon: Leaf,
    color: 'success',
    urgent: false,
  },
];
