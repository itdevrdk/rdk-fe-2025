'use client';

import { CheckCircle } from 'lucide-react';
import NextImage from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

export default function KhatamanAkbarSuccessPage() {
  return (
    <Layout withNavbar withFooter>
      {/* SUCCESS SECTION */}
      <section className='relative bg-[#FFE9B5] min-h-screen flex flex-col py-12 md:py-20 overflow-hidden'>
        {/* Top Right Decoration - Lamps */}
        <NextImage
          src='/images/nuzulul-quran/success/top-right-decoration-lamp.png'
          alt='Top Right Decoration'
          width={147}
          height={243}
          className='absolute top-0 right-0 z-10 w-20 md:w-32 lg:w-32'
        />

        {/* Bottom Left Stars */}
        <NextImage
          src='/images/nuzulul-quran/success/bottom-left -stars.png'
          alt='Bottom Left Stars'
          width={280}
          height={260}
          className='absolute bottom-0 left-0 z-[5] w-20 md:w-40 opacity-70'
        />

        {/* Bottom Right Stars */}
        <NextImage
          src='/images/nuzulul-quran/success/bottom-right-stars.png'
          alt='Bottom Right Stars'
          width={280}
          height={260}
          className='absolute bottom-0 right-0 z-[5] w-20 md:w-40 opacity-70'
        />

        <div className='relative mx-auto max-w-4xl w-full px-4 md:px-6 z-20 flex flex-col items-center'>
          {/* Title */}
          <Typography
            as='h1'
            variant='h2'
            font='marquisette'
            weight='bold'
            className='text-[#681819] text-3xl md:text-4xl mb-8 md:mb-12 text-center'
          >
            Pendaftaran Berhasil!
          </Typography>

          {/* Success Card */}
          <div className='bg-white rounded-2xl p-8 md:p-12 shadow-lg max-w-4xl w-full mb-12'>
            {/* Success Icon */}
            <div className='flex justify-center mb-6'>
              <CheckCircle className='w-16 h-16 md:w-20 md:h-20 text-green-500' />
            </div>

            {/* Success Message */}
            <Typography
              as='h2'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='text-[#681819] text-2xl md:text-3xl text-center mb-6'
            >
              Terima Kasih Telah Mendaftar Khataman Akbar
            </Typography>

            {/* Description Text */}
            <div className='space-y-4 mb-8'>
              <Typography
                as='p'
                className='text-[#681819] text-center text-sm md:text-base leading-relaxed'
              >
                Pendaftaran Anda telah berhasil tercatat. Semoga Allah
                memudahkan langkah kita dalam mengkhatamkan Al-Qur&apos;an.
              </Typography>

              <Typography
                as='p'
                className='text-[#681819] text-center text-sm md:text-base leading-relaxed'
              >
                Untuk mendapatkan informasi lanjutan, pengumuman resmi, dan
                update kegiatan, peserta wajib bergabung ke grup WhatsApp yang
                telah disediakan.
              </Typography>
            </div>

            {/* WhatsApp Button */}
            <a
              href='https://chat.whatsapp.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2 w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors text-sm md:text-base'
            >
              <FaWhatsapp className='w-5 h-5' />
              Gabung Grup WhatsApp
            </a>
          </div>

          {/* Contact Person Section */}
          <div className='w-full mb-12'>
            <Typography
              as='h3'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='text-[#681819] text-center mb-6 text-xl md:text-2xl'
            >
              Contact Person
            </Typography>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8'>
              <div className='flex items-center gap-3'>
                <FaWhatsapp className='text-2xl text-[#681819]' />
                <a
                  href='https://wa.me/6281234567890'
                  className='text-[#681819] font-semibold hover:text-[#5A1415] transition-colors text-sm md:text-base'
                >
                  08123456789 (Abc)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
