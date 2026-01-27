import Image from 'next/image';
import * as React from 'react';

import Layout from '@/components/layouts/Layout';
import SimpleCarousel from '@/components/SimpleCarousel';

export default function RDK44Page() {
  return (
    <Layout withNavbar withFooter>
      <main className='min-h-screen w-full overflow-x-hidden font-primary'>
        {/* Hero Section */}
        <section className='relative flex min-h-screen w-full flex-col items-center justify-start bg-[#FEF6E0] pt-24 text-center sm:justify-center sm:pt-0'>
          {/* Decorative Corner Images */}
          <div className='absolute top-0 left-0 w-32 sm:w-64'>
            <Image
              src='/images/kilas-balik/section-1-top-left.png'
              alt='Decorative Top Left'
              width={300}
              height={300}
              className='h-auto w-full object-contain'
            />
          </div>
          <div className='absolute top-0 right-0 w-32 sm:w-64'>
            <Image
              src='/images/kilas-balik/section-1-top-right.png'
              alt='Decorative Top Right'
              width={300}
              height={300}
              className='h-auto w-full object-contain'
            />
          </div>
          <div className='absolute -bottom-14 lg:-bottom-28 -left-8 lg:-left-20 w-40 lg:w-80 z-20'>
            <Image
              src='/images/kilas-balik/section-1-bottom-left.png'
              alt='Decorative Bottom Left'
              width={400}
              height={400}
              className='h-auto w-full object-contain'
            />
          </div>
          <div className='absolute right-0 lg:bottom-40 bottom-20 w-24 sm:top-1/2 sm:w-48'>
            <Image
              src='/images/kilas-balik/section-1-bottom-right.png'
              alt='Decorative Bottom Right'
              width={300}
              height={300}
              className='h-auto w-full object-contain'
            />
          </div>

          {/* Content */}
          <div className='z-10 flex flex-col-reverse lg:flex-row justify-between items-center w-full max-w-4xl gap-8 lg:gap-0'>
            <div className='mb-8 flex flex-col items-start gap-8'>
              {/* Text Content */}
              <h1 className='font-heading text-4xl text-primary-100 lg:text-6xl'>
                RDK 44 ITS (2023)
              </h1>
              <p className='text-lg text-left font-medium text-primary-100 lg:text-2xl'>
                Integrasi Iman dan Taqwa, Harmonisasi <br /> Ramadan Penuh Makna
              </p>

              <p className='text-base font-semibold text-primary-100 lg:text-xl'>
                Ketua: Mochammad Ahzaa Safaraz Purnama
              </p>
            </div>
            {/* Logo */}
            <div className='w-32 flex-shrink-0 lg:w-64'>
              <Image
                src='/images/kilas-balik/rdk-44/logo.png'
                alt='Logo RDK 44'
                width={200}
                height={200}
                className='h-auto w-full object-contain'
              />
            </div>
          </div>
        </section>

        {/* Ramadan dalam Angka Section */}
        <section className='relative w-full bg-primary-200 py-16 text-white'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='mb-2 font-heading text-3xl bg-gradient-to-r from-[#FFDD9D] to-[#FFB121] bg-clip-text text-transparent sm:text-5xl'>
              Ramadan dalam Angka
            </h2>
            <p className='mb-12 text-sm text-white/80 sm:text-base'>
              Setiap angka yang merepresentasikan kebermanfaatan
            </p>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-y-16'>
              {/* Row 1 */}
              <div className='flex flex-col items-center border-white/40 md:border-r'>
                <h3 className='font-heading text-4xl text-white sm:text-4xl lg:text-5xl'>
                  11.075
                </h3>
                <p className='mt-2 font-medium text-white/90 sm:text-lg'>
                  Porsi Buka Puasa
                  <br />
                  Gratis Dibagikan
                </p>
              </div>
              <div className='flex flex-col items-center border-white/40 md:border-r'>
                <h3 className='font-heading text-4xl text-white sm:text-4xl lg:text-5xl'>
                  7.038
                </h3>
                <p className='mt-2 font-medium text-white/90 sm:text-lg'>
                  Porsi Sahur Gratis
                  <br />
                  Dibagikan
                </p>
              </div>
              <div className='flex flex-col items-center'>
                <h3 className='font-heading text-4xl text-white sm:text-4xl lg:text-5xl'>
                  Rp146.164.374
                </h3>
                <p className='mt-2 font-medium text-white/90 sm:text-lg'>
                  Penyaluran
                  <br />
                  Zakat Maal
                </p>
              </div>

              {/* Row 2 */}
              <div className='flex flex-col items-center border-white/40 md:border-r'>
                <h3 className='font-heading text-4xl text-white sm:text-4xl lg:text-5xl'>
                  2.291 Kg
                </h3>
                <p className='mt-2 font-medium text-white/90 sm:text-lg'>
                  Penyaluran Zakat
                  <br />
                  Fitrah
                </p>
              </div>
              <div className='flex flex-col items-center border-white/40 md:border-r'>
                <h3 className='font-heading text-4xl text-white sm:text-4xl lg:text-5xl'>
                  63 Kali
                </h3>
                <p className='mt-2 font-medium text-white/90 sm:text-lg'>
                  Khataman Al-Qur&apos;an
                  <br />
                  (200 Peserta)
                </p>
              </div>
              <div className='flex flex-col items-center'>
                <h3 className='font-heading text-4xl text-white sm:text-4xl lg:text-5xl'>
                  10 Malam
                </h3>
                <p className='mt-2 font-medium text-white/90 sm:text-lg'>
                  I&apos;tikaf (Shalat Malam
                  <br />
                  Berjamaah di 10 Hari Terakhir)
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements for section 2 */}
          <div className='absolute top-0 left-0 w-24 sm:w-48 opacity-50'>
            <Image
              src='/images/kilas-balik/section-2-top-left.png'
              alt='Decorative'
              width={300}
              height={300}
              className='h-auto w-full object-contain'
            />
          </div>
          <div className='absolute bottom-0 right-0 w-24 sm:w-48 opacity-50'>
            <Image
              src='/images/kilas-balik/section-2-bottom-right.png'
              alt='Decorative'
              width={300}
              height={300}
              className='h-auto w-full object-contain'
            />
          </div>
        </section>

        {/* Kegiatan Spesial Section */}
        <section className='relative w-full bg-primary-200 pb-24 pt-16 text-center text-white'>
          <div className='container mx-auto px-4'>
            <h2 className='mb-4 font-heading text-3xl bg-gradient-to-r from-[#FFDD9D] to-[#FFB121] bg-clip-text text-transparent sm:text-5xl'>
              Kegiatan Spesial RDK 44
            </h2>
            <p className='mb-16 text-base text-white/90 sm:text-lg'>
              Momentum kebersamaan dalam setiap kegiatan
            </p>

            {/* Activity Cards */}
            <div className='space-y-12'>
              {/* Card 1 */}
              <div className='group relative mx-auto max-w-4xl overflow-hidden rounded-3xl border-4 border-yellow-200 bg-[#FEF6E0] p-3 transition-transform duration-300 hover:scale-[1.01]'>
                <SimpleCarousel
                  images={[
                    '/images/kilas-balik/rdk-44/slide1-1.png',
                    '/images/kilas-balik/rdk-44/slide1-2.png',
                    '/images/kilas-balik/rdk-44/slide1-3.png',
                    '/images/kilas-balik/rdk-44/slide1-4.png',
                  ]}
                  alt='Dokumentasi Kajian Spesial'
                  autoSlideInterval={3000}
                />
                <div className='mt-4 text-primary-200'>
                  <h3 className='text-xl font-bold sm:text-2xl font-heading'>
                    Kajian Spesial (Unik & Tematik)
                  </h3>
                  <p className='text-sm sm:text-base font-medium'>
                    Mengusung tema-tema unik yang filosofis
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className='group relative mx-auto max-w-4xl overflow-hidden rounded-3xl border-4 border-yellow-200 bg-[#FEF6E0] p-3 transition-transform duration-300 hover:scale-[1.01]'>
                <SimpleCarousel
                  images={[
                    '/images/kilas-balik/rdk-44/slide2-1.png',
                    '/images/kilas-balik/rdk-44/slide2-2.png',
                    '/images/kilas-balik/rdk-44/slide2-3.png',
                  ]}
                  alt='Dokumentasi Miracle of Muslimah'
                  autoSlideInterval={4000}
                />
                <div className='mt-4 text-primary-200'>
                  <h3 className='text-xl font-bold sm:text-2xl font-heading'>
                    Miracle of Muslimah (Empowerment)
                  </h3>
                  <p className='text-sm sm:text-base font-medium'>
                    Fokus pada isu kesehatan mental & fiqih wanita
                  </p>
                </div>
              </div>

              {/* Card 3 - RDK Competition */}
              <div className='group relative mx-auto max-w-4xl overflow-hidden rounded-3xl border-4 border-yellow-200 bg-[#FEF6E0] p-6 text-primary-200 transition-transform duration-300 hover:scale-[1.01]'>
                <h3 className='mb-2 text-2xl font-bold sm:text-3xl font-heading'>
                  RDK Competition (Lomba)
                </h3>
                <p className='mb-6 text-base font-medium'>
                  Kompetisi kreativitas pelajar & mahasiswa
                </p>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                  <div className='rounded-xl bg-white p-4 shadow-sm transition-colors hover:bg-yellow-50'>
                    <p className='mb-1 font-bold text-lg text-primary-200'>
                      Lomba Da&apos;i
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      Tema &quot;Kebangkitan Integritas Moral&quot;
                    </p>
                  </div>
                  <div className='rounded-xl bg-white p-4 shadow-sm transition-colors hover:bg-yellow-50'>
                    <p className='mb-1 font-bold text-lg text-primary-200'>
                      Lomba Poster
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      Tema &quot;Menarik Keberkahan&quot;
                    </p>
                  </div>
                  <div className='rounded-xl bg-white p-4 shadow-sm transition-colors hover:bg-yellow-50'>
                    <p className='mb-1 font-bold text-lg text-primary-200'>
                      Lomba Esai
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      Tema &quot;Integrasi Iman & Taqwa&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className='group relative mx-auto max-w-4xl overflow-hidden rounded-3xl border-4 border-yellow-200 bg-[#FEF6E0] p-3 transition-transform duration-300 hover:scale-[1.01]'>
                <SimpleCarousel
                  images={[
                    '/images/kilas-balik/rdk-44/slide3-1.png',
                    '/images/kilas-balik/rdk-44/slide3-2.png',
                  ]}
                  alt='Dokumentasi Momen Spesial'
                  autoSlideInterval={5000}
                />
                <div className='mt-4 text-primary-200 pb-2'>
                  <h3 className='text-xl font-bold sm:text-2xl font-heading'>
                    Momen Spesial
                  </h3>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative section 3 */}
          <div className='absolute bottom-0 right-0 w-24 sm:w-48 opacity-50 transition-opacity hover:opacity-100'>
            <Image
              src='/images/kilas-balik/section-3-bottom-right.png'
              alt='Decorative'
              width={300}
              height={300}
              className='h-auto w-full object-contain'
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}
