'use client';

import { motion } from 'framer-motion';
import { Heart, Activity } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center"
        >
          <Heart className="h-16 w-16 text-primary-500 heartbeat" />
          <Activity className="absolute inset-0 h-16 w-16 text-secondary-500 ecg-pulse" />
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-gradient-health">GENIBI</h1>
          <p className="text-lg text-neutral-600">NT Healthcare Plus</p>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 text-neutral-600"
        >
          Loading your complete health companion...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="mx-auto h-1 w-64 overflow-hidden rounded-full bg-neutral-200"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              delay: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-full w-1/3 bg-gradient-to-r from-primary-500 to-secondary-500"
          />
        </motion.div>
      </div>
    </div>
  );
}
