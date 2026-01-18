'use client';

import { ChevronLeft, ChevronRight, Instagram, X } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';

import { useFinanceReport } from '@/hooks/useFinanceReport';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layouts/Layout';
import NextImageCustom from '@/components/NextImage';
import { showToast, SUCCESS_TOAST, WARNING_TOAST } from '@/components/Toast';
import Typography from '@/components/Typography';

import { useCreateSuggestion } from '@/app/homepage/hook/useCreateSuggestion';

import { CreateSuggestionRequest } from '@/types/entities/suggestion';

const KEGIATAN_ITEMS = [
  {
    title: 'Ramadan Islamic Competition',
    desc: 'Ajang kompetisi bergengsi tingkat Jawa Timur dengan 6 cabang lomba: MHQ, MTQ, KTIQ, Dai, Poster, dan Sinematografi.',
    hasRegister: true,
    link: '/ric',
    image: '/images/homepage/event-carousel/ric.png',
    registrationOpenDate: new Date('2026-01-18'),
  },
  {
    title: 'Ngabuburits #1',
    desc: 'Seni Memantaskan Diri: Mengubah Sudut Pandang Kesendirian Menjadi Ibadah dan Investasi Masa Depan',
    hasRegister: true,
    link: '/ngabuburits-1',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Ngabuburits #2',
    desc: 'Menjaga Iman, Mengasah Akal: Filsafat Etika Mahasiswa di Era Digital',
    hasRegister: true,
    link: '/ngabuburits-2',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Ngabuburits #3',
    desc: "Al-Qur'an sebagai Pedoman Peradaban: Menyemai Nilai-Nilai Kehidupan di Bulan Ramadan",
    hasRegister: true,
    link: '/ngabuburits-3',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Ngabuburits #4',
    desc: 'Hadits sebagai Sumber Inspirasi: Cara Menghadapi Tekanan Akademik dan Tantangan di Kampus dengan Keteguhan Hati',
    hasRegister: true,
    link: '/ngabuburits-4',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Simposium Ramadan #1',
    desc: 'Inovasi Pendidikan Tinggi: Antara Citra Global dan Realita Lapangan',
    hasRegister: true,
    link: '/simposium-ramadan-1',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Simposium Ramadan #2',
    desc: 'Mahasiswa, Media, dan Spirit Ramadan: Mencari Jalan Tengah di Era Disrupsi',
    hasRegister: true,
    link: '/simposium-ramadan-2',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'HOMe (Heart Of Muslimah)',
    desc: 'Muslimah di Dunia Akademik: Antara Intelektualitas, Akhlak, dan Kontribusi Sosial',
    hasRegister: true,
    link: '/home-muslimah',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: "Nuzulul Qur'an",
    desc: "Healing di Era Digital: Menjadi Muslim Berkarakter Melalui Cahaya Ketenangan Al-Qur'an",
    hasRegister: true,
    link: '/nuzulul-quran',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Lailatul Hikmah',
    desc: "Meraih Hikmah Lailatul Qadar: Menyelami Samudera Al-Qur'an di Malam Mulia",
    hasRegister: true,
    link: '/lailatul-hikmah',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Ganti Oli & Cek Kendaraan Gratis',
    desc: 'Motor Sehat, Mudik Selamat, Dompet Hemat.',
    hasRegister: false,
    link: '',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
  {
    title: 'Medical Check Up Gratis',
    desc: 'Puasa Kuat, Ibadah Semangat, Badan Sehat.',
    hasRegister: false,
    link: '',
    image: '/images/homepage/coming-soon-placeholder.png',
    registrationOpenDate: null,
  },
];

// Data untuk section Let's Join Us
const JOIN_US_ITEMS = [
  {
    title: 'Open Volunteer Khataman Akbar 📖',
    subheadline: 'Dicari! Orang yang Siap Mengukir Sejarah',
    desc: "Tantangan mengkhatamkan Al-Qur'an bersama ratusan volunteer mulai 1 Ramadan hingga malam Nuzulul Qur'an. Jadilah bagian dari gerakan spiritual terbesar di kampus ini!",
    image: '/images/homepage/coming-soon-placeholder.png',
    link: '/volunteer-khataman',
    registrationOpenDate: null,
  },
  {
    title: 'Open Tenant Iftar Fest🍽️',
    subheadline: 'Lapak Berkah, Cuan Melimpah',
    desc: 'Panggilan untuk UMKM dan Ormawa! Buka stand kuliner di pusat keramaian RDK dengan potensi traffic ribuan pengunjung. Slot sangat terbatas!',
    image: '/images/homepage/coming-soon-placeholder.png',
    link: '/tenant-iftar',
    registrationOpenDate: null,
  },
];

const MOMENT_IMAGES = [
  '/images/homepage/carousel/1.png',
  '/images/homepage/carousel/2.png',
  '/images/homepage/carousel/3.png',
];

// Helper function untuk mengecek apakah pendaftaran sudah dibuka
const isRegistrationOpen = (registrationOpenDate: Date | null): boolean => {
  if (!registrationOpenDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const openDate = new Date(registrationOpenDate);
  openDate.setHours(0, 0, 0, 0);
  return today >= openDate;
};

// Helper function untuk format tanggal
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// ==================== KALENDER RAMADAN CONFIG ====================
// Tanggal 1 Ramadan 1447 H (format: YYYY-MM-DD)
const RAMADAN_START_DATE = new Date('2026-02-18'); // 1 Maret 2026
const TOTAL_DAYS_RAMADAN = 30; // Total hari di bulan Ramadan

// Hitung hari dalam seminggu dari tanggal mulai (0 = Minggu, 1 = Senin, dst)
const RAMADAN_START_DAY = RAMADAN_START_DATE.getDay();

// Tanggal akhir Ramadan
const RAMADAN_END_DATE = new Date(RAMADAN_START_DATE);
RAMADAN_END_DATE.setDate(RAMADAN_END_DATE.getDate() + TOTAL_DAYS_RAMADAN - 1);

// Format data kegiatan: tambahkan kegiatan sesuai tanggal Ramadan
const CALENDAR_EVENTS: {
  [key: number]: { title: string; time?: string; location?: string }[];
} = {
  1: [
    {
      title: 'Pembukaan Ramadan di Kampus',
      time: '16:00 WIB',
      location: 'Masjid Manarul Ilmi',
    },
  ],
  8: [
    { title: 'Ngabuburits #1', time: '15:30 WIB', location: 'Gedung Robotika' },
  ],
  15: [
    { title: 'Simposium Ramadan #1', time: '13:00 WIB', location: 'Aula ITS' },
    { title: 'Ngabuburits #2', time: '15:30 WIB', location: 'Gedung Robotika' },
  ],
  17: [
    {
      title: "Nuzulul Qur'an",
      time: '19:00 WIB',
      location: 'Masjid Manarul Ilmi',
    },
  ],
  22: [
    { title: 'Simposium Ramadan #2', time: '13:00 WIB', location: 'Aula ITS' },
  ],
  25: [
    {
      title: 'Lailatul Hikmah',
      time: '21:00 WIB',
      location: 'Masjid Manarul Ilmi',
    },
  ],
  27: [
    {
      title: 'Malam Lailatul Qadar',
      time: '22:00 WIB',
      location: 'Masjid Manarul Ilmi',
    },
  ],
  29: [
    {
      title: 'Ganti Oli & Medical Check Up',
      time: '08:00 WIB',
      location: 'Parkiran Graha',
    },
  ],
};
// ==================== END KALENDER CONFIG ====================

const today = new Date();

// Tanggal H-7 sebelum Ramadan (kalender sudah bisa dilihat)
const CALENDAR_VISIBLE_DATE = new Date(RAMADAN_START_DATE);
CALENDAR_VISIBLE_DATE.setDate(CALENDAR_VISIBLE_DATE.getDate() - 7);

// Cek apakah kalender sudah bisa ditampilkan (H-7 sebelum Ramadan)
const isCalendarVisible = today >= CALENDAR_VISIBLE_DATE;

// Cek apakah sudah memasuki bulan Ramadan
const isRamadanStarted = today >= RAMADAN_START_DATE;
const isRamadanEnded = today > RAMADAN_END_DATE;
const isRamadanActive = isRamadanStarted && !isRamadanEnded;

// Hitung tanggal Ramadan saat ini (1-30) jika dalam periode Ramadan
const currentRamadanDay = isRamadanActive
  ? Math.floor(
      (today.getTime() - RAMADAN_START_DATE.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1
  : null;

const dates = Array.from({ length: TOTAL_DAYS_RAMADAN }, (_, i) => i + 1);
const eventDates = Object.keys(CALENDAR_EVENTS).map(Number);

// Padding di awal untuk menyesuaikan hari pertama Ramadan
const startPadding: (number | null)[] = Array(RAMADAN_START_DAY).fill(null);
const datesWithPadding = [...startPadding, ...dates];
const totalCells = Math.ceil(datesWithPadding.length / 7) * 7;
const paddedDates: (number | null)[] = [...datesWithPadding];

while (paddedDates.length < totalCells) {
  paddedDates.push(null);
}

function ComingSoonPopup({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = React.useCallback(() => {
    const targetDate = new Date('2026-02-17T17:55:00');
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }, []);

  React.useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  if (!mounted) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='relative mx-4 max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF8ED] via-[#FFE5B8] to-[#E5D7C4] shadow-2xl'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute right-3 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-primary-100 shadow-md transition-all hover:bg-white hover:scale-110'
        >
          <X size={20} />
        </button>

        <div className='relative overflow-hidden px-6 py-10'>
          {/* Stars - Right */}
          <div className='absolute right-8 top-2 w-6 animate-[blink-zero_4s_ease-in-out_infinite,scale-up_5s_ease-in-out_infinite]'>
            <NextImageCustom
              src='/images/countdown/bintang.png'
              alt='Stars decoration right'
              width={100}
              height={80}
              className='h-auto w-full'
            />
          </div>

          {/* Stars - Left */}
          <div className='absolute left-8 top-4 w-6 animate-[blink-zero_3s_ease-in-out_infinite,scale-up_7s_ease-in-out_infinite]'>
            <NextImageCustom
              src='/images/countdown/bintang.png'
              alt='Stars decoration left'
              width={100}
              height={80}
              className='h-auto w-full'
            />
          </div>

          {/* Cloud Left */}
          <div className='absolute left-0 top-0 w-1/3'>
            <NextImageCustom
              src='/images/countdown/awan-kiri.png'
              alt='Cloud decoration left'
              width={200}
              height={100}
              className='h-auto w-full'
            />
          </div>

          {/* Cloud Right */}
          <div className='absolute right-0 top-0 w-1/4'>
            <NextImageCustom
              src='/images/countdown/awan-kanan.png'
              alt='Cloud decoration right'
              width={200}
              height={100}
              className='h-auto w-full'
            />
          </div>

          {/*
          <div className='absolute left-1/2 top-1/2 w-4 -translate-x-[300px] -translate-y-16 animate-[spin_10s_linear_infinite] sm:-translate-x-[120px]'>
            <NextImageCustom
              src='/images/countdown/bunga-kiri.png'
              alt='Decorative flower left'
              width={40}
              height={40}
              className='h-auto w-full'
            />
          </div>

          <div className='absolute right-1/2 top-1/2 w-6 translate-x-[100px] -translate-y-16 animate-[spin_15s_linear_infinite] sm:translate-x-[120px]'>
            <NextImageCustom
              src='/images/countdown/bunga-kanan.png'
              alt='Decorative flower right'
              width={40}
              height={40}
              className='h-auto w-full'
            />
          </div> */}

          {/* Main Content */}
          <div className='relative z-10 flex flex-col items-center pt-8 text-center'>
            {/* Countdown Timer */}
            <div className='relative mb-2 flex items-center justify-center gap-2'>
              <Typography
                as='div'
                variant='h1'
                font='marquisette'
                weight='regular'
                className='flex items-center gap-1 text-[32px] leading-none text-primary-100 sm:text-[48px]'
              >
                {formatTime(timeLeft.days)}
                <span>:</span>
                {formatTime(timeLeft.hours)}
                <span>:</span>
                {formatTime(timeLeft.minutes)}
                <span>:</span>
                {formatTime(timeLeft.seconds)}
              </Typography>
            </div>

            {/* Timer Labels */}
            <div className='mb-4 flex items-center justify-center gap-6 sm:gap-10'>
              <Typography
                as='span'
                variant='body'
                font='zabal'
                weight='regular'
                className='text-xs text-primary-100 sm:text-sm'
              >
                Hari
              </Typography>
              <Typography
                as='span'
                variant='body'
                font='zabal'
                weight='regular'
                className='text-xs text-primary-100 sm:text-sm'
              >
                Jam
              </Typography>
              <Typography
                as='span'
                variant='body'
                font='zabal'
                weight='regular'
                className='text-xs text-primary-100 sm:text-sm'
              >
                Menit
              </Typography>
              <Typography
                as='span'
                variant='body'
                font='zabal'
                weight='regular'
                className='text-xs text-primary-100 sm:text-sm'
              >
                Detik
              </Typography>
            </div>

            {/* Description Text */}
            <Typography
              as='p'
              variant='body'
              font='zabal'
              weight='regular'
              className='mb-4 max-w-xs text-sm text-primary-100 sm:text-base'
            >
              Menghitung mundur menuju momen penuh keberkahan.
            </Typography>

            {/* Instagram Button */}
            <Button
              variant='primary'
              size='sm'
              leftIcon={Instagram}
              className='bg-primary-200 hover:bg-primary-300 active:bg-primary-300 border-primary-300'
              onClick={() =>
                window.open('https://instagram.com/rdk.its', '_blank')
              }
            >
              Kunjungi @rdk.its
            </Button>
          </div>

          {/* Ship Left */}
          <div className='absolute bottom-0 left-0 w-1/4 z-30'>
            <NextImageCustom
              src='/images/countdown/kapal-kiri.png'
              alt='Ship decoration left'
              width={150}
              height={200}
              className='h-auto w-full'
            />
          </div>

          {/* Ship Right */}
          <div className='absolute bottom-0 right-0 w-1/4 z-30'>
            <NextImageCustom
              src='/images/countdown/kapal-kanan.png'
              alt='Ship decoration right'
              width={150}
              height={200}
              className='h-auto w-full'
            />
          </div>

          {/* Desert/Mountain at Bottom */}
          <div className='absolute bottom-0 left-0 right-0 z-0 w-full'>
            <NextImageCustom
              src='/images/countdown/gurun-bawah.png'
              alt='Desert landscape decoration'
              width={600}
              height={150}
              className='h-auto w-full'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeSection() {
  const router = useRouter();
  const [showPopup, setShowPopup] = React.useState(true);
  const [kegiatanSlide, setKegiatanSlide] = React.useState(0);
  const [isAutoPlayKegiatan, setIsAutoPlayKegiatan] = React.useState(true);
  const [visibleItemsKegiatan, setVisibleItemsKegiatan] = React.useState(3);
  const [selectedDate, setSelectedDate] = React.useState<number | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);

  const { getLatestReport } = useFinanceReport();
  const latestReport = getLatestReport();

  // Helper to format currency
  const formatRupiah = (value: bigint | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  // Responsive visible items
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2); // Tablet: 2 cards
      } else {
        setVisibleItems(3); // Desktop: 3 cards
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlide = Math.max(0, MOMENT_IMAGES.length - visibleItems);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  }, [maxSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Slide setiap 4 detik

    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  // Handler untuk klik tombol pendaftaran
  const handleRegisterClick = (
    link: string,
    registrationOpenDate: Date | null,
  ) => {
    if (!isRegistrationOpen(registrationOpenDate)) {
      const openDateText = registrationOpenDate
        ? `Pendaftaran dibuka pada ${formatDate(registrationOpenDate)}`
        : 'Pendaftaran belum dibuka';
      showToast(openDateText, WARNING_TOAST);
      return;
    }
    router.push(link);
  };

  // Responsive visible items
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItemsKegiatan(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setVisibleItemsKegiatan(2); // Tablet: 2 cards
      } else {
        setVisibleItemsKegiatan(3); // Desktop: 3 cards
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlideKegiatan = Math.max(
    0,
    KEGIATAN_ITEMS.length - visibleItemsKegiatan,
  );

  const nextKegiatanSlide = React.useCallback(() => {
    setKegiatanSlide((prev) => (prev >= maxSlideKegiatan ? 0 : prev + 1));
  }, [maxSlideKegiatan]);
  const prevKegiatanSlide = () => {
    setKegiatanSlide((prev) => (prev <= 0 ? maxSlideKegiatan : prev - 1));
  };

  const goToKegiatanSlide = (index: number) => {
    setKegiatanSlide(index);
  };

  // Auto-play carousel
  React.useEffect(() => {
    if (!isAutoPlayKegiatan) return;
    const interval = setInterval(() => {
      nextKegiatanSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlayKegiatan, nextKegiatanSlide]);

  return (
    <Layout withNavbar withFooter>
      {/* Coming Soon Popup */}
      {showPopup && <ComingSoonPopup onClose={() => setShowPopup(false)} />}

      <section className='relative overflow-hidden bg-[#FFE9B5]'>
        <NextImage
          src='/images/homepage/ass1.png'
          alt='Ornament'
          width={100}
          height={100}
          className='absolute left-20 top-0 h-auto w-20 md:w-32'
        />

        <div className='relative mx-auto grid max-w-7xl grid-cols-1 items-center px-12 pt-36 md:grid-cols-2'>
          <div>
            <Typography
              as='h1'
              variant='h1'
              font='marquisette'
              weight='bold'
              className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent text-center md:text-start'
            >
              Ramadan di Kampus 47 ITS
            </Typography>

            <Typography
              as='h2'
              variant='h6'
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

        <div className='relative text-end px-12 xl:px-32'>
          <Typography className='mt-6 font-bold'>
            Menu Sahur dan Berbuka Hari Ini
          </Typography>
          <Typography className='mt-2 bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'>
            Coming Soon
          </Typography>

          <Typography className='mt-6 font-bold'>
            Judul Kajian & Pemateri
          </Typography>
          <Typography className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'>
            Coming Soon
          </Typography>

          <Typography className='mt-6 font-bold'>Event Spesial</Typography>
          <Typography className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'>
            Coming Soon
          </Typography>
        </div>
      </section>

      {/* KEGIATAN SPESIAL */}
      <section
        className='relative bg-[#9E2A2F] py-24'
        id='pendaftaran-kegiatan'
      >
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

          {/* Carousel */}
          <div
            className='mt-16 relative flex flex-col items-center'
            onMouseEnter={() => setIsAutoPlayKegiatan(false)}
            onMouseLeave={() => setIsAutoPlayKegiatan(true)}
          >
            <div className='flex items-center gap-4 w-full'>
              {/* Previous Button */}
              <button
                onClick={prevKegiatanSlide}
                className='flex-shrink-0 bg-white hover:bg-gray-100 text-[#942B2C] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 border-2 border-[#942B2C]'
                aria-label='Previous slide'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>

              {/* Carousel Container */}
              <div className='flex-1 overflow-hidden'>
                <div
                  className='flex transition-transform duration-700 ease-in-out'
                  style={{
                    gap:
                      visibleItemsKegiatan === 1
                        ? '0px'
                        : visibleItemsKegiatan === 2
                          ? '16px'
                          : '24px',
                    transform: `translateX(calc(-${kegiatanSlide} * (100% / ${visibleItemsKegiatan} + ${visibleItemsKegiatan === 1 ? 0 : visibleItemsKegiatan === 2 ? 8 : 8}px)))`,
                  }}
                >
                  {KEGIATAN_ITEMS.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className='rounded-xl bg-[#FFF6DD] p-6 text-center flex-shrink-0 flex flex-col'
                      style={{
                        width:
                          visibleItemsKegiatan === 1
                            ? '100%'
                            : visibleItemsKegiatan === 2
                              ? 'calc((100% - 16px) / 2)'
                              : 'calc((100% - 48px) / 3)',
                      }}
                    >
                      <div className='mb-4 h-36 rounded bg-gray-200 relative overflow-hidden'>
                        <NextImage
                          src={item.image}
                          alt={item.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <Typography weight='bold' className='text-[#942B2C]'>
                          {item.title}
                        </Typography>
                        <Typography className='mt-2 text-sm text-[#942B2C] italic'>
                          {item.desc}
                        </Typography>
                      </div>
                      {item.hasRegister && (
                        <Button
                          variant='primary'
                          size='sm'
                          className='mt-4 bg-[#942B2C] hover:bg-[#7A2324] text-white border-0 w-full text-center justify-center'
                          onClick={() =>
                            handleRegisterClick(
                              item.link,
                              item.registrationOpenDate,
                            )
                          }
                        >
                          Daftar Sekarang
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={nextKegiatanSlide}
                className='flex-shrink-0 bg-white hover:bg-gray-100 text-[#942B2C] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 border-2 border-[#942B2C]'
                aria-label='Next slide'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className='flex justify-center gap-2 mt-8'>
              {Array.from({ length: maxSlideKegiatan + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToKegiatanSlide(index)}
                  className={`transition-all ${
                    index === kegiatanSlide
                      ? 'w-8 h-3 bg-[#FFB121]'
                      : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                  } rounded-full`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lets Join Us! */}
      <section className='relative bg-[#9E2A2F] py-24'>
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
            className='text-start bg-gradient-to-r from-[#FFDD9D] to-[#FFB121] bg-clip-text text-transparent'
          >
            Let's Join Us!
          </Typography>

          <Typography className='mt-2 text-start text-[#FFE9B5]'>
            Ambil peranmu, tebarkan manfaat, dan tumbuh bersama di Ramadan ini.
          </Typography>

          <div className='mt-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {JOIN_US_ITEMS.map((item) => (
              <div
                key={item.title}
                className='rounded-xl bg-[#FFF6DD] p-6 text-center'
              >
                <div className='mb-4 h-36 rounded bg-gray-200 relative overflow-hidden'>
                  <NextImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover'
                  />
                </div>
                <Typography weight='bold' className='text-[#942B2C]'>
                  {item.title}
                </Typography>
                <Typography
                  weight='medium'
                  className='mt-2 text-sm text-[#B94446]'
                >
                  {item.subheadline}
                </Typography>
                <Typography className='mt-2 text-sm text-[#942B2C] italic'>
                  {item.desc}
                </Typography>
                <Button
                  variant='primary'
                  size='sm'
                  className='mt-4 bg-[#942B2C] hover:bg-[#7A2324] text-white border-0 w-full text-center justify-center'
                  onClick={() =>
                    handleRegisterClick(item.link, item.registrationOpenDate)
                  }
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
            {!isCalendarVisible ? (
              /* Coming Soon - Sebelum H-7 Ramadan */
              <div className='flex flex-col items-center justify-center py-16 px-6'>
                <Typography
                  as='h3'
                  variant='h2'
                  font='marquisette'
                  weight='bold'
                  className='text-center bg-gradient-to-r from-[#9E2A2F] to-[#C33A3C] bg-clip-text text-transparent'
                >
                  Coming Soon
                </Typography>
                <Typography className='mt-4 text-center text-gray-600 max-w-md'>
                  Kalender kegiatan akan tersedia pada{' '}
                  <span className='font-semibold'>
                    {CALENDAR_VISIBLE_DATE.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>{' '}
                  (H-7 sebelum Ramadan)
                </Typography>
                <div className='mt-6 flex items-center gap-2 text-[#9E2A2F]'>
                  <div className='h-3 w-3 rounded-full bg-[#9E2A2F] animate-pulse' />
                  <Typography className='text-sm font-medium'>
                    Nantikan rangkaian kegiatan spesial Ramadan!
                  </Typography>
                </div>
              </div>
            ) : (
              /* Kalender aktif saat Ramadan */
              <>
                {/* Header Hari - Desktop */}
                <div className='hidden md:grid grid-cols-7 bg-[#9E2A2F]'>
                  {[
                    'Minggu',
                    'Senin',
                    'Selasa',
                    'Rabu',
                    'Kamis',
                    'Jumat',
                    'Sabtu',
                  ].map((day) => (
                    <div
                      key={day}
                      className='py-3 text-center text-sm font-semibold text-white border-r border-[#B94446] last:border-r-0'
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid Tanggal - Desktop */}
                <div className='hidden md:grid grid-cols-7'>
                  {paddedDates.map((date, idx) => (
                    <div
                      key={idx}
                      onClick={() => date && setSelectedDate(date)}
                      className={`relative h-24 lg:h-32 border-b border-r border-[#E7D2C8] p-2 lg:p-3 last:border-r-0 cursor-pointer transition-colors
                        ${date && selectedDate === date ? 'bg-[#FFF6DD]' : 'hover:bg-gray-50'}`}
                    >
                      {date && (
                        <>
                          <span
                            className={`absolute right-2 top-1 lg:right-3 lg:top-2 flex h-6 w-6 lg:h-7 lg:w-7 items-center justify-center rounded-full text-xs lg:text-sm
                              ${date === currentRamadanDay ? 'bg-red-600 text-white' : selectedDate === date ? 'bg-[#9E2A2F] text-white' : 'text-gray-800'}`}
                          >
                            {date}
                          </span>
                          {eventDates.includes(date) &&
                            CALENDAR_EVENTS[date] && (
                              <div className='mt-8 lg:mt-10 rounded-lg bg-[#EAF6FF] p-2 lg:p-3 text-left text-xs lg:text-sm'>
                                <div className='relative pr-3'>
                                  <span className='font-medium leading-tight line-clamp-2'>
                                    {CALENDAR_EVENTS[date][0].title}
                                  </span>
                                  {CALENDAR_EVENTS[date].length > 1 && (
                                    <span className='text-xs text-gray-500'>
                                      +{CALENDAR_EVENTS[date].length - 1}{' '}
                                      lainnya
                                    </span>
                                  )}
                                  <span className='absolute right-0 top-0 h-2 w-2 rounded-full bg-blue-500' />
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop Event Detail */}
                <div className='hidden md:block border-t border-[#E7D2C8] p-4'>
                  <Typography
                    weight='bold'
                    className='text-sm text-gray-700 mb-3'
                  >
                    {selectedDate
                      ? `Kegiatan Tanggal ${selectedDate} Ramadan:`
                      : 'Kegiatan Hari Ini:'}
                  </Typography>
                  <div className='space-y-2'>
                    {(() => {
                      const dateToShow = selectedDate || currentRamadanDay || 1;
                      const events = CALENDAR_EVENTS[dateToShow];
                      if (!events || events.length === 0) {
                        return (
                          <p className='text-sm text-gray-500 italic'>
                            Tidak ada kegiatan pada tanggal ini.
                          </p>
                        );
                      }
                      return events.map((event, idx) => (
                        <div
                          key={idx}
                          className='flex items-center gap-3 rounded-lg bg-[#EAF6FF] p-3'
                        >
                          <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold'>
                            {dateToShow}
                          </div>
                          <div className='flex-1'>
                            <span className='font-medium text-sm text-gray-800'>
                              {event.title}
                            </span>
                            <p className='text-xs text-gray-500 mt-0.5'>
                              {event.time}{' '}
                              {event.location && `• ${event.location}`}
                            </p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className='mt-3 text-sm text-[#9E2A2F] hover:underline'
                    >
                      ← Kembali ke hari ini
                    </button>
                  )}
                </div>

                {/* Mobile View - List Layout */}
                <div className='md:hidden'>
                  {/* Header Hari - Mobile */}
                  <div className='grid grid-cols-7 bg-[#9E2A2F]'>
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(
                      (day) => (
                        <div
                          key={day}
                          className='py-2 text-center text-xs font-semibold text-white'
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>

                  {/* Compact Calendar Grid for Mobile */}
                  <div className='p-4'>
                    {/* Date Grid */}
                    <div className='grid grid-cols-7 gap-1'>
                      {paddedDates.map((date, idx) => (
                        <div
                          key={idx}
                          onClick={() => date && setSelectedDate(date)}
                          className={`aspect-square flex items-center justify-center rounded-full text-sm relative cursor-pointer transition-colors
                            ${date === currentRamadanDay && selectedDate !== date ? 'bg-red-600 text-white' : ''}
                            ${date && selectedDate === date ? 'bg-[#9E2A2F] text-white' : ''}
                            ${date && eventDates.includes(date) && selectedDate !== date ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                            ${!date ? '' : 'hover:bg-gray-100'}`}
                        >
                          {date && (
                            <>
                              <span>{date}</span>
                              {eventDates.includes(date) &&
                                selectedDate !== date && (
                                  <span className='absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-500' />
                                )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Event List for Mobile */}
                  <div className='border-t border-[#E7D2C8] p-4'>
                    <Typography
                      weight='bold'
                      className='text-sm text-gray-700 mb-3'
                    >
                      {selectedDate
                        ? `Kegiatan Tanggal ${selectedDate} Ramadan:`
                        : 'Kegiatan Hari Ini:'}
                    </Typography>
                    <div className='space-y-2'>
                      {(() => {
                        const dateToShow =
                          selectedDate || currentRamadanDay || 1;
                        const events = CALENDAR_EVENTS[dateToShow];
                        if (!events || events.length === 0) {
                          return (
                            <p className='text-sm text-gray-500 italic'>
                              Tidak ada kegiatan pada tanggal ini.
                            </p>
                          );
                        }
                        return events.map((event, idx) => (
                          <div
                            key={idx}
                            className='flex items-center gap-3 rounded-lg bg-[#EAF6FF] p-3'
                          >
                            <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold'>
                              {dateToShow}
                            </div>
                            <div className='flex-1'>
                              <span className='font-medium text-sm text-gray-800'>
                                {event.title}
                              </span>
                              <p className='text-xs text-gray-500 mt-0.5'>
                                {event.time}{' '}
                                {event.location && `• ${event.location}`}
                              </p>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                    {selectedDate && (
                      <button
                        onClick={() => setSelectedDate(null)}
                        className='mt-3 text-sm text-[#9E2A2F] hover:underline'
                      >
                        ← Kembali ke hari ini
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: Kilas Balik RDK */}
      <section className='relative bg-white py-12 md:py-20'>
        {/* Left Decoration */}
        <NextImage
          src='/images/ric/landing/section-5-left-decoration.png'
          alt='Left Decoration'
          width={500}
          height={500}
          className='absolute -bottom-10 -left-4 lg:-bottom-48 lg:-left-18 z-10 w-32 md:w-96'
        />

        {/* Right Decoration */}
        <NextImage
          src='/images/ric/landing/section-5-right-decoration.png'
          alt='Right Decoration'
          width={200}
          height={200}
          className='absolute bottom-0 right-0 z-5 w-16 md:w-32'
        />

        <Typography
          as='h3'
          variant='h3'
          font='marquisette'
          weight='bold'
          className='bg-gradient-to-r from-[#C33A3C] to-[#5D1C1D] bg-clip-text text-transparent text-center'
        >
          Kilas Balik Ramadan di Kampus
        </Typography>
        <Typography
          as='p'
          variant='body'
          className='text-center text-[#681819] mb-6'
        >
          Perjalanan panjang RDK dari tahun ke tahun.
        </Typography>

        <div
          className='relative flex items-center gap-4 md:gap-8'
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Previous Button */}
          {maxSlide > 0 && (
            <button
              onClick={prevSlide}
              className='flex-shrink-0 bg-white hover:bg-gray-100 text-[#681819] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 border-2 border-[#681819] ml-2'
              aria-label='Previous slide'
            >
              <ChevronLeft className='w-6 h-6 md:w-8 md:h-8' />
            </button>
          )}

          {/* Carousel Images Container */}
          <div className='flex-1 overflow-hidden px-4'>
            <div
              className='flex transition-transform duration-700 ease-in-out'
              style={{
                gap:
                  visibleItems === 1
                    ? '0px'
                    : visibleItems === 2
                      ? '16px'
                      : '24px',
                transform: `translateX(calc(-${currentSlide} * (100% / ${visibleItems} + ${visibleItems === 1 ? 0 : visibleItems === 2 ? 8 : 8}px)))`,
              }}
            >
              {MOMENT_IMAGES.map((src, index) => (
                <div
                  key={index}
                  className='relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg bg-white flex-shrink-0 cursor-pointer group'
                  style={{
                    width:
                      visibleItems === 1
                        ? '100%'
                        : visibleItems === 2
                          ? 'calc((100% - 16px) / 2)'
                          : 'calc((100% - 48px) / 3)',
                  }}
                >
                  <NextImage
                    src={src}
                    alt={`Moment ${index + 1}`}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out'
                  />
                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <Typography
                      as='span'
                      variant='body'
                      weight='medium'
                      className='text-white text-sm md:text-base'
                    >
                      Klik untuk detail
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          {maxSlide > 0 && (
            <button
              onClick={nextSlide}
              className='flex-shrink-0 bg-white hover:bg-gray-100 text-[#681819] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 border-2 border-[#681819] mr-2'
              aria-label='Next slide'
            >
              <ChevronRight className='w-6 h-6 md:w-8 md:h-8' />
            </button>
          )}
        </div>

        {/* Dots Indicator */}
        {maxSlide > 0 && (
          <div className='flex justify-center gap-2 mt-8'>
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-8 h-3 bg-[#681819]'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                } rounded-full`}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        )}
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
              {latestReport ? formatRupiah(latestReport.income) : 'Rp 0'}
            </Typography>
            <Typography className='text-sm text-gray-500'>
              Dana Kebaikan Terkumpul
            </Typography>

            <div className='flex gap-6 justify-center md:justify-end mt-6'>
              <div className='text-center md:text-end'>
                <Typography weight='bold' className='text-[#681819]'>
                  {latestReport
                    ? formatRupiah(
                        Math.max(
                          0,
                          Number(latestReport.target) -
                            Number(latestReport.income),
                        ),
                      )
                    : 'Rp 0'}
                </Typography>
                <Typography className='text-xs text-gray-500'>
                  Kekurangan
                </Typography>
              </div>
              <div className='h-auto w-[1px] bg-gray-300' />
              <div className='text-center md:text-end'>
                <Typography weight='bold' className='text-[#681819]'>
                  {latestReport ? formatRupiah(latestReport.target) : 'Rp 0'}
                </Typography>
                <Typography className='text-xs text-gray-500'>
                  Target Donasi
                </Typography>
              </div>
            </div>

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
      {/* <section className='bg-white py-16 overflow-hidden'>
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
      </section> */}

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
            <Typography className='mt-4 max-w-md md:text-start text-center text-[#681819]'>
              Sampaikan kritik dan saran Anda agar RDK 47 dapat terus berkembang
              dan memberikan pengalaman terbaik bagi seluruh jamaah.
            </Typography>
          </div>

          <SuggestionForm />
        </div>
      </section>
    </Layout>
  );
}

function SuggestionForm() {
  const mutation = useCreateSuggestion();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const suggestion = formData.get('suggestion') as string;

    if (!name || !suggestion) {
      showToast('Mohon lengkapi semua field', WARNING_TOAST);
      return;
    }

    try {
      const data: CreateSuggestionRequest = { name, suggestion };
      await mutation.mutateAsync(data);
      showToast('Terima kasih atas masukan Anda!', SUCCESS_TOAST);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      showToast('Gagal mengirim masukan. Silakan coba lagi.', WARNING_TOAST);
    }
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <input
        name='name'
        placeholder='Nama'
        className='w-full rounded border px-4 py-2'
        required
        disabled={mutation.isPending}
      />
      <textarea
        name='suggestion'
        placeholder='Kritik dan Saran'
        className='w-full rounded border px-4 py-2'
        required
        disabled={mutation.isPending}
      />
      <Button
        type='submit'
        variant='primary'
        className='bg-primary-200 hover:bg-primary-300'
        isLoading={mutation.isPending}
      >
        Kirim
      </Button>
    </form>
  );
}
