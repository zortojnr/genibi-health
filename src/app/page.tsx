'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Activity, Shield, Users, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/ui/loading-screen';
import AuthModal from '@/components/auth/auth-modal';
import Button from '@/components/ui/button';

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleQuickStart = () => {
    // Demo mode - redirect to dashboard without authentication
    router.push('/dashboard?demo=true');
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <Heart className="h-10 w-10 text-primary-500 heartbeat" />
                <Activity className="absolute inset-0 h-10 w-10 text-secondary-500 ecg-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-health">GENIBI</h1>
                <p className="text-sm text-neutral-600">NT Healthcare Plus</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button onClick={handleSignup}>
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
                Your Complete{' '}
                <span className="text-gradient-health">Health Companion</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                GENIBI NT Healthcare Plus provides comprehensive mental health support, 
                AI-powered assistance, and 24/7 emergency care for students and healthcare seekers in Nigeria.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                onClick={handleQuickStart}
                className="btn-hover-lift w-full sm:w-auto"
              >
                <Heart className="mr-2 h-5 w-5" />
                Quick Start - Try Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleSignup}
                className="w-full sm:w-auto"
              >
                Create Account
              </Button>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <div className="inline-flex items-center rounded-full bg-error-50 px-4 py-2 text-sm font-medium text-error-700">
                <Phone className="mr-2 h-4 w-4" />
                24/7 Emergency Support: 
                <a 
                  href="tel:+2348060270792" 
                  className="ml-1 font-semibold hover:underline"
                >
                  +234 806 027 0792
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="card-hover rounded-2xl bg-white p-6 shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}

const features = [
  {
    title: 'AI Health Assistant',
    description: 'Get instant health guidance and support from our intelligent AI chatbot.',
    icon: Activity,
  },
  {
    title: 'Mental Health Support',
    description: 'Access professional mental health resources and mood tracking tools.',
    icon: Heart,
  },
  {
    title: 'Secure & Private',
    description: 'Your health data is protected with enterprise-grade security.',
    icon: Shield,
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock emergency support and crisis intervention.',
    icon: Users,
  },
];
