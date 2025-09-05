'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface HealthUpdate {
  type: 'vitals' | 'medication' | 'appointment' | 'mood' | 'emergency';
  data: any;
  timestamp: Date;
}

export function useRealTimeHealth() {
  const [healthUpdates, setHealthUpdates] = useState<HealthUpdate[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const { socket, isConnected, on, off } = useSocket();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user || user.isDemo) {
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus(isConnected ? 'connected' : 'connecting');

    // Set up real-time event listeners
    const handleVitalsUpdate = (data: any) => {
      const update: HealthUpdate = {
        type: 'vitals',
        data,
        timestamp: new Date(),
      };
      setHealthUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
      toast.success('Vital signs updated');
    };

    const handleMedicationReminder = (data: any) => {
      const update: HealthUpdate = {
        type: 'medication',
        data,
        timestamp: new Date(),
      };
      setHealthUpdates(prev => [update, ...prev.slice(0, 9)]);
      toast.success(`Medication reminder: ${data.name}`);
    };

    const handleAppointmentUpdate = (data: any) => {
      const update: HealthUpdate = {
        type: 'appointment',
        data,
        timestamp: new Date(),
      };
      setHealthUpdates(prev => [update, ...prev.slice(0, 9)]);
      toast.success('Appointment updated');
    };

    const handleMoodUpdate = (data: any) => {
      const update: HealthUpdate = {
        type: 'mood',
        data,
        timestamp: new Date(),
      };
      setHealthUpdates(prev => [update, ...prev.slice(0, 9)]);
      toast.success('Mood logged successfully');
    };

    const handleEmergencyAlert = (data: any) => {
      const update: HealthUpdate = {
        type: 'emergency',
        data,
        timestamp: new Date(),
      };
      setHealthUpdates(prev => [update, ...prev.slice(0, 9)]);
      toast.error(`Emergency Alert: ${data.message}`, {
        duration: 10000,
      });
    };

    const handleConnectionStatus = (status: boolean) => {
      setConnectionStatus(status ? 'connected' : 'disconnected');
    };

    // Register event listeners
    if (socket) {
      on('vitals_updated', handleVitalsUpdate);
      on('medication_reminder', handleMedicationReminder);
      on('appointment_updated', handleAppointmentUpdate);
      on('mood_updated', handleMoodUpdate);
      on('emergency_alert', handleEmergencyAlert);
      on('connection_status', handleConnectionStatus);

      // Join user's personal room for targeted updates
      socket.emit('join_user_room', { userId: user.uid });
    }

    // Cleanup function
    return () => {
      if (socket) {
        off('vitals_updated', handleVitalsUpdate);
        off('medication_reminder', handleMedicationReminder);
        off('appointment_updated', handleAppointmentUpdate);
        off('mood_updated', handleMoodUpdate);
        off('emergency_alert', handleEmergencyAlert);
        off('connection_status', handleConnectionStatus);
      }
    };
  }, [socket, isConnected, isAuthenticated, user, on, off]);

  const emitHealthUpdate = (type: string, data: any) => {
    if (socket && isConnected) {
      socket.emit('health_update', { type, data, userId: user?.uid });
    }
  };

  const requestEmergencySupport = (data: any) => {
    if (socket && isConnected) {
      socket.emit('emergency_request', { ...data, userId: user?.uid });
      toast.success('Emergency support requested');
    } else {
      // Fallback to direct call
      window.open('tel:+2348060270792', '_self');
    }
  };

  return {
    healthUpdates,
    connectionStatus,
    emitHealthUpdate,
    requestEmergencySupport,
    isRealTimeEnabled: isConnected && !user?.isDemo,
  };
}
