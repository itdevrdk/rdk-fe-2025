import { Calendar, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import Button from '@/components/buttons/Button';
import NextImage from '@/components/NextImage';
import Typography from '@/components/Typography';

import { KajianEvent } from '@/types/kajian-inspiratif';

interface KajianCardProps {
  event: KajianEvent;
}

export function KajianCard({ event }: KajianCardProps) {
  const router = useRouter();

  const handleRegistration = () => {
    router.push(event.registrationUrl);
  };

  return (
    <div className='relative flex h-full flex-col overflow-hidden rounded-xl bg-[#FFF6DD] shadow-md transition-shadow hover:shadow-lg'>
      {/* Card Content */}
      <div className='relative flex flex-1 gap-4 p-6'>
        {/* Left Content */}
        <div className='relative z-10 flex flex-1 flex-col'>
          <div className='flex-1'>
            <Typography
              variant='title'
              weight='bold'
              font='marquisette'
              className='mb-3 text-[#681819]'
            >
              {event.event}
            </Typography>
            {/* Title */}
            <div
              className='mb-3 text-xl font-bold text-[#681819]'
              dangerouslySetInnerHTML={{ __html: event.title }}
            />

            {/* Speaker Info */}
            <div className='mb-4 space-y-1'>
              <Typography weight='bold' className='text-sm text-gray-900'>
                {event.speaker.name}
              </Typography>
              <div
                className='text-xs text-gray-600 italic'
                dangerouslySetInnerHTML={{ __html: event.speaker.title }}
              />
            </div>

            {/* Event Details */}
            <div className='mb-4 space-y-2'>
              <div className='flex items-start gap-2'>
                <Calendar className='mt-0.5 h-4 w-4 flex-shrink-0 text-[#681819]' />
                <Typography className='text-sm text-gray-700'>
                  {event.date}
                </Typography>
              </div>
              <div className='flex items-start gap-2'>
                <Clock className='mt-0.5 h-4 w-4 flex-shrink-0 text-[#681819]' />
                <Typography className='text-sm text-gray-700'>
                  {event.time}
                </Typography>
              </div>
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0 text-[#681819]' />
                <Typography className='text-sm text-gray-700'>
                  {event.location}
                </Typography>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <Button
              variant='primary'
              size='sm'
              onClick={handleRegistration}
              className='flex-1'
            >
              Daftar Sekarang
            </Button>
          </div>
        </div>

        {/* Right - Speaker Image (Absolute positioned) */}
        <div className='absolute -bottom-0 right-0 z-0 h-auto w-32 lg:w-56'>
          {event.thumbnailUrl ? (
            <NextImage
              src={event.thumbnailUrl}
              alt={event.speaker.name}
              width={250}
              height={250}
              className='object-cover object-bottom w-full h-auto'
              priority
            />
          ) : (
            <div className='flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400'>
              <div className='h-24 w-24 rounded-full bg-white/30' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
