'use client';

import NextImage from 'next/image';
import { useRouter } from 'next/navigation';

import Layout from '@/components/layouts/Layout';
import SimpleCarousel from '@/components/SimpleCarousel';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';

const CAROUSEL_IMAGES = [
  '/images/khatam/carousel/1.jpg',
  '/images/khatam/carousel/2.jpg',
  '/images/khatam/carousel/3.jpg',
  '/images/khatam/carousel/4.png',
  '/images/khatam/carousel/5.jpg',
  '/images/khatam/carousel/6.png',
  '/images/khatam/carousel/7.png',
  '/images/khatam/carousel/8.png',
];

export default function KhatamanAkbarPage() {
  const router = useRouter();
  return (
    <Layout withNavbar withFooter>
      <main className='w-full overflow-x-hidden'>
        {/* ========================= SECTION 1 ========================== */}
        <section className='relative bg-[#FFE3AE] overflow-hidden'>
          {/* ORNAMENTS */}
          <NextImage
            src='/images/khatam/ass2.png'
            alt=''
            width={240}
            height={240}
            className='absolute left-0 top-0 w-32 md:w-48'
          />
          <NextImage
            src='/images/khatam/ass1.png'
            alt=''
            width={240}
            height={240}
            className='absolute right-0 top-0 w-32 md:w-48'
          />
          <NextImage
            src='/images/khatam/ass3.png'
            alt=''
            width={240}
            height={240}
            className='absolute left-0 bottom-0 w-32 md:w-48'
          />
          <NextImage
            src='/images/khatam/ass4.png'
            alt=''
            width={150}
            height={150}
            className='absolute right-0 bottom-0 w-32 md:w-32'
          />

          <div className='relative z-10 mx-auto max-w-7xl px-6 py-20'>
            {/* Banner */}
            <div className='relative mb-12 w-full overflow-hidden rounded-3xl'>
              <SimpleCarousel
                images={CAROUSEL_IMAGES}
                alt='Khataman Akbar Carousel'
                aspectRatio='video'
                className='w-full'
              />
            </div>

            <Typography
              as='h1'
              variant='h2'
              font='marquisette'
              weight='bold'
              className='mb-6 text-center text-[#681819]'
            >
              Khataman Akbar
            </Typography>

            <div className='flex justify-center gap-4'>
              <Button
                className='bg-[#681819] px-8 text-white hover:bg-[#7a1c1d]'
                onClick={() => router.push('/khataman-akbar/register')}
              >
                Daftar Sekarang
              </Button>
              <Button
                variant='outline'
                className='px-8'
                onClick={() =>
                  window.open(
                    'https://www.rdk-its.com/s/GuidebookKhatamanAkbarRDK47ITS',
                    '_blank',
                  )
                }
              >
                Guidebook
              </Button>
            </div>
          </div>
        </section>

        {/* ========================= SECTION 2 ========================== */}
        <section className='relative overflow-hidden bg-gradient-to-br from-[#681819] to-[#C33A3C] text-white'>
          {/* ORNAMENTS */}
          <NextImage
            src='/images/khatam/ass5.png'
            alt=''
            width={260}
            height={260}
            className='absolute bottom-0 left-0 w-40 md:w-56'
          />
          <NextImage
            src='/images/khatam/ass6.png'
            alt=''
            width={260}
            height={260}
            className='absolute bottom-0 right-0 w-40 md:w-56'
          />

          <div className='relative z-10 mx-auto max-w-7xl px-6 py-20 grid gap-10 md:grid-cols-2'>
            <p className='text-sm leading-relaxed md:text-base'>
              Khataman Akbar merupakan kegiatan mengkhatamkan Al-Qur’an yang
              diselenggarakan oleh RDK 47 ITS. Tahun ini, target khataman yang
              ingin dicapai sebanyak 66 kali khataman. Fun fact, angka 66
              disamakan dengan angka perayaan Dies Natalis ITS tahun 2026.
            </p>

            <p className='text-sm leading-relaxed md:text-base'>
              Fun fact lagi, mengkhatamkan Al-Qur’an pada bulan Ramadhan
              merupakan suatu hal yang dikerjakan juga oleh Rasulullah SAW.
              Apabila kita mengerjakan hal tersebut, selain mengikuti
              Rasulullah, kita juga akan mendapatkan beberapa manfaat seperti
              pahala yang berlipat ganda hingga mendapatkan syafaat serta
              perlindungan di hari akhir nanti. Khusus mahasiswa ITS, sertifikat
              volunteer ini juga bisa untuk menambah poin SKEM.
            </p>
          </div>
        </section>

        {/* ========================= SECTION 3 ========================== */}
        <section className='bg-white py-24'>
          <div className='mx-auto max-w-7xl px-6'>
            <Typography
              as='h2'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='mb-16 text-center text-[#681819]'
            >
              Alur Pendaftaran Volunteer RDK 47 ITS
            </Typography>

            <div className='flex flex-col items-center justify-center gap-8 md:flex-row md:gap-4'>
              {[
                {
                  title: 'Kunjungi Website RDK',
                  desc: 'Buka website rdk-its.com',
                },
                {
                  title: 'Masuk ke Pendaftaran',
                  desc: 'Klik Pendaftaran Volunteer',
                },
                {
                  title: 'Klik Daftar Sekarang',
                  desc: 'Ikuti alur pelaksanaan',
                },
                {
                  title: 'Isi Formulir Data Diri',
                  desc: 'Lengkapi data & berkas',
                },
                {
                  title: 'Submit Pendaftaran',
                  desc: 'Klik daftar jika sudah siap',
                },
              ].map((step, i, arr) => (
                <div key={i} className='flex items-center md:flex-row flex-col'>
                  {/* STEP BOX */}
                  <div className='text-center'>
                    <p className='font-semibold text-[#681819]'>{step.title}</p>
                    <div className='mt-2 rounded bg-[#FFB703] px-4 py-2 text-sm'>
                      {step.desc}
                    </div>
                  </div>

                  {/* ARROW */}
                  {i < arr.length - 1 && (
                    <>
                      {/* Desktop arrow */}
                      <svg
                        className='mx-4 hidden h-6 w-6 text-[#681819] md:block'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <path d='M5 12h14M13 5l7 7-7 7' />
                      </svg>

                      {/* Mobile arrow */}
                      <svg
                        className='my-4 h-6 w-6 text-[#681819] md:hidden'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 5v14M5 13l7 7 7-7' />
                      </svg>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= SECTION 4 ========================== */}
        <section className='relative overflow-hidden bg-white'>
          {/* ORNAMENT */}
          <NextImage
            src='/images/khatam/ass7.png'
            alt=''
            width={240}
            height={240}
            className='absolute bottom-0 right-0 w-32 md:w-48'
          />

          <div className='relative z-10 mx-auto max-w-7xl px-6 py-18'>
            <Typography
              as='h2'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='mb-4 text-[#681819]'
            >
              Get In Touch
            </Typography>

            <p className='mb-6 text-sm md:text-base'>
              Kalau masih bingung atau ada kendala saat pendaftaran, jangan
              sungkan buat hubungi kami ya.
            </p>

            <div className='space-y-2 text-sm'>
              <a href='https://wa.me/6282331445057' target='_blank'>
                📞 082331445057 (Evriza)
              </a>
              <a href='https://wa.me/6289606869712' target='_blank'>
                📞 089606869712 (Isma)
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
