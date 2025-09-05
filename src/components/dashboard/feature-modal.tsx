'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Plus, Calendar, Heart, Activity, FileText, Leaf } from 'lucide-react';
import Button from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: string | null;
  isDemo?: boolean;
}

export default function FeatureModal({ isOpen, onClose, featureId, isDemo = false }: FeatureModalProps) {
  const handleEmergencyCall = () => {
    window.open('tel:+2348060270792', '_self');
    toast.success('Calling emergency support...');
  };

  const handleFeatureAction = (action: string) => {
    if (isDemo) {
      toast.success(`Demo: ${action} action simulated`);
    } else {
      toast.success(`${action} feature coming soon!`);
    }
  };

  const getFeatureContent = () => {
    switch (featureId) {
      case 'emergency':
        return {
          title: '🚨 Emergency Support',
          content: (
            <div className="space-y-6">
              <div className="rounded-lg bg-error-50 border border-error-200 p-4">
                <h4 className="font-semibold text-error-900 mb-2">24/7 Crisis Support</h4>
                <p className="text-error-800 text-sm mb-4">
                  If you're experiencing a mental health crisis or emergency, immediate help is available.
                </p>
                <Button
                  onClick={handleEmergencyCall}
                  className="w-full bg-error-500 hover:bg-error-600"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Emergency Support: +234 806 027 0792
                </Button>
              </div>
              
              <div className="space-y-4">
                <h5 className="font-medium text-neutral-900">Crisis Resources</h5>
                <div className="grid gap-3">
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <h6 className="font-medium text-sm">Immediate Crisis</h6>
                    <p className="text-xs text-neutral-600">Call emergency services or our 24/7 helpline</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <h6 className="font-medium text-sm">Mental Health Support</h6>
                    <p className="text-xs text-neutral-600">Professional counseling and guidance</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <h6 className="font-medium text-sm">Peer Support</h6>
                    <p className="text-xs text-neutral-600">Connect with others who understand</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        };

      case 'medications':
        return {
          title: '💊 Medications',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-neutral-900">Your Medications</h4>
                  <Button size="sm" onClick={() => handleFeatureAction('Add Medication')}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
                
                {isDemo ? (
                  <div className="rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
                        💊
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">Demo Medication</h5>
                        <p className="text-xs text-neutral-600">Sample dosage - Demo Mode</p>
                        <p className="text-xs text-neutral-500">Next: Demo timing</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Mark Taken
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
                        💊
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">Vitamin D3</h5>
                        <p className="text-xs text-neutral-600">1000 IU daily</p>
                        <p className="text-xs text-neutral-500">Next: 8:00 AM tomorrow</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Take Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {isDemo && (
                <div className="rounded-lg bg-warning-50 border border-warning-200 p-3">
                  <p className="text-sm text-warning-800">
                    📝 Demo Mode: Real medication data will appear when you sign in
                  </p>
                </div>
              )}
            </div>
          ),
        };

      case 'vitals':
        return {
          title: '💓 Vital Signs',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-neutral-900">Your Health Metrics</h4>
                  <Button size="sm" onClick={() => handleFeatureAction('Record Vitals')}>
                    <Plus className="mr-1 h-4 w-4" />
                    Record
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-neutral-200 p-4 text-center">
                    <Activity className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                    <h5 className="font-medium text-sm">Heart Rate</h5>
                    <div className="text-lg font-bold text-neutral-900">
                      {isDemo ? '--' : '72'} <span className="text-xs font-normal">BPM</span>
                    </div>
                    <div className={`text-xs ${isDemo ? 'text-warning-600' : 'text-success-600'}`}>
                      {isDemo ? 'Demo Mode' : 'Normal'}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-neutral-200 p-4 text-center">
                    <Heart className="h-6 w-6 text-error-500 mx-auto mb-2" />
                    <h5 className="font-medium text-sm">Blood Pressure</h5>
                    <div className="text-lg font-bold text-neutral-900">
                      {isDemo ? '--/--' : '120/80'} <span className="text-xs font-normal">mmHg</span>
                    </div>
                    <div className={`text-xs ${isDemo ? 'text-warning-600' : 'text-success-600'}`}>
                      {isDemo ? 'Demo Mode' : 'Normal'}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-neutral-200 p-4 text-center">
                    <div className="h-6 w-6 text-secondary-500 mx-auto mb-2 flex items-center justify-center">
                      🌡️
                    </div>
                    <h5 className="font-medium text-sm">Temperature</h5>
                    <div className="text-lg font-bold text-neutral-900">
                      {isDemo ? '--' : '98.6'} <span className="text-xs font-normal">°F</span>
                    </div>
                    <div className={`text-xs ${isDemo ? 'text-warning-600' : 'text-success-600'}`}>
                      {isDemo ? 'Demo Mode' : 'Normal'}
                    </div>
                  </div>
                </div>
              </div>
              
              {isDemo && (
                <div className="rounded-lg bg-warning-50 border border-warning-200 p-3">
                  <p className="text-sm text-warning-800">
                    📊 Demo Mode: Real vital signs will be tracked when you sign in
                  </p>
                </div>
              )}
            </div>
          ),
        };

      case 'appointments':
        return {
          title: '📅 Appointments',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-neutral-900">Your Appointments</h4>
                  <Button size="sm" onClick={() => handleFeatureAction('Book Appointment')}>
                    <Calendar className="mr-1 h-4 w-4" />
                    Book
                  </Button>
                </div>
                
                <div className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-neutral-900">
                        {isDemo ? '--' : '15'}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {isDemo ? 'Demo' : 'Dec'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">
                        {isDemo ? 'Demo Doctor' : 'Dr. Smith'}
                      </h5>
                      <p className="text-xs text-neutral-600">
                        {isDemo ? 'Demo Consultation' : 'General Consultation'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {isDemo ? 'Demo Mode' : '2:00 PM'}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      isDemo 
                        ? 'bg-warning-100 text-warning-800' 
                        : 'bg-success-100 text-success-800'
                    }`}>
                      {isDemo ? 'Demo' : 'Confirmed'}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleFeatureAction('Book Appointment')}
                  >
                    <Calendar className="mr-1 h-4 w-4" />
                    Book New
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleEmergencyCall}
                  >
                    <Phone className="mr-1 h-4 w-4" />
                    Call to Schedule
                  </Button>
                </div>
              </div>
              
              {isDemo && (
                <div className="rounded-lg bg-warning-50 border border-warning-200 p-3">
                  <p className="text-sm text-warning-800">
                    📅 Demo Mode: Real appointments will appear when you sign in
                  </p>
                </div>
              )}
            </div>
          ),
        };

      case 'mood':
        return {
          title: '😊 Mood Tracker',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900">How are you feeling today?</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { emoji: '😊', label: 'Excellent', color: 'success' },
                    { emoji: '🙂', label: 'Good', color: 'primary' },
                    { emoji: '😐', label: 'Okay', color: 'warning' },
                    { emoji: '😔', label: 'Low', color: 'error' },
                  ].map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleFeatureAction(`Log ${mood.label} Mood`)}
                      className="rounded-lg border border-neutral-200 p-4 text-center hover:bg-neutral-50 transition-colors"
                    >
                      <div className="text-2xl mb-2">{mood.emoji}</div>
                      <div className="text-sm font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-neutral-900">Recent Moods</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-sm text-neutral-600">Today</span>
                      <span className="text-sm">😊 Excellent</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-sm text-neutral-600">Yesterday</span>
                      <span className="text-sm">🙂 Good</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isDemo && (
                <div className="rounded-lg bg-warning-50 border border-warning-200 p-3">
                  <p className="text-sm text-warning-800">
                    📊 Demo Mode: Real mood data will be saved when you sign in
                  </p>
                </div>
              )}
            </div>
          ),
        };

      case 'records':
        return {
          title: '📋 Health Records',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-neutral-900">Your Health Records</h4>
                  <Button size="sm" onClick={() => handleFeatureAction('Upload Record')}>
                    <Plus className="mr-1 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                
                <div className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">
                        {isDemo ? 'Demo Medical Report' : 'Blood Test Results'}
                      </h5>
                      <p className="text-xs text-neutral-600">
                        {isDemo ? 'Demo Date - Demo Doctor' : 'Dec 10, 2024 - Dr. Johnson'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {isDemo ? 'Demo Mode' : 'Lab Report'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              </div>
              
              {isDemo && (
                <div className="rounded-lg bg-warning-50 border border-warning-200 p-3">
                  <p className="text-sm text-warning-800">
                    📋 Demo Mode: Real health records will appear when you sign in
                  </p>
                </div>
              )}
            </div>
          ),
        };

      case 'wellness':
        return {
          title: '🌿 Wellness',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900">Your Wellness Journey</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-neutral-200 p-4 text-center">
                    <div className="h-8 w-8 text-primary-500 mx-auto mb-2 flex items-center justify-center">
                      🏃
                    </div>
                    <h5 className="font-medium text-sm">Daily Steps</h5>
                    <div className="text-lg font-bold text-neutral-900">8,542</div>
                    <div className="text-xs text-neutral-600">Goal: 10,000</div>
                  </div>
                  
                  <div className="rounded-lg border border-neutral-200 p-4 text-center">
                    <div className="h-8 w-8 text-secondary-500 mx-auto mb-2 flex items-center justify-center">
                      🛏️
                    </div>
                    <h5 className="font-medium text-sm">Sleep</h5>
                    <div className="text-lg font-bold text-neutral-900">7.5 hrs</div>
                    <div className="text-xs text-neutral-600">Goal: 8 hrs</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-neutral-900">Wellness Programs</h5>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-neutral-200 p-3">
                      <h6 className="font-medium text-sm">Mindfulness Meditation</h6>
                      <p className="text-xs text-neutral-600">Daily 10-minute sessions</p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 p-3">
                      <h6 className="font-medium text-sm">Stress Management</h6>
                      <p className="text-xs text-neutral-600">Breathing exercises and techniques</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {isDemo && (
                <div className="rounded-lg bg-warning-50 border border-warning-200 p-3">
                  <p className="text-sm text-warning-800">
                    🌿 Demo Mode: Real wellness data will be tracked when you sign in
                  </p>
                </div>
              )}
            </div>
          ),
        };

      default:
        return {
          title: 'Feature',
          content: <div>Feature content not available</div>,
        };
    }
  };

  const feature = getFeatureContent();

  return (
    <AnimatePresence>
      {isOpen && featureId && (
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
            className="relative w-full max-w-lg max-h-[80vh] rounded-2xl bg-white shadow-large overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <h3 className="text-lg font-semibold text-neutral-900">{feature.title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 max-h-[calc(80vh-80px)]">
              {feature.content}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
