'use client';

import NextImage from 'next/image';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';
const today = new Date().getDate();
const dates = Array.from({ length: 31 }, (_, i) => i + 1);
const eventDates = [8, 15, 22];
const totalCells = Math.ceil(dates.length / 7) * 7;
const paddedDates: (number | null)[] = [...dates];

while (paddedDates.length < totalCells) {
  paddedDates.push(null);
}

export default function HomeSection() {
  return (
    <Layout withNavbar withFooter>
      <section className='relative overflow-hidden bg-[#FFE9B5]'>
        <NextImage
          src='/images/homepage/ass1.png'
          alt='Ornament'
          width={100}
          height={100}
          className='absolute left-20 top-0 h-auto md:w-32 w-20'
        />

        <div className='relative mx-auto grid max-w-7xl grid-cols-1 items-center px-6 pt-36 md:grid-cols-2'>
          <div>
            <Typography
              as='h1'
              variant='h2'
              font='marquisette'
              weight='bold'
              className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent text-center md:text-start'
            >
              Ramadan di Kampus 47 ITS
            </Typography>

            <Typography
              as='p'
              variant='body'
              font='zabal'
              weight='regular'
              className='mt-4 max-w-md text-primary-100 text-center md:text-start'
            >
              Bergerak dalam Sinergi, Bertumbuh dalam Harmoni, Merajut
              Toleransi.
            </Typography>
          </div>
        </div>

        <NextImage
          src='/images/homepage/ass2.png'
          alt='Masjid Ramadan'
          width={480}
          height={480}
          className='
            relative mt-12 ml-auto w-full max-w-[360px]
            md:absolute md:mt-0 md:bottom-0 md:right-0
            md:w-[400px]
          '
        />
      </section>

      {/* MENU RAMADAN */}
      <section className='relative overflow-hidden bg-[#FFE9B5] py-32'>
        <NextImage
          src='/images/homepage/ass5.png'
          alt='Ship'
          width={600}
          height={600}
          className='absolute left-0 bottom-0'
        />

        <div className='relative text-end px-8'>
          <Typography className='mt-6 font-bold'>Nama Menu</Typography>
          <Typography className='mt-2 bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'>
            Menu Berbuka Hari Ini
          </Typography>

          <Typography className='mt-6 font-bold'>
            Judul Kajian & Pemateri
          </Typography>
          <Typography className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'>
            Kajian Nanti Sore
          </Typography>

          <Typography className='mt-6 font-bold'>Teks singkat</Typography>
          <Typography className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'>
            Informasi Penting
          </Typography>
        </div>
      </section>

      {/* KEGIATAN SPESIAL */}
      <section className='relative bg-[#9E2A2F] py-24'>
        <NextImage
          src='/images/homepage/ass8.png'
          alt='Ornament'
          width={160}
          height={160}
          className='absolute left-0 top-0 h-auto w-40'
        />
        <NextImage
          src='/images/homepage/ass6.png'
          alt='Ornament'
          width={300}
          height={300}
          className='absolute left-0 top-0'
        />
        <NextImage
          src='/images/homepage/ass7.png'
          alt='Ornament'
          width={300}
          height={300}
          className='absolute right-0 bottom-0 z-0'
        />
        <div className='mx-auto max-w-7xl px-6 z-10 relative'>
          <Typography
            as='h2'
            variant='h2'
            font='marquisette'
            weight='bold'
            className='text-end bg-gradient-to-r from-[#FFDD9D] to-[#FFB121] bg-clip-text text-transparent'
          >
            Kegiatan Spesial Ramadan
          </Typography>

          <Typography className='mt-4 text-end text-[#FFE9B5]'>
            Ikuti rangkaian acara penuh manfaat yang menghadirkan pengalaman
            spiritual, edukatif, dan sosial.
          </Typography>

          <div className='mt-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {[
              {
                title: 'Kajian Inspiratif',
                desc: 'Kajian rutin dengan pemateri inspiratif untuk menambah wawasan dan keimanan.',
              },
              {
                title: 'Ramadan Festival',
                desc: 'Festival Ramadan dengan berbagai kegiatan menarik dan kebersamaan.',
              },
              {
                title: 'Lomba RDK',
                desc: 'Kompetisi kreatif untuk menyalurkan bakat dan semangat Ramadan.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className='rounded-xl bg-[#FFF6DD] p-6 text-center'
              >
                <div className='mb-4 h-36 rounded bg-gray-200' />
                <Typography weight='bold' className='text-[#942B2C]'>
                  {item.title}
                </Typography>
                <Typography className='mt-2 text-sm text-[#942B2C]'>
                  {item.desc}
                </Typography>
                <Button
                  variant='primary'
                  size='sm'
                  className='mt-4 bg-[#942B2C] hover:bg-[#7A2324] text-white border-0 w-full text-center justify-center'
                >
                  Daftar Sekarang
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative bg-[#9E2A2F] py-24'>
        <NextImage
          src='/images/homepage/ass9.png'
          alt='Ornament'
          width={400}
          height={400}
          className='absolute right-0 bottom-0 z-0'
        />
        <div className='mx-auto max-w-5xl px-6 z-10 relative'>
          <Typography
            as='h2'
            variant='h2'
            font='marquisette'
            weight='bold'
            className='bg-gradient-to-r from-[#FFDD9D] to-[#FFB121] bg-clip-text text-transparent'
          >
            Kalender Kegiatan Ramadan
          </Typography>

          <Typography className='mt-2 text-[#FFE9B5]'>
            Lihat seluruh rangkaian agenda Ramadan di satu tempat. Klik pada
            tanggal untuk mengetahui detail acara, waktu, hingga lokasi.
          </Typography>

          <div className='mt-10 overflow-hidden rounded-xl border border-[#E7D2C8] bg-white'>
            {/* Grid Tanggal */}
            <div className=' overflow-hidden rounded-xl border border-[#E7D2C8] bg-white'>
              {/* Grid Tanggal */}
              <div className='grid grid-cols-7'>
                {paddedDates.map((date, idx) => (
                  <div
                    key={idx}
                    className='relative h-32 border-b border-r border-[#E7D2C8] p-3 last:border-r-0'
                  >
                    {date && (
                      <>
                        <span
                          className={`absolute right-3 top-2 flex h-7 w-7 items-center justify-center rounded-full text-sm
                ${date === today ? 'bg-red-600 text-white' : 'text-gray-800'}`}
                        >
                          {date}
                        </span>
                        {eventDates.includes(date) && (
                          <div className='mt-10 rounded-xl bg-[#EAF6FF] p-3 text-left text-sm'>
                            <div className='relative pr-4'>
                              <span className='font-medium leading-tight'>
                                Nasib ungkus
                              </span>

                              {/* DOT */}
                              <span className='absolute right-0 top-0 h-2 w-2 rounded-full bg-blue-500' />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* DONASI */}
      <section className='bg-white py-24 relative'>
        <NextImage
          src='/images/homepage/ass4.png'
          alt='Ornament'
          width={120}
          height={120}
          className='absolute right-0 bottom-0'
        />

        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:w-[75%]'>
          {/* KIRI */}
          <div className='text-center md:text-start'>
            <Typography
              as='h3'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='bg-gradient-to-r from-[#C33A3C] to-[#5D1C1D] bg-clip-text text-transparent'
            >
              Amanah dalam Setiap Donasi
            </Typography>
            <Typography className='mt-4 mx-auto md:mx-0 max-w-md text-[#681819]'>
              Setiap kontribusi Anda adalah bagian berharga dalam mendukung
              keberlangsungan kegiatan Ramadan.
            </Typography>
          </div>

          {/* KANAN */}
          <div className='text-center md:text-end'>
            <Typography
              as='h3'
              variant='h2'
              font='zabal'
              weight='bold'
              className='mt-2'
            >
              RpX.000.000
            </Typography>
            <Typography className='text-sm text-gray-500'>
              Dana Kebaikan Terkumpul
            </Typography>

            <div className='mt-6 flex flex-col gap-4 md:flex-row md:justify-end'>
              <Button
                variant='primary'
                className='bg-[#681819] w-full md:w-auto'
              >
                Donasi Sekarang
              </Button>
              <Button variant='outline' className='w-full md:w-auto'>
                Informasi Sponsorship
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSOR */}
      <section className='bg-white py-16 overflow-hidden'>
        <div className='relative w-full overflow-hidden'>
          <div className='marquee-track flex gap-16'>
            {[...Array(12)].flatMap((_, idx) =>
              ['/images/homepage/spon1.png'].map((src, i) => (
                <NextImage
                  key={`${idx}-${src}-${i}`}
                  src={src}
                  alt='Sponsor'
                  width={120}
                  height={60}
                  className='shrink-0'
                />
              )),
            )}
          </div>
        </div>

        <style jsx>{`
          .marquee-track {
            width: max-content;
            animation: marquee 25s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      {/* FEEDBACK */}
      <section className='relative bg-white py-24'>
        <NextImage
          src='/images/homepage/ass3.png'
          alt='Ornament'
          width={240}
          height={240}
          className='absolute right-0 bottom-0 z-0'
        />

        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:w-[75%] z-10 relative'>
          <div>
            <Typography
              as='h2'
              variant='h2'
              font='marquisette'
              weight='bold'
              className='bg-gradient-to-r from-[#C33A3C] to-[#5D1C1D] bg-clip-text text-transparent md:text-start text-center'
            >
              Masukan untuk Kami
            </Typography>
            <Typography className='mt-4 max-w-md md:text-start text-center'>
              Sampaikan kritik dan saran Anda agar RDK 47 dapat terus berkembang
              dan memberikan pengalaman terbaik bagi seluruh jamaah.
            </Typography>
          </div>

          <div className='space-y-4'>
            <input
              placeholder='Nama'
              className='w-full rounded border px-4 py-2'
            />
            <textarea
              placeholder='Kritik dan Saran'
              className='w-full rounded border px-4 py-2'
            />
            <Button
              variant='primary'
              className='bg-primary-200 hover:bg-primary-300'
            >
              Kirim
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
