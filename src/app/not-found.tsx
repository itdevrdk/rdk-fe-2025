import { Metadata } from 'next';
import * as React from 'react';

import NextImage from '@/components/NextImage';
import Typography from '@/components/Typography';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF4DD] via-[#FFE5B8] to-[#FFDD9D]'>
      {/* Background Stars Pattern - Left */}
      <div className='absolute left-0 top-0 w-1/3 md:w-1/4'>
        <NextImage
          src='/images/404/bintang-kiri.png'
          alt='Stars pattern left'
          width={400}
          height={400}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Background Stars Pattern - Right */}
      <div className='absolute right-0 top-0 w-1/3 md:w-1/4'>
        <NextImage
          src='/images/404/bintang-kanan.png'
          alt='Stars pattern right'
          width={400}
          height={400}
          className='h-auto w-full'
          priority
        />
      </div>

      {/* Main Content */}
      <section className='relative z-10 flex min-h-screen flex-col items-center justify-center'>
        <div className='flex flex-col items-center text-center'>
          {/* 404 Text */}
          <Typography
            as='h1'
            variant='h1'
            font='marquisette'
            weight='regular'
            className='text-[96px] leading-none text-primary-100 sm:text-[100px] md:text-[120px] lg:text-[120px]'
          >
            404
          </Typography>

          {/* Description Text */}
          <Typography
            as='p'
            variant='body'
            font='zabal'
            weight='regular'
            className='mt-4 text-primary-100 text-lg sm:text-xl md:text-xl lg:text-xl xl:mb-20'
          >
            Halaman yang Anda cari <br className='md:hidden' /> tidak ditemukan.
          </Typography>
        </div>
      </section>

      {/* Castle/Fort at Bottom - Fixed width/height aspect ratio for consistency */}
      <div className='absolute bottom-0 left-0 right-0 w-full '>
        <NextImage
          src='/images/404/benteng-bawah.png'
          alt='Castle decoration'
          width={1920}
          height={400}
          className='absolute md:relative bottom-0 left-1/2 -translate-x-1/2 md:left-0 md:-translate-x-0 md:w-full w-[1000px] object-contain md:h-auto'
          priority
        />
      </div>
    </main>
  );
}
