'use client';

import { ChevronLeft } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useRsvp } from '@/hooks/useRsvp';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

import { GenericRsvpCheckData } from '@/types/rsvp';

export default function Ngabuburits4CheckPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<GenericRsvpCheckData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { checkEventStatus, loading } = useRsvp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setResult(null);
    setNotFound(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setResult(null);
    setNotFound(false);

    try {
      const res = await checkEventStatus('ngabuburits-4', searchQuery);
      if (res.data?.is_registered && res.data.data) {
        setResult(res.data.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    }
  };

  return (
    <Layout withNavbar withFooter>
      {/* RSVP FORM SECTION */}
      <section className='relative bg-[#FFE9B5] min-h-screen flex flex-col overflow-hidden pb-64 md:pb-80 lg:pb-0'>
        {/* Top Right Decoration - Lamps */}
        <NextImage
          src='/images/nuzulul-quran/register/top-right-decoration-lamp.png'
          alt='Top Right Decoration'
          width={147}
          height={243}
          className='absolute top-0 z-10 right-6 lg:right-32 w-18'
        />

        {/* Bottom Left Decoration */}
        <NextImage
          src='/images/nuzulul-quran/register/botom-left-deocartion.png'
          alt='Bottom Left Decoration'
          width={800}
          height={552}
          className='absolute bottom-0 left-0 z-5'
        />

        {/* Bottom Right Stars */}
        <NextImage
          src='/images/nuzulul-quran/register/bottom-right-stars.png'
          alt='Bottom Right Stars'
          width={280}
          height={260}
          className='absolute bottom-0 right-0 z-5'
        />

        {/* Mosque Decoration */}
        <NextImage
          src='/images/nuzulul-quran/register/mosque.png'
          alt='Masjid'
          width={636}
          height={532}
          className='absolute -bottom-32 left-0 z-5'
          priority
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 md:px-6 py-8 md:py-16 flex-1 flex items-center z-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full'>
            {/* LEFT SECTION - Title */}
            <div className='order-1 lg:order-1 flex'>
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='text-[#681819] text-3xl md:text-4xl lg:text-5xl leading-tight'
              >
                Cek Status
                <br />
                Pendaftaran
              </Typography>
            </div>

            {/* RIGHT SECTION - Form */}
            <div className='order-2 lg:order-2 flex flex-col gap-6 md:gap-10'>
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className='flex items-center gap-2 text-[#681819] hover:text-[#681819] transition-colors w-fit'
              >
                <span className='inline-flex items-center justify-center w-8 h-8 border-2 border-[#681819] rounded-md hover:bg-[#681819] hover:text-white transition-all duration-200'>
                  <ChevronLeft width={20} height={20} />
                </span>
                <span className='font-medium'>Kembali</span>
              </button>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-5 w-full'
              >
                {/* Search Input - Email or Name */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='search'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Email atau Nama Lengkap
                  </label>
                  <input
                    type='text'
                    id='search'
                    name='search'
                    placeholder='Masukkan Email atau Nama Lengkap'
                    value={searchQuery}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-300 border-2 border-transparent focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base'
                  />
                  <p className='text-xs text-gray-600'>
                    Masukkan email atau nama lengkap yang Anda gunakan saat
                    mendaftar
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors mt-4 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Memproses...' : 'Cek Status Pendaftaran'}
                </button>
              </form>

              {/* Result Section */}
              {loading && (
                <div className='text-center text-[#681819] font-semibold'>
                  Sedang memeriksa...
                </div>
              )}

              {notFound && !loading && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                  <strong className='font-bold'>Data tidak ditemukan!</strong>
                  <span className='block sm:inline'>
                    {' '}
                    Silakan periksa kembali email atau nama Anda, atau daftar
                    jika belum.
                  </span>
                </div>
              )}

              {result && !loading && (
                <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-[#681819]'>
                  <Typography
                    as='h4'
                    variant='h4'
                    font='marquisette'
                    weight='bold'
                    className='text-[#681819] mb-4'
                  >
                    Status: Terdaftar
                  </Typography>
                  <div className='grid grid-cols-1 gap-2 text-sm md:text-base'>
                    <div className='flex flex-col'>
                      <span className='text-gray-500'>Nama Lengkap</span>
                      <span className='font-semibold text-gray-800'>
                        {result.nama_lengkap}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-gray-500'>Email</span>
                      <span className='font-semibold text-gray-800'>
                        {result.email}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-gray-500'>Tanggal Daftar</span>
                      <span className='font-semibold text-gray-800'>
                        {new Date(result.registered_at).toLocaleDateString(
                          'id-ID',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                    <div className='mt-2'>
                      <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wide'>
                        {result.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SECTION - Mosque Image - Hidden on Mobile, Shown on Desktop */}
          </div>
        </div>
      </section>
    </Layout>
  );
}
