'use client';

import { ChevronLeft } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EventKey = 'MHQ' | 'MTQ' | 'DAI' | 'KTIQ' | 'POSTER' | 'VIDEOGRAFI';

const EVENT_OPTIONS: { value: EventKey; label: string }[] = [
  { value: 'MHQ', label: 'MHQ (Individu)' },
  { value: 'MTQ', label: 'MTQ (Individu)' },
  { value: 'DAI', label: 'Dai (Individu)' },
  { value: 'KTIQ', label: 'KTIQ (Tim)' },
  { value: 'POSTER', label: 'Poster (Individu)' },
  { value: 'VIDEOGRAFI', label: 'Videografi (Tim)' },
];

export default function RICCheckPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState<EventKey | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement check registration logic
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
          className='absolute top-0 right-0 z-10 right-6 lg:right-32 w-18'
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
                Pendaftaran RIC
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
                {/* Search Input - Email/Name/Phone */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='search'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Email / Nama Lengkap / Nomor HP
                  </label>
                  <input
                    type='text'
                    id='search'
                    name='search'
                    placeholder='Masukkan Email, Nama Lengkap, atau Nomor HP'
                    value={searchQuery}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-300 border-2 border-transparent focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base'
                  />
                  <p className='text-xs text-gray-600'>
                    Masukkan email, nama lengkap, atau nomor HP yang Anda
                    gunakan saat mendaftar
                  </p>
                </div>

                {/* Event Type Dropdown */}
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='eventType'
                    className='text-[#681819] font-bold text-sm md:text-base'
                  >
                    Cabang Lomba
                  </label>
                  <Select
                    value={eventType}
                    onValueChange={(value) => setEventType(value as EventKey)}
                  >
                    <SelectTrigger className='w-full bg-white border-2 border-transparent focus:border-[#681819] text-sm md:text-base'>
                      <SelectValue placeholder='Pilih cabang lomba' />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-gray-600'>
                    Pilih cabang lomba yang Anda ikuti
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={!searchQuery || !eventType}
                  className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors mt-4 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cek Status Pendaftaran
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
