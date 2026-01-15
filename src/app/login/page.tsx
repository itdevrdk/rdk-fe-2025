'use client';

import NextImage from 'next/image';

import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  return (
    <main className='min-h-screen grid grid-cols-1 md:grid-cols-2'>
      {/* ================= BRANDING ================= */}
      <section
        className='relative flex items-center justify-center
                   bg-gradient-to-br from-[#681819] to-[#C33A3C]
                   min-h-[25vh] md:h-full py-6 md:py-0 overflow-hidden'
      >
        {/* ORNAMENT TOP LEFT */}
        <NextImage
          src='/images/login/ass1.png'
          alt='Ornament'
          width={120}
          height={120}
          className='absolute left-0 top-0 w-20 md:w-32'
        />

        {/* ORNAMENT BOTTOM RIGHT */}
        <NextImage
          src='/images/login/ass2.png'
          alt='Ornament'
          width={160}
          height={160}
          className='absolute bottom-0 right-0 w-28 md:w-40'
        />

        <div className='relative z-10 text-center text-white px-6'>
          <div className='flex flex-row items-center justify-center mb-4 md:mb-6'>
            <NextImage
              src='/images/footer/logo-rdk47.svg'
              alt='RDK 47'
              width={60}
              height={60}
              className='mr-2 md:mr-4'
            />
            <Typography as='h2' variant='h3' font='marquisette' weight='bold'>
              RDK 47
            </Typography>
          </div>

          <Typography
            as='p'
            variant='body'
            font='zabal'
            weight='regular'
            className='text-sm md:text-base leading-relaxed'
          >
            Bergerak dalam <b>Sinergi</b>, Bertumbuh
            <br />
            dalam <b>Harmoni</b>, Merajut <b>Toleransi</b>
          </Typography>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section className='flex items-start md:items-center justify-start md:justify-center px-6 py-10 md:py-0'>
        <div className='w-full max-w-md'>
          <Typography
            as='h1'
            variant='h2'
            font='marquisette'
            weight='bold'
            className='mb-8 bg-gradient-to-r from-[#681819] to-[#C33A3C]
                       bg-clip-text text-transparent'
          >
            Masuk
          </Typography>

          <form className='space-y-6'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Email
              </label>
              <Input placeholder='Masukkan email Anda' />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Password
              </label>
              <Input type='password' placeholder='Masukkan password Anda' />
            </div>

            <Button
              type='submit'
              className='w-full h-12 rounded-xl
                         bg-[#681819] hover:bg-[#7a1c1d]
                         text-white'
            >
              Selanjutnya
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
