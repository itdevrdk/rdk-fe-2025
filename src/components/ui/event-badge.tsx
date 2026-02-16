import React from 'react';

import { cn } from '@/lib/utils';

import { KajianStatus } from '@/types/kajian-inspiratif';

interface EventBadgeProps {
  status: KajianStatus;
  className?: string;
}

export function EventBadge({ status, className }: EventBadgeProps) {
  const badgeConfig = {
    [KajianStatus.LIVE]: {
      text: 'LIVE',
      className: 'bg-[#C33A3C] text-white',
    },
    [KajianStatus.REPLAY]: {
      text: 'Watch Replay',
      className: 'bg-gray-500 text-white',
    },
    [KajianStatus.UPCOMING]: {
      text: 'Watch Replay',
      className: 'bg-gray-400 text-white',
    },
  };

  const config = badgeConfig[status];

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-semibold',
        config.className,
        className,
      )}
    >
      {config.text}
    </span>
  );
}
