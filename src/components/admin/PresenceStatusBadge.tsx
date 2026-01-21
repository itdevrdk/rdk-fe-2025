import * as React from 'react';

import { cn } from '@/lib/utils';

import { PresenceStatus } from '@/types/entities/presence';

interface PresenceStatusBadgeProps {
  status: PresenceStatus;
  className?: string;
}

export default function PresenceStatusBadge({
  status,
  className,
}: PresenceStatusBadgeProps) {
  // Determine badge styling based on status
  const getBadgeStyle = () => {
    switch (status) {
      case 'attend':
        return {
          gradient: 'bg-gradient-to-r from-green-500 to-green-600',
          shadow:
            'shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300',
          text: 'Hadir',
        };
      case 'permit':
        return {
          gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          shadow:
            'shadow-md shadow-yellow-200 hover:shadow-lg hover:shadow-yellow-300',
          text: 'Izin',
        };
      case 'skip':
      default:
        return {
          gradient: 'bg-gradient-to-r from-red-500 to-red-600',
          shadow:
            'shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300',
          text: 'Tidak Hadir',
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all text-white',
        badgeStyle.gradient,
        badgeStyle.shadow,
        className,
      )}
    >
      {badgeStyle.text}
    </span>
  );
}
