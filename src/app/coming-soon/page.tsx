'use client';

import { Instagram } from 'lucide-react';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import NextImage from '@/components/NextImage';
import Typography from '@/components/Typography';

export default function ComingSoonPage() {
  const calculateTimeLeft = React.useCallback(() => {
    const targetDate = new Date('2026-02-18T17:55:00');
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }, []);

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <main className='relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF8ED] via-[#FFE5B8] to-[#E5D7C4]'>
      {/* Stars - Right */}
      <div className='absolute right-12 top-2 w-10 md:right-56 md:top-8 animate-[blink-zero_4s_ease-in-out_infinite,scale-up_5s_ease-in-out_infinite]'>
        <NextImage
          src='/images/countdown/bintang.png'
          alt='Stars decoration right'
          width={300}
          height={200}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Stars - Left */}
      <div className='absolute left-12 top-4 w-10 md:left-56 md:top-12 animate-[blink-zero_3s_ease-in-out_infinite,scale-up_7s_ease-in-out_infinite]'>
        <NextImage
          src='/images/countdown/bintang.png'
          alt='Stars decoration left'
          width={300}
          height={200}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Background Stars Pattern - Left */}
      <div className='absolute left-0 top-1/2 w-1/3 md:w-1/6 pt-16 md:pt-42 md:top-1/4 lg:pt-10'>
        <NextImage
          src='/images/countdown/bintang-kiri.png'
          alt='Stars pattern left'
          width={300}
          height={200}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Background Stars Pattern - Right */}
      <div className='absolute right-0 top-1/2 w-1/3 md:w-1/6 pt-10 md:pt-32 md:top-1/4 lg:pt-4'>
        <NextImage
          src='/images/countdown/bintang-kanan.png'
          alt='Stars pattern right'
          width={300}
          height={200}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Cloud Left */}
      <div className='absolute left-0 top-16 w-2/5 sm:top-20 md:w-1/3 md:top-8 lg:top-0 lg:w-1/4'>
        <NextImage
          src='/images/countdown/awan-kiri.png'
          alt='Cloud decoration left'
          width={600}
          height={200}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Cloud Right */}
      <div className='absolute right-0 top-8 w-1/3 sm:top-20 md:w-1/3 md:top-0 lg:top-0 lg:w-1/5'>
        <NextImage
          src='/images/countdown/awan-kanan.png'
          alt='Cloud decoration right'
          width={600}
          height={200}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Left Flower */}
      <div className='absolute left-1/2 top-1/2 -translate-x-[140px] -translate-y-24 sm:-translate-x-[220px]  md:-translate-x-[256px] lg:-translate-x-[300px] md:-translate-y-32 w-4 md:w-8 animate-[spin_10s_linear_infinite]'>
        <NextImage
          src='/images/countdown/bunga-kiri.png'
          alt='Decorative flower left'
          width={80}
          height={80}
          className='h-auto w-full'
        />
      </div>

      {/* Right Flower */}
      <div className='absolute right-1/2 top-1/2 translate-x-[160px] -translate-y-24 sm:translate-x-[220px]  md:translate-x-[256px] lg:translate-x-[300px] md:-translate-y-28 w-8 md:w-12 animate-[spin_15s_linear_infinite]'>
        <NextImage
          src='/images/countdown/bunga-kanan.png'
          alt='Decorative flower right'
          width={80}
          height={80}
          className='h-auto w-full'
        />
      </div>

      {/* Main Content */}
      <section className='relative z-10 flex min-h-screen flex-col items-center justify-center'>
        <div className='flex flex-col items-center text-center'>
          {/* Decorative Flowers */}
          <div className='relative mb-4 flex items-center justify-center gap-4 sm:mb-2 sm:gap-8 md:gap-12'>
            {/* Countdown Timer */}
            <Typography
              as='div'
              variant='h1'
              font='marquisette'
              weight='regular'
              className='flex items-center gap-1 text-[48px] leading-none text-primary-100 sm:gap-2 sm:text-[80px] md:text-[80px] lg:text-[100px]'
            >
              {formatTime(timeLeft.days)}
              <span>:</span>
              {formatTime(timeLeft.hours)}
              <span>:</span>
              {formatTime(timeLeft.minutes)}
              <span>:</span>
              {formatTime(timeLeft.seconds)}
            </Typography>
          </div>

          {/* Timer Labels */}
          <div className='mb-6 flex items-center justify-center gap-8 sm:mb-8 sm:gap-16 md:gap-16 lg:gap-20'>
            <Typography
              as='span'
              variant='body'
              font='zabal'
              weight='regular'
              className='text-primary-100  sm:text-base md:text-lg'
            >
              Hari
            </Typography>
            <Typography
              as='span'
              variant='body'
              font='zabal'
              weight='regular'
              className='text-primary-100  sm:text-base md:text-lg'
            >
              Jam
            </Typography>
            <Typography
              as='span'
              variant='body'
              font='zabal'
              weight='regular'
              className='text-primary-100  sm:text-base md:text-lg'
            >
              Menit
            </Typography>
            <Typography
              as='span'
              variant='body'
              font='zabal'
              weight='regular'
              className='text-primary-100  sm:text-base md:text-lg'
            >
              Detik
            </Typography>
          </div>

          {/* Description Text */}
          <Typography
            as='p'
            variant='body'
            font='zabal'
            weight='regular'
            className='mb-6 max-w-xl text-primary-100 sm:mb-8 md:text-lg lg:text-xl'
          >
            Menghitung mundur menuju
            <br className='block sm:hidden' /> momen penuh keberkahan.
          </Typography>

          {/* Instagram Button */}
          <Button
            variant='primary'
            size='base'
            leftIcon={Instagram}
            className='bg-primary-200 hover:bg-primary-300 active:bg-primary-300 border-primary-300'
            onClick={() =>
              window.open('https://instagram.com/rdk.its', '_blank')
            }
          >
            Kunjungi @rdk.its
          </Button>
        </div>
      </section>

      {/* Ship Left */}
      <div className='absolute bottom-0 left-0 w-1/3 sm:w-1/4 md:w-1/5 z-30'>
        <NextImage
          src='/images/countdown/kapal-kiri.png'
          alt='Ship decoration left'
          width={400}
          height={600}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Ship Right */}
      <div className='absolute bottom-0 right-0 w-1/3 sm:w-1/4 md:w-1/5 z-30'>
        <NextImage
          src='/images/countdown/kapal-kanan.png'
          alt='Ship decoration right'
          width={400}
          height={600}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Desert/Mountain at Bottom */}
      <div className='absolute bottom-0 left-0 right-0 z-0 w-full'>
        <NextImage
          src='/images/countdown/gurun-bawah.png'
          alt='Desert landscape decoration'
          width={1920}
          height={400}
          className='h-auto w-full'
          priority
        />
      </div>
    </main>
  );
}
