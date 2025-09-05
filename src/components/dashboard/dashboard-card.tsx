'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  urgent?: boolean;
  isDemo?: boolean;
  onClick: () => void;
}

const colorVariants = {
  primary: {
    bg: 'bg-primary-50',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    border: 'border-primary-200',
    hover: 'hover:bg-primary-100',
  },
  secondary: {
    bg: 'bg-secondary-50',
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    border: 'border-secondary-200',
    hover: 'hover:bg-secondary-100',
  },
  success: {
    bg: 'bg-success-50',
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600',
    border: 'border-success-200',
    hover: 'hover:bg-success-100',
  },
  warning: {
    bg: 'bg-warning-50',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    border: 'border-warning-200',
    hover: 'hover:bg-warning-100',
  },
  error: {
    bg: 'bg-error-50',
    iconBg: 'bg-error-100',
    iconColor: 'text-error-600',
    border: 'border-error-200',
    hover: 'hover:bg-error-100',
  },
  neutral: {
    bg: 'bg-neutral-50',
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-600',
    border: 'border-neutral-200',
    hover: 'hover:bg-neutral-100',
  },
};

export default function DashboardCard({
  id,
  title,
  description,
  icon: Icon,
  color,
  urgent = false,
  isDemo = false,
  onClick,
}: DashboardCardProps) {
  const colorClasses = colorVariants[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'relative cursor-pointer rounded-2xl border-2 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-medium',
        colorClasses.border,
        colorClasses.hover,
        urgent && 'ring-2 ring-error-200 ring-offset-2'
      )}
      onClick={onClick}
    >
      {/* Urgent Badge */}
      {urgent && (
        <div className="absolute -top-2 -right-2 rounded-full bg-error-500 px-2 py-1 text-xs font-medium text-white">
          24/7
        </div>
      )}

      {/* Demo Badge */}
      {isDemo && id !== 'emergency' && (
        <div className="absolute -top-2 -left-2 rounded-full bg-warning-500 px-2 py-1 text-xs font-medium text-white">
          Demo
        </div>
      )}

      {/* Icon */}
      <div className={clsx(
        'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
        colorClasses.iconBg
      )}>
        <Icon className={clsx('h-6 w-6', colorClasses.iconColor)} />
      </div>

      {/* Content */}
      <div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        <div className={clsx(
          'inline-flex items-center text-sm font-medium transition-colors',
          colorClasses.iconColor,
          `hover:${colorClasses.iconColor.replace('600', '700')}`
        )}>
          {urgent ? 'Call Now' : 'Open'}
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={clsx(
        'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-10',
        color === 'primary' && 'bg-primary-500',
        color === 'secondary' && 'bg-secondary-500',
        color === 'success' && 'bg-success-500',
        color === 'warning' && 'bg-warning-500',
        color === 'error' && 'bg-error-500',
        color === 'neutral' && 'bg-neutral-500'
      )} />
    </motion.div>
  );
}
