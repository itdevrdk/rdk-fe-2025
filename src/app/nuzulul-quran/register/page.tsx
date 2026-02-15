'use client';

import { ChevronLeft } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useNuzululQuran } from '@/hooks/useNuzululQuran';

import Layout from '@/components/layouts/Layout';
import { DANGER_TOAST, showToast } from '@/components/Toast';
import Typography from '@/components/Typography';

import { NuzululQuranRegistration } from '@/types/nuzulul-quran';

export default function NuzululQuranRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    jenisKelamin: '',
    instansi: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { registerParticipant, loading } = useNuzululQuran();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: NuzululQuranRegistration = {
        nama_lengkap: formData.namaLengkap,
        email: formData.email,
        jenis_kelamin: formData.jenisKelamin as 'Laki-laki' | 'Perempuan',
        instansi: formData.instansi,
      };

      const res = await registerParticipant(payload);

      if (res?.status) {
        // Redirect to success page with code
        router.push(`/nuzulul-quran/register/success?code=${res.data.code}`);
      }
    } catch (error) {
      // Handle error with toast
      const err = error as { response?: { data?: { message?: string } } };
      const msg =
        err?.response?.data?.message || 'Terjadi kesalahan saat mendaftar.';
      showToast(msg, DANGER_TOAST);
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
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 md:px-6 py-8 md:py-16 flex-1 flex items-center z-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full'>
            {/* LEFT SECTION - Mosque Image */}
            <div className='order-1 lg:order-1 flex'>
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='text-[#681819] text-3xl md:text-4xl lg:text-5xl leading-tight'
              >
                RSVP
                <br />
                Nuzulul Qur'an
              </Typography>
            </div>

            {/* RIGHT SECTION - Form and Title */}
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
                {/* Nama Lengkap Input */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='namaLengkap'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type='text'
                    id='namaLengkap'
                    name='namaLengkap'
                    placeholder='Nama Lengkap'
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-300 border-2 border-transparent focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base'
                  />
                </div>

                {/* Email Input */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='email'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    E-Mail
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-300 border-2 border-transparent focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base'
                  />
                </div>

                {/* Jenis Kelamin Select */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='jenisKelamin'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    id='jenisKelamin'
                    name='jenisKelamin'
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-300 border-2 border-transparent focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base'
                  >
                    <option value=''>Pilih Jenis Kelamin</option>
                    <option value='Laki-laki'>Laki-laki</option>
                    <option value='Perempuan'>Perempuan</option>
                  </select>
                </div>

                {/* Asal Instansi/Departemen Input */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='instansi'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Asal Instansi/Departemen
                  </label>
                  <input
                    type='text'
                    id='instansi'
                    name='instansi'
                    placeholder='Contoh: Umum, Engineering, Business'
                    value={formData.instansi}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-300 border-2 border-transparent focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base'
                  />
                  <p className='text-xs text-gray-600'>
                    Untuk jamaah umum, isi dengan "Umum"
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors mt-4 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Memproses...' : 'Daftar Sekarang'}
                </button>
              </form>
            </div>

            {/* RIGHT SECTION - Mosque Image - Hidden on Mobile, Shown on Desktop */}
          </div>
        </div>
      </section>
    </Layout>
  );
}
