'use client';

import { Mail, MapPin } from 'lucide-react';
import NextImage from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';

export default function SponsorPage() {
  return (
    <Layout withNavbar withFooter>
      <main className='w-full overflow-x-hidden'>
        {/*  HERO  */}
        <section className='relative bg-[#FFE3AE] overflow-hidden pb-[260px] md:pb-0'>
          <NextImage
            src='/images/infaq/ass1.png'
            alt=''
            width={240}
            height={240}
            className='absolute right-0 top-0 w-28 md:w-44'
          />
          <NextImage
            src='/images/sponsor/ass3.png'
            alt=''
            width={400}
            height={400}
            className='hidden md:block md:absolute left-0 bottom-0 md:w-1/2 z-0'
          />
          <NextImage
            src='/images/sponsor/ass2.png'
            alt=''
            width={600}
            height={600}
            className='hidden md:block md:absolute right-0 bottom-0 w-28 md:w-auto'
          />
          <div className='mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-2 items-center max-sm:justify-center z-10 relative'>
            <div>
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='mb-4 bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent md:text-start text-center'
              >
                Informasi Sponsorship
              </Typography>

              <p className='mb-6 text-sm text-[#681819] leading-relaxed md:text-start text-center'>
                Jadilah bagian dari kebaikan Ramadan di Kampus ITS 1447 H.
                Melayani 20.000+ Jamaah, Menggerakkan Ribuan Kebaikan.
              </p>

              <div className='mb-10 flex justify-center md:justify-start'>
                <Button className='bg-[#681819] text-white hover:bg-[#7a1c1d]'>
                  Download Proposal (PDF)
                </Button>
              </div>

              <div className='mt-6 flex flex-col gap-y-10'>
                <div className='flex flex-row'>
                  <div className='relative px-2'>
                    <span className='absolute right-0 top-0 h-full w-px bg-[#C33A3C]' />

                    <Typography
                      font='marquisette'
                      variant='h6'
                      className='bg-gradient-to-r to-[#C33A3C] from-[#681819] bg-clip-text text-transparent'
                    >
                      10.500+
                    </Typography>
                    <p className='mt-2 text-sm font-medium text-[#B23A3A]'>
                      Porsi Berbuka Gratis
                    </p>
                  </div>

                  <div className='px-2'>
                    <Typography
                      font='marquisette'
                      variant='h6'
                      className='bg-gradient-to-r to-[#C33A3C] from-[#681819] bg-clip-text text-transparent'
                    >
                      9.600+
                    </Typography>
                    <p className='mt-2 text-sm font-medium text-[#B23A3A]'>
                      Porsi Sahur Dibagikan.
                    </p>
                  </div>
                </div>
                <div className='flex flex-row'>
                  <div className='relative px-2'>
                    <span className='absolute right-0 top-0 h-full w-px bg-[#C33A3C]' />

                    <Typography
                      font='marquisette'
                      variant='h6'
                      className='bg-gradient-to-r to-[#C33A3C] from-[#681819] bg-clip-text text-transparent'
                    >
                      Rp 187 Juta+
                    </Typography>
                    <p className='mt-2 text-sm font-medium text-[#B23A3A]'>
                      Penyaluran Zakat Maal.
                    </p>
                  </div>
                  <div className='px-2'>
                    <Typography
                      font='marquisette'
                      variant='h6'
                      className='bg-gradient-to-r to-[#C33A3C] from-[#681819] bg-clip-text text-transparent'
                    >
                      73x
                    </Typography>
                    <p className='mt-2 text-sm font-medium text-[#B23A3A]'>
                      Khataman Al-Qur’an.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <NextImage
            src='/images/sponsor/ass2-m.png'
            alt=''
            width={420}
            height={260}
            className='absolute md:hidden bottom-0 left-1/2 -translate-x-1/2 w-full max-w-none pointer-events-none'
          />
        </section>

        {/*  PAKET  */}
        <section className='bg-white py-24'>
          <div className='mx-auto max-w-7xl px-6'>
            <Typography
              as='h2'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='mb-16 text-center text-[#8B1E1E]'
            >
              Paket Kerjasama
            </Typography>

            <div className='grid gap-8 md:grid-cols-2 mb-10'>
              {/* FIRDAUS */}
              <div className='relative overflow-hidden rounded-2xl bg-[#FFF3D4] p-6'>
                <NextImage
                  src='/images/sponsor/ass4.png'
                  alt=''
                  width={250}
                  height={150}
                  className='absolute right-0 bottom-0 opacity-30 pointer-events-none'
                />

                {/* CONTENT */}
                <div className='relative z-10 max-w-[70%]'>
                  <h3 className='font-marquisette text-xl text-[#8B1E1E]'>
                    Paket Firdaus
                  </h3>
                  <p className='mb-4 text-sm text-[#8B1E1E]'>Rp150.000.000</p>

                  <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                    Benefit
                  </p>

                  <div className='flex flex-wrap gap-2'>
                    {[
                      'Logo XL di Semua Media',
                      'Adlibs MC 25x Mention',
                      'Video Profil 3 Menit',
                      'Undangan VIP Halal Bihalal ITS',
                      'Iklan Videotron Gerbang Utama ITS',
                    ].map((b, i) => (
                      <span
                        key={i}
                        className='rounded bg-white px-3 py-1 text-xs text-[#681819]'
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ADN */}
              <div className='relative overflow-hidden rounded-2xl bg-[#FFF3D4] p-6'>
                <NextImage
                  src='/images/sponsor/ass5.png'
                  alt=''
                  width={150}
                  height={100}
                  className='absolute right-0 bottom-0 opacity-30 pointer-events-none'
                />

                <div className='relative z-10 max-w-[70%]'>
                  <h3 className='font-marquisette text-xl text-[#8B1E1E]'>
                    Paket ‘Adn
                  </h3>
                  <p className='mb-4 text-sm text-[#8B1E1E]'>Rp100.000.000</p>

                  <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                    Benefit
                  </p>

                  <div className='flex flex-wrap gap-2'>
                    {[
                      'Logo XL di Semua Media',
                      'Video Profil 3 Menit',
                      'Run Text Live Stream 15 Hari',
                      'Adlibs MC 18x Mention',
                    ].map((b, i) => (
                      <span
                        key={i}
                        className='rounded bg-white px-3 py-1 text-xs text-[#681819]'
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='grid gap-8 md:grid-cols-3'>
              {/* NAIM */}
              <div className='rounded-2xl border border-[#FFD48A] bg-[#FFF9EE] p-6'>
                <h3 className='font-marquisette text-lg text-[#8B1E1E] text-center'>
                  Paket Na’im
                </h3>
                <p className='mb-4 text-sm text-[#8B1E1E] text-center'>
                  Rp50.000.000
                </p>

                <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                  Benefit
                </p>

                <div className='flex flex-wrap gap-2'>
                  {[
                    'Logo L di Semua Media',
                    'Adlibs MC 12x Mention',
                    'Video Profil 2 Menit',
                  ].map((b, i) => (
                    <span
                      key={i}
                      className='rounded bg-[#FFE3AE] px-3 py-1 text-xs text-[#681819]'
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* MAWA */}
              <div className='rounded-2xl border border-[#FFD48A] bg-[#FFF9EE] p-6'>
                <h3 className='font-marquisette text-lg text-center text-[#8B1E1E]'>
                  Paket Ma’wa
                </h3>
                <p className='mb-4 text-sm text-[#8B1E1E] text-center'>
                  Rp25.000.000
                </p>

                <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                  Benefit
                </p>

                <div className='flex flex-wrap gap-2'>
                  {[
                    'Logo M di Semua Media',
                    'Adlibs MC 6x Mention',
                    'Video Profil 1 Menit',
                  ].map((b, i) => (
                    <span
                      key={i}
                      className='rounded bg-[#FFE3AE] px-3 py-1 text-xs text-[#681819]'
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* DARUSSALAM */}
              <div className='rounded-2xl border border-[#FFD48A] bg-[#FFF9EE] p-6'>
                <h3 className='font-marquisette text-lg text-[#8B1E1E] text-center'>
                  Paket Darussalam
                </h3>
                <p className='mb-4 text-sm text-[#8B1E1E] text-center'>
                  Rp10.000.000
                </p>

                <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                  Benefit
                </p>

                <div className='flex flex-wrap gap-2'>
                  {[
                    'Logo S di Semua Media',
                    'Adlibs MC 3x Mention',
                    'Deskripsi Perusahaan (No Video)',
                  ].map((b, i) => (
                    <span
                      key={i}
                      className='rounded bg-[#FFE3AE] px-3 py-1 text-xs text-[#681819]'
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  TOKOH  */}
        <section className='bg-white py-24'>
          <div className='mx-auto max-w-7xl px-6'>
            <Typography
              as='h2'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='mb-12 text-center bg-gradient-to-r from-[#C33A3C] to-[#5D1C1D] bg-clip-text text-transparent'
            >
              Tokoh RDK Sebelumnya
            </Typography>

            <div className='relative'>
              <div className='overflow-visible md:overflow-x-auto scrollbar-hide'>
                <div className='flex flex-col gap-6 md:flex-row md:flex-nowrap'>
                  {TOKOH.map((t, i) => (
                    <div key={i} className='md:shrink-0'>
                      <TokohCard {...t} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  CONTACT  */}
        <section className='bg-white pb-24'>
          <div className='mx-auto max-w-7xl px-6 text-center'>
            <Typography
              as='h2'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='mb-6 bg-gradient-to-r from-[#C33A3C] to-[#5D1C1D] bg-clip-text text-transparent'
            >
              Ingin Berdiskusi Lebih Lanjut?
            </Typography>

            <div className='space-y-2 text-sm'>
              <div className='flex flex-col md:flex-row justify-center gap-4'>
                <Typography variant='label'>
                  <FaWhatsapp className='mr-1 inline w-4 h-4' />
                  +62852-3775-6975 (Viqi)
                </Typography>
                <Typography variant='label'>
                  <Mail className='mr-1 inline w-4 h-4' />
                  rdkitssponsorship@gmail.com
                </Typography>
              </div>
              <Typography variant='label'>
                <MapPin className='mr-1 inline w-4 h-4' /> Sekretariat Masjid
                Manarul Ilmi, Jl. Teknik Mesin No. 173, Kampus ITS Sukolilo
              </Typography>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function TokohCard({
  image,
  name,
  role,
}: {
  image: string;
  name: string;
  role: string;
}) {
  return (
    <div className='relative h-[320px] w-full md:w-[240px] overflow-hidden rounded-2xl'>
      <NextImage src={image} alt={name} fill className='object-cover' />

      <div className='absolute inset-0 bg-gradient-to-t from-[#8B1E1E] via-[#8B1E1E]/10 to-transparent' />

      <div className='absolute bottom-0 z-10 p-4 text-white'>
        <p className='text-sm font-semibold'>{name}</p>
        <p className='text-xs opacity-90'>{role}</p>
      </div>
    </div>
  );
}

const TOKOH = [
  {
    image: '/images/sponsor/mahfud md-174 1.png',
    name: 'Prof. Dr. Mohammad Mahfud MD',
    role: 'Menko Polhukam RI 2019–2024',
  },
  {
    image: '/images/sponsor/Prof.-Muhammad-Nuh-small.png',
    name: 'Prof. Dr. Ir. Mohammad Nuh, DEA',
    role: 'Mendiknas RI 2009–2014',
  },
  {
    image: '/images/sponsor/Dr. Fahruddin Faiz, S.Ag., M.Ag 1.png',
    name: 'Dr. Fahruddin Faiz',
    role: 'Dosen & Filsuf Islam UINSUKA',
  },
  {
    image: '/images/sponsor/Boy_Robyanto-removebg-preview.png',
    name: 'Boy Robyanto, S.E., M.M.',
    role: 'Direktur Investasi PT PELINDO',
  },
  {
    image:
      '/images/sponsor/Prof. Ir. Bambang Pramujati, S.T., M.Sc.Eng., Ph.D.png',
    name: 'Prof. Dr. Bambang Pramujati',
    role: 'Rektor ITS',
  },
  {
    image: '/images/sponsor/Prof. Agus Muhammad Hatta.png',
    name: 'Prof. Agus Muhammad Hatta, S.T., M.Si., Ph.D.',
    role: 'Wakil Rektor IV ITS',
  },
  {
    image: '/images/sponsor/Ustadzah Asmarani Rosalba.png',
    name: 'Ustadzah Asmarani Rosalba',
    role: 'Penulis Buku dan Produser Film',
  },
];
