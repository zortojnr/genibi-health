'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface OfflineData {
  timestamp: number;
  data: any;
  endpoint: string;
  method: string;
}

export class OfflineHandler {
  private static readonly STORAGE_KEY = 'genibi_offline_data';
  private static readonly MAX_OFFLINE_ITEMS = 50;

  static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  static storeOfflineData(endpoint: string, method: string, data: any): void {
    if (typeof window === 'undefined') return;

    const offlineItem: OfflineData = {
      timestamp: Date.now(),
      data,
      endpoint,
      method,
    };

    const existingData = this.getOfflineData();
    const updatedData = [offlineItem, ...existingData.slice(0, this.MAX_OFFLINE_ITEMS - 1)];
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
  }

  static getOfflineData(): OfflineData[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading offline data:', error);
      return [];
    }
  }

  static clearOfflineData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static async syncOfflineData(apiClient: any): Promise<void> {
    const offlineData = this.getOfflineData();
    
    if (offlineData.length === 0) return;

    console.log(`Syncing ${offlineData.length} offline items...`);
    
    const syncPromises = offlineData.map(async (item) => {
      try {
        await apiClient.request({
          url: item.endpoint,
          method: item.method,
          data: item.data,
        });
        return true;
      } catch (error) {
        console.error('Failed to sync offline item:', error);
        return false;
      }
    });

    const results = await Promise.allSettled(syncPromises);
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value
    ).length;

    if (successCount > 0) {
      toast.success(`Synced ${successCount} offline items`);
      this.clearOfflineData();
    }
  }
}

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online && !wasOffline) {
        setWasOffline(true);
        toast.error('You are offline. Data will be saved locally.', {
          duration: 5000,
        });
      } else if (online && wasOffline) {
        setWasOffline(false);
        toast.success('You are back online!');
        // Trigger sync when coming back online
        window.dispatchEvent(new CustomEvent('online-sync'));
      }
    };

    // Set initial status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}

export default OfflineHandler;
