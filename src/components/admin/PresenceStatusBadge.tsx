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
  const isPresent = status === 'attend';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all',
        isPresent
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300'
          : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300',
        className,
      )}
    >
      {isPresent ? 'Hadir' : 'Tidak Hadir'}
    </span>
  );
}
