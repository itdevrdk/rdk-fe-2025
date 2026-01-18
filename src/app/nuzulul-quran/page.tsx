'use client';

import {
  Album,
  Calendar,
  Instagram,
  SquareUserRound,
  Youtube,
} from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import { RiTiktokLine } from 'react-icons/ri';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

export default function NuzululQuranPage() {
  const router = useRouter();
  return (
    <Layout withNavbar withFooter>
      {/* HERO SECTION */}
      <section className='relative flex justify-center items-center overflow-hidden bg-[#FFE9B5] pt-16 md:pt-18 pb-8 md:pb-0'>
        {/* Decorative ornaments */}
        <NextImage
          src='/images/nuzulul-quran/top-ornament.png'
          alt='Ornament'
          width={275}
          height={331}
          className='absolute z-10 right-4 md:right-20 top-0'
        />

        <div className='relative mx-auto max-w-7xl px-4 md:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
            {/* LEFT CONTENT */}
            <div className='order-2 lg:order-1 max-w-lg gap-2 flex flex-col md:gap-4'>
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent text-center md:text-start'
              >
                Nuzulul Qur'an
              </Typography>
              <div>
                <Typography
                  as='p'
                  variant='body'
                  font='zabal'
                  weight='regular'
                  className='text-[#681819] text-center md:text-justify text-sm md:text-base leading-relaxed'
                >
                  Peringatan Nuzulul Qur’an merupakan salah satu puncak
                  rangkaian kegiatan Ramadhan di Kampus (RDK) 47 Institut
                  Teknologi Sepuluh Nopember (ITS) yang bertujuan menghidupkan
                  kembali semangat cinta Al-Qur’an di kalangan civitas akademika
                  dan masyarakat umum.
                </Typography>

                <Typography
                  as='p'
                  variant='body'
                  font='zabal'
                  weight='regular'
                  className='mt-4 text-[#681819] text-center md:text-justify text-sm md:text-base leading-relaxed'
                >
                  Kegiatan ini diisi dengan kajian inspiratif yang dapat
                  memperdalam pemahaman terhadap makna turunnya Al-Qur’an,
                  memperkuat iman, serta menumbuhkan kesadaran untuk mengamalkan
                  nilai-nilai ilahiah dalam kehidupan sehari-hari.
                </Typography>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex flex-row gap-4 justify-center items-center'>
                  <Album className='text-[#681819]' />
                  <Typography
                    as='p'
                    variant='body'
                    font='zabal'
                    weight='bold'
                    className='text-[#681819] text-center md:text-justify text-sm md:text-base leading-relaxed'
                  >
                    "Healing di Era Digital : Menjadi Muslim Berkarakter Melalui
                    Cahaya Ketenangan Al-Qur'an"
                  </Typography>
                </div>
                <div className='flex flex-row gap-4 justify-start items-center'>
                  <div className='flex flex-row gap-4 justify-center items-center'>
                    <Calendar className='text-[#681819]' />
                    <Typography
                      as='p'
                      variant='body'
                      font='zabal'
                      weight='bold'
                      className='text-[#681819] text-center md:text-justify text-sm md:text-base leading-relaxed'
                    >
                      Jumat, 6 Maret 2026
                    </Typography>
                  </div>
                  <div className='flex flex-row gap-4 justify-center items-center'>
                    <SquareUserRound className='text-[#681819]' />
                    <Typography
                      as='p'
                      variant='body'
                      font='zabal'
                      weight='bold'
                      className='text-[#681819] text-center md:text-justify text-sm md:text-base leading-relaxed'
                    >
                      Soon
                    </Typography>
                  </div>
                </div>
              </div>

              <div className='flex flex-col lg:flex-row gap-3 z-20'>
                <Button
                  variant='primary'
                  className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-semibold py-3 rounded-lg transition-colors'
                  onClick={() => router.push('/nuzulul-quran/register')}
                >
                  Daftar Sekarang
                </Button>
                <Button
                  variant='primary'
                  className='w-full border-2 bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-300 transition-colors'
                  onClick={() => router.push('/nuzulul-quran/check')}
                >
                  Cek Status Pendaftaran
                </Button>
              </div>
            </div>

            {/* RIGHT POSTER */}
            <div className='order-1 lg:order-2 flex justify-center md:justify-end '>
              <NextImage
                src='/images/nuzulul-quran/coming-soon-placeholder.png'
                alt='Ornament'
                width={477}
                height={462}
                className='w-full'
              />
            </div>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH SECTION */}
      <section className='relative flex flex-row bg-[#FFE9B5] w-full justify-center items-center py-12 md:py-20'>
        <NextImage
          src='/images/nuzulul-quran/star.png'
          alt='Star'
          width={557}
          height={409}
          className='absolute left-0 top-0 z-10 -translate-y-24'
        />
        <div className='relative mx-auto max-w-7xl px-4 md:px-6 z-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
            <iframe
              src='https://maps.google.com/maps?hl=en&q=masjid%20manarul%20ilmi%20its&t=&z=14&ie=UTF8&iwloc=B&output=embed'
              width={320}
              height={400}
              style={{ border: 0 }}
              allowFullScreen={undefined}
              aria-hidden='false'
              tabIndex={0}
              className='rounded max-w-lg w-full'
              title='Masjid Manarul Ilmi ITS'
            />

            <div className='flex flex-col gap-8 md:gap-12 max-w-lg'>
              {/* Location */}
              <div>
                <Typography
                  as='h3'
                  variant='h3'
                  font='marquisette'
                  weight='bold'
                  className='text-[#681819] mb-4'
                >
                  Lokasi
                </Typography>

                <Typography className='text-[#681819] text-sm md:text-base leading-relaxed'>
                  Masjid Manarul Ilmi, Kampus ITS, Jalan Raya ITS Campus,
                  Sukolilo, Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60111
                </Typography>
              </div>

              {/* Contact Person */}
              <div>
                <Typography
                  as='h3'
                  variant='h3'
                  font='marquisette'
                  weight='bold'
                  className='text-[#681819] mb-4'
                >
                  Contact Person
                </Typography>

                <div className='flex items-center gap-3'>
                  <FaWhatsapp className='text-2xl text-[#681819]' />
                  <a
                    href='https://wa.me/6281234567890'
                    className='text-[#681819] font-semibold hover:text-[#C33A3C] transition-colors'
                  >
                    08123456789 (Abc)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section className='relative bg-[#FFE9B5] px-4 md:px-6 py-8 md:py-12 border-t-2 border-[#E7D2C8]'>
        <div className='mx-auto max-w-7xl'>
          <Typography
            as='h3'
            variant='h3'
            font='marquisette'
            weight='bold'
            className='text-center text-[#681819] mb-6'
          >
            Follow Us
          </Typography>

          <div className='flex justify-center gap-6 md:gap-8'>
            <Link
              href='https://instagram.com/rdk.its'
              target='_blank'
              className='text-4xl hover:scale-110 transition-transform'
              title='Instagram'
            >
              <Instagram width={32} height={32} className='text-[#681819]' />
            </Link>
            <Link
              href='https://www.tiktok.com/@rdk.its'
              target='_blank'
              className='text-4xl hover:scale-110 transition-transform'
              title='TikTok'
            >
              <RiTiktokLine width={32} height={32} className='text-[#681819]' />
            </Link>
            <Link
              href='https://www.youtube.com/@MasjidITS'
              target='_blank'
              className='text-4xl hover:scale-110 transition-transform'
              title='YouTube'
            >
              <Youtube width={32} height={32} className='text-[#681819]' />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
