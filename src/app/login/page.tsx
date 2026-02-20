'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import NextImage from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useLoginMutation } from './hook/mutation';

import { LoginRequest } from '@/types/login';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { handleLogin, isPending } = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    const loginData: LoginRequest = {
      email: data.email,
      password: data.password,
    };
    handleLogin(loginData);
  };

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

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Email
              </label>
              <Input
                type='email'
                placeholder='Masukkan email Anda'
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Masukkan password Anda'
                  {...register('password')}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              disabled={isPending}
              className='w-full h-12 rounded-xl
                         bg-[#681819] hover:bg-[#7a1c1d]
                         text-white disabled:opacity-50'
            >
              {isPending ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
