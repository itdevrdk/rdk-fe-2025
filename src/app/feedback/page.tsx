'use client';

import { MessageSquareHeart } from 'lucide-react';
import NextImage from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

import { FeedbackForm } from '@/components/FeedbackForm';
import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

export default function FeedbackPage() {
  return (
    <Layout withNavbar withFooter>
      {/* HERO SECTION */}
      <section className='relative flex items-center justify-center overflow-hidden bg-[#FFE9B5] pb-8 pt-16 md:pb-0 md:pt-18'>
        {/* Decorative ornaments */}
        <NextImage
          src='/images/nuzulul-quran/top-ornament.png'
          alt='Ornament'
          width={275}
          height={331}
          className='absolute right-4 top-0 z-10 md:right-20'
        />

        <div className='relative mx-auto max-w-7xl px-4 md:px-6'>
          <div className='grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2'>
            {/* LEFT CONTENT */}
            <div className='order-2 flex max-w-lg flex-col gap-2 md:gap-4 lg:order-1'>
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-center text-transparent md:text-start'
              >
                Feedback
              </Typography>
              <Typography
                as='p'
                variant='body'
                font='zabal'
                weight='regular'
                className='text-center text-sm leading-relaxed text-[#681819] md:text-justify md:text-base'
              >
                Pendapat Anda sangat berharga bagi kami. Dengan memberikan
                feedback, Anda turut berkontribusi dalam meningkatkan kualitas
                kegiatan dan layanan RDK ITS ke depannya.
              </Typography>

              <Typography
                as='p'
                variant='body'
                font='zabal'
                weight='regular'
                className='mt-2 text-center text-sm leading-relaxed text-[#681819] md:text-justify md:text-base'
              >
                Baik itu saran, kritik, maupun apresiasi — semuanya kami terima
                dengan tangan terbuka. Terima kasih telah menjadi bagian dari
                perjalanan kami!
              </Typography>

              <div className='z-20 mt-4 flex items-center justify-center gap-3 md:justify-start'>
                <MessageSquareHeart className='h-8 w-8 text-[#681819]' />
                <Typography
                  as='p'
                  variant='body'
                  font='zabal'
                  weight='bold'
                  className='text-[#681819]'
                >
                  Suarakan Pendapatmu!
                </Typography>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className='order-1 flex justify-center md:justify-end lg:order-2'>
              <div className='relative flex h-[300px] w-[300px] items-center justify-center rounded-2xl bg-white/30 backdrop-blur-sm md:h-[400px] md:w-[400px]'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <MessageSquareHeart
                    className='h-32 w-32 text-[#681819]/20 md:h-48 md:w-48'
                    strokeWidth={1}
                  />
                </div>
                <NextImage
                  src='/images/nuzulul-quran/star.png'
                  alt='Decorative'
                  width={200}
                  height={200}
                  className='absolute -bottom-10 -left-10 opacity-50'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className='relative w-full bg-[#FFE9B5] py-12 md:py-20'>
        <NextImage
          src='/images/nuzulul-quran/star.png'
          alt='Star'
          width={557}
          height={409}
          className='absolute -left-20 top-0 z-10 -translate-y-24 opacity-30'
        />

        <div className='relative z-20 mx-auto max-w-2xl px-4 md:px-6'>
          <div className='rounded-2xl border-2 border-[#681819]/10 bg-white p-6 shadow-xl md:p-10'>
            <div className='mb-8 text-center'>
              <Typography
                as='h2'
                variant='h3'
                font='marquisette'
                weight='bold'
                className='mb-2 text-[#681819]'
              >
                Kirim Feedback
              </Typography>
              <Typography
                as='p'
                variant='body'
                font='zabal'
                className='text-gray-600'
              >
                Isi formulir di bawah ini untuk memberikan feedback Anda
              </Typography>
            </div>

            <FeedbackForm
              onSuccess={() => {
                // Scroll to top on success
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className='relative flex w-full flex-row items-center justify-center bg-[#FFE9B5] py-12 md:py-20'>
        <div className='relative z-20 mx-auto max-w-7xl px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center gap-8'>
            <div className='text-center'>
              <Typography
                as='h3'
                variant='h3'
                font='marquisette'
                weight='bold'
                className='mb-4 text-[#681819]'
              >
                Ada Pertanyaan?
              </Typography>

              <Typography className='mb-6 text-sm leading-relaxed text-[#681819] md:text-base'>
                Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk
                menghubungi kami melalui WhatsApp.
              </Typography>

              <div className='flex items-center justify-center gap-3'>
                <FaWhatsapp className='text-2xl text-[#681819]' />
                <a
                  href='https://wa.me/6281329693818'
                  className='font-semibold text-[#681819] transition-colors hover:text-[#C33A3C]'
                >
                  081329693818 (Admin RDK ITS)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
