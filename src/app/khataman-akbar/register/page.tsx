'use client';

import { ChevronLeft } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Layout from '@/components/layouts/Layout';
import { DANGER_TOAST, showToast } from '@/components/Toast';
import Typography from '@/components/Typography';

import { useKhatamanAkbarRegister } from './hook/useKhatamanAkbarRegister';

export default function KhatamanAkbarRegisterPage() {
  const router = useRouter();
  const { isLoading, registerContent } = useKhatamanAkbarRegister();
  const [formData, setFormData] = useState({
    email: '',
    namaLengkap: '',
    status: '',
    whatsapp: '',
    motivasi: '',
    komitmen: '',
    buktiFollow: null as File | null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', DANGER_TOAST);
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({
      ...prev,
      buktiFollow: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerContent(formData);
  };

  return (
    <Layout withNavbar withFooter>
      {/* REGISTER FORM SECTION */}
      <section className='relative bg-[#FFE9B5] min-h-screen flex flex-col overflow-hidden pb-64 md:pb-80 lg:pb-0'>
        {/* Top Right Decoration - Lamps */}
        <NextImage
          src='/images/nuzulul-quran/register/top-right-decoration-lamp.png'
          alt='Top Right Decoration'
          width={147}
          height={243}
          className='absolute top-0 right-6 lg:right-32 z-10 w-18'
        />

        {/* Bottom Right Stars */}
        <NextImage
          src='/images/nuzulul-quran/register/bottom-right-stars.png'
          alt='Bottom Right Stars'
          width={280}
          height={260}
          className='absolute bottom-0 right-0 z-[5]'
        />

        {/* Mosque Decoration */}
        <NextImage
          src='/images/khatam/register/mosque-left-bottom.png'
          alt='Masjid'
          width={636}
          height={532}
          className='absolute bottom-0 -left-10 z-[5]'
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 md:px-6 py-8 md:py-16 flex-1 flex items-center z-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full'>
            {/* LEFT SECTION - Title */}
            <div className='order-2 lg:order-1 flex flex-col justify-start'>
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='text-[#681819] text-3xl md:text-4xl lg:text-5xl leading-tight'
              >
                Khataman
                <br />
                Akbar
              </Typography>
            </div>

            {/* RIGHT SECTION - Form */}
            <div className='order-1 lg:order-2 flex flex-col gap-6 md:gap-8'>
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className='flex items-center gap-2 text-[#681819] hover:text-[#5A1415] transition-colors w-fit'
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
                {/* Email Input */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='email'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Masukkan email Anda'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base disabled:opacity-50'
                  />
                </div>

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
                    placeholder='Masukkan nama lengkap Anda'
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base disabled:opacity-50'
                  />
                </div>

                {/* Status Radio */}
                <div className='flex flex-col gap-2'>
                  <label className='text-[#681819] font-bold text-sm md:text-base'>
                    Status
                  </label>
                  <div className='flex flex-wrap gap-6'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='status'
                        value='Mahasiswa ITS'
                        checked={formData.status === 'Mahasiswa ITS'}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className='w-4 h-4 text-[#681819] border-gray-300 focus:ring-[#681819]'
                      />
                      <span className='text-gray-700 text-sm md:text-base'>
                        Mahasiswa ITS
                      </span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='status'
                        value='Umum'
                        checked={formData.status === 'Umum'}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className='w-4 h-4 text-[#681819] border-gray-300 focus:ring-[#681819]'
                      />
                      <span className='text-gray-700 text-sm md:text-base'>
                        Umum
                      </span>
                    </label>
                  </div>
                </div>

                {/* WhatsApp Number Input */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='whatsapp'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    type='tel'
                    id='whatsapp'
                    name='whatsapp'
                    placeholder='Masukkan nomor whatsapp Anda'
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base disabled:opacity-50'
                  />
                </div>

                {/* Motivasi Textarea */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='motivasi'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Motivasi
                  </label>
                  <textarea
                    id='motivasi'
                    name='motivasi'
                    placeholder='Masukkan motivasi Anda'
                    value={formData.motivasi}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    disabled={isLoading}
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base resize-none disabled:opacity-50'
                  />
                </div>

                {/* Komitmen Radio */}
                <div className='flex flex-col gap-2'>
                  <label className='text-[#681819] font-bold text-sm md:text-base'>
                    Apakah bersedia untuk berkomitmen dalam 1 bulan ramadhan?
                  </label>
                  <div className='flex flex-col md:flex-row flex-wrap gap-3 md:gap-6'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='komitmen'
                        value='Insya Allah bisa'
                        checked={formData.komitmen === 'Insya Allah bisa'}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className='w-4 h-4 text-[#681819] border-gray-300 focus:ring-[#681819]'
                      />
                      <span className='text-gray-700 text-sm md:text-base'>
                        Insya Allah bisa
                      </span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='komitmen'
                        value='Insya Allah diusahakan'
                        checked={formData.komitmen === 'Insya Allah diusahakan'}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className='w-4 h-4 text-[#681819] border-gray-300 focus:ring-[#681819]'
                      />
                      <span className='text-gray-700 text-sm md:text-base'>
                        Insya Allah diusahakan
                      </span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='komitmen'
                        value='Tidak bisa'
                        checked={formData.komitmen === 'Tidak bisa'}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className='w-4 h-4 text-[#681819] border-gray-300 focus:ring-[#681819]'
                      />
                      <span className='text-gray-700 text-sm md:text-base'>
                        Tidak bisa
                      </span>
                    </label>
                  </div>
                </div>

                {/* Bukti Follow Input */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='buktiFollow'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Bukti follow @rdk.its
                  </label>
                  <div className='relative'>
                    <input
                      type='file'
                      id='buktiFollow'
                      name='buktiFollow'
                      accept='image/*'
                      onChange={handleFileChange}
                      required
                      disabled={isLoading}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed'
                    />
                    <div className='w-full px-4 py-3 rounded-lg bg-white text-gray-400 border border-gray-200 text-sm md:text-base'>
                      {formData.buktiFollow
                        ? formData.buktiFollow.name
                        : 'Unggah bukti follow Anda disini'}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors mt-4 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center'
                >
                  {isLoading ? 'Mengirim...' : 'Daftar Sekarang'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
