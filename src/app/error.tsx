'use client'; // Error components must be Client Components

import * as React from 'react';

import TextButton from '@/components/buttons/TextButton';
import NextImage from '@/components/NextImage';
import Typography from '@/components/Typography';

export default function Error() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF4DD] via-[#FFE5B8] to-[#FFDD9D]'>
      {/* Background Stars Pattern - Left */}
      <div className='absolute left-0 top-0 w-1/4 md:w-1/6'>
        <NextImage
          src='/images/500/bintang-kiri.png'
          alt='Stars pattern left'
          width={300}
          height={300}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Background Stars Pattern - Right */}
      <div className='absolute right-0 top-0 w-1/4 md:w-1/6'>
        <NextImage
          src='/images/500/bintang-kanan.png'
          alt='Stars pattern right'
          width={300}
          height={300}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Lantern Left */}
      <div className='absolute left-4 top-0 w-20 sm:left-12 sm:w-28 md:left-16 md:w-32 lg:left-24 lg:w-40'>
        <NextImage
          src='/images/500/lampion-kiri.png'
          alt='Lantern decoration left'
          width={200}
          height={300}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Lantern Right */}
      <div className='absolute right-4 top-0 w-20 sm:right-12 sm:w-28 md:right-16 md:w-32 lg:right-24 lg:w-40'>
        <NextImage
          src='/images/500/lampion-kanan.png'
          alt='Lantern decoration right'
          width={200}
          height={300}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Main Content */}
      <section className='relative z-10 flex min-h-screen flex-col items-center justify-center'>
        <div className='flex flex-col items-center text-center'>
          {/* 500 Text */}
          <Typography
            as='h1'
            variant='h1'
            font='marquisette'
            weight='regular'
            className='text-[96px] leading-none text-primary-100 sm:text-[100px] md:text-[120px] lg:text-[120px]'
          >
            500
          </Typography>

          {/* Description Text */}
          <Typography
            as='p'
            variant='body'
            font='zabal'
            weight='regular'
            className='mt-4 max-w-md text-primary-100 sm:mt-6 md:text-lg lg:text-xl'
          >
            Maaf, terjadi kesalahan pada sistem. <br /> Silakan coba beberapa
            saat lagi.
          </Typography>

          {/* Try Again Button */}
          <TextButton
            variant='basic'
            onClick={() => window.location.reload()}
            className='mt-4 sm:mt-6 md:mt-8 text-primary-100'
          >
            Coba Lagi
          </TextButton>
        </div>
      </section>

      {/* Desert/Mountain at Bottom */}
      <div className='absolute bottom-0 left-0 right-0 w-full'>
        <NextImage
          src='/images/500/gurun-bawah.png'
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
