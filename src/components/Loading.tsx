'use client';

import { Loader2 } from 'lucide-react';
import * as React from 'react';

import NextImage from '@/components/NextImage';
import Typography from '@/components/Typography';

export default function LoadingPage() {
  return (
    <main className='relative min-h-screen w-full max-w-[480px] mx-auto shadow-2xl overflow-hidden bg-gradient-to-b from-[#FFF8ED] via-[#FFE5B8] to-[#E5D7C4]'>
      {/* Stars - Right */}
      <div className='absolute right-12 top-2 w-10 animate-[blink-zero_4s_ease-in-out_infinite,scale-up_5s_ease-in-out_infinite]'>
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
      <div className='absolute left-12 top-4 w-10 animate-[blink-zero_3s_ease-in-out_infinite,scale-up_7s_ease-in-out_infinite]'>
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
      <div className='absolute left-0 top-1/2 w-1/3 pt-16'>
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
      <div className='absolute right-0 top-1/2 w-1/3 pt-10'>
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
      <div className='absolute left-0 top-16 w-2/5 sm:top-20'>
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
      <div className='absolute right-0 top-8 w-1/3 sm:top-20'>
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
      <div className='absolute left-1/2 top-1/2 -translate-x-[140px] -translate-y-24 sm:-translate-x-[220px] w-4 animate-[spin_10s_linear_infinite]'>
        <NextImage
          src='/images/countdown/bunga-kiri.png'
          alt='Decorative flower left'
          width={80}
          height={80}
          className='h-auto w-full'
        />
      </div>

      {/* Right Flower */}
      <div className='absolute right-1/2 top-1/2 translate-x-[160px] -translate-y-24 sm:translate-x-[220px] w-8 animate-[spin_15s_linear_infinite]'>
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
        <div className='flex flex-col items-center text-center px-4'>
          {/* Loading Spinner */}
          <div className='mb-6 flex items-center justify-center'>
            <Loader2 className='h-16 w-16 text-primary-100 animate-spin sm:h-20 sm:w-20' />
          </div>

          {/* Loading Text */}
          <Typography
            as='h1'
            variant='h1'
            font='marquisette'
            weight='regular'
            className='mb-4 text-[32px] leading-none text-primary-100 sm:text-[48px]'
          >
            Memuat...
          </Typography>

          {/* Description Text */}
          <Typography
            as='p'
            variant='body'
            font='zabal'
            weight='regular'
            className='max-w-md text-primary-100'
          >
            Mohon tunggu sebentar,
            <br className='block sm:hidden' /> kami sedang menyiapkan halaman
            untuk Anda.
          </Typography>

          {/* Loading Dots Animation */}
          <div className='mt-8 flex items-center justify-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-primary-100 animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-3 w-3 rounded-full bg-primary-100 animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-3 w-3 rounded-full bg-primary-100 animate-bounce'></div>
          </div>
        </div>
      </section>

      {/* Ship Left */}
      <div className='absolute bottom-0 left-0 w-1/3 sm:w-1/4 z-30'>
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
      <div className='absolute bottom-0 right-0 w-1/3 sm:w-1/4 z-30'>
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
