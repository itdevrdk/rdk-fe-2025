'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layouts/Layout';
import Skeleton from '@/components/Skeleton';
import { showToast, WARNING_TOAST } from '@/components/Toast';
import Typography from '@/components/Typography';

import { useQuota } from './hook/useQuota';

// Tanggal pembukaan pendaftaran RIC (null jika belum ditentukan)
const RIC_REGISTRATION_OPEN_DATE: Date | null = new Date('2026-01-18');

// Helper function untuk mengecek apakah pendaftaran sudah dibuka
const isRegistrationOpen = (): boolean => {
  if (!RIC_REGISTRATION_OPEN_DATE) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const openDate = new Date(RIC_REGISTRATION_OPEN_DATE);
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

const EVENTS = [
  {
    id: 'MHQ',
    title: "Musabaqah Hifdzil Qur'an",
    icon: '/images/ric/landing/logo-mhq.png',
    link: '/ric/register?event=MHQ',
  },
  {
    id: 'MTQ',
    title: "Musabaqah Tilawatil Qur'an",
    icon: '/images/ric/landing/logo-mtq.png',
    link: '/ric/register?event=MTQ',
  },
  {
    id: 'DAI',
    title: 'Dai',
    icon: '/images/ric/landing/logo-dai.png',
    link: '/ric/register?event=DAI',
  },
  {
    id: 'KTIQ',
    title: "Karya Tulis Ilmiah Al-Qur'an",
    icon: '/images/ric/landing/logo-ktiq.png',
    link: '/ric/register?event=KTIQ',
  },
  {
    id: 'POSTER',
    title: 'Poster',
    icon: '/images/ric/landing/logo-poster.png',
    link: '/ric/register?event=POSTER',
  },
  {
    id: 'VIDEOGRAFI',
    title: 'Videografi',
    icon: '/images/ric/landing/logo-videografi.png',
    link: '/ric/register?event=VIDEOGRAFI',
  },
];

// const TIMELINE = [
//   { date: '1 Januari 2026', label: 'Pendaftaran Dibuka' },
//   { date: '1 Januari 2026', label: 'Pelaksanaan' },
//   { date: '1 Januari 2026', label: 'Pengumuman Hasil' },
// ];

const MOMENT_IMAGES = [
  '/images/ric/landing/carousel/1.JPG',
  '/images/ric/landing/carousel/2.JPG',
  '/images/ric/landing/carousel/3.JPG',
  '/images/ric/landing/carousel/4.jpeg',
  '/images/ric/landing/carousel/5.jpeg',
  '/images/ric/landing/carousel/6.jpg',
  '/images/ric/landing/carousel/7.jpg',
  '/images/ric/landing/carousel/8.jpg',
  '/images/ric/landing/carousel/9.jpg',
];

export default function RICLandingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);

  // Fetch quota data from API
  const { getQuotaByEventId, isLoading: isQuotaLoading } = useQuota();

  // Handler untuk klik tombol pendaftaran
  const handleRegisterClick = (link: string) => {
    if (!isRegistrationOpen()) {
      const openDateText = RIC_REGISTRATION_OPEN_DATE
        ? `Pendaftaran dibuka tanggal ${formatDate(RIC_REGISTRATION_OPEN_DATE)}`
        : 'Pendaftaran belum dibuka';
      showToast(openDateText, WARNING_TOAST);
      return;
    }
    router.push(link);
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

  return (
    <Layout withNavbar withFooter>
      {/* Decoration - Bottom Left */}
      <NextImage
        src='/images/ric/landing/section-1-bottom-left.png'
        alt='Decoration'
        width={1574}
        height={1502}
        className='absolute bottom-0 left-0 z-5 w-full max-w-2xl translate-y-[250px] md:translate-y-[320px] lg:translate-y-[320px] translate-x-[-120px]'
      />

      {/* SECTION 1: HERO */}
      <section className='relative bg-gradient-to-b from-[#FFE9B5] to-[#FFD699] min-h-screen flex flex-col justify-center overflow-hidden py-32 lg:py-0'>
        {/* Decoration - Lamps Top Left */}
        <NextImage
          src='/images/ric/landing/section-1-top-left.png'
          alt='Lamps Decoration'
          width={147}
          height={243}
          className='absolute top-0 left-20 z-10 w-32 lg:w-40'
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 z-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center'>
            {/* Left Content */}
            <div className='flex flex-col items-start justify-center'>
              <Typography
                as='h1'
                font='marquisette'
                weight='bold'
                className='text-4xl md:text-5xl lg:text-6xl text-[#681819] mb-6 leading-tight'
              >
                Ramadan Islamic Competition (RIC)
              </Typography>

              <Typography
                as='p'
                className='text-[#681819] text-sm md:text-base leading-relaxed mb-8'
              >
                Ajang kompetisi islami terbesar se-kampus yang menampilkan
                penampilan-penampilan spektakuler dari berbagai cabang lomba
                berkualitas dan kebanggaan serta mengembangkan potensi seni
                dalam diri setiap individu pada bulan Ramadan.
              </Typography>

              <div className='flex flex-col lg:flex-col gap-3 z-20 w-full'>
                <div className='flex flex-col lg:flex-row gap-3 z-20 w-full'>
                  <Button
                    variant='primary'
                    className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-semibold py-3 rounded-lg transition-colors'
                    onClick={() => handleRegisterClick('/ric/register')}
                  >
                    Daftar Sekarang
                  </Button>
                  <Button
                    variant='primary'
                    className='w-full border-2 border-[#681819] bg-transparent text-[#681819] font-semibold py-3 rounded-lg hover:bg-[#681819] hover:text-white transition-colors'
                    onClick={() => router.push('/ric/check')}
                  >
                    Cek Status Pendaftaran
                  </Button>
                </div>
                <Button
                  variant='primary'
                  className='w-full bg-gradient-to-r from-[#FFB121] to-[#FFDD9D] text-[#681819] font-semibold py-3 rounded-lg hover:from-[#E69E1E] hover:to-[#FFCC66] transition-all'
                  onClick={() =>
                    window.open(
                      'https://drive.google.com/drive/folders/1Nh9esyQ1rtQvHkGYZcz82ekwFWbr0sN0',
                      '_blank',
                    )
                  }
                >
                  Guidebook
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className='absolute lg:-right-114 -right-20 bottom-0 translate-y-48 lg:translate-y-64'>
              <NextImage
                src='/images/ric/landing/mosque.png'
                alt='Mosque Illustration'
                width={1976}
                height={1654}
                className='w-72 lg:w-full max-w-4xl'
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GET TO KNOW RIC */}
      <section className='relative bg-[#9B2C2C] py-32 lg:py-32 overflow-hidden'>
        {/* Decoration */}
        <NextImage
          src='/images/ric/landing/section-2-decoration.png'
          alt='Decoration'
          width={300}
          height={300}
          className='absolute top-0 lg:top-1/2 -right-20 z-5 w-32'
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 md:px-8 z-20'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center'>
            {/* Left Content */}
            <div className='order-2'>
              <Typography
                as='p'
                className='text-white text-sm md:text-base text-justify leading-relaxed'
              >
                Ramadan Islamic Competition (RIC) merupakan ajang perlombaan
                yang menjadi bagian dari rangkaian kegiatan Ramadhan di Kampus
                (RDK) ITS yang diselenggarakan oleh Institut Teknologi Sepuluh
                Nopember. Kegiatan ini menginspirasi semangat kompetisi dalam
                kebaikan, mensinergikan nilai keilmuan dan keislaman, serta
                menumbuhkan kebersamaan dalam pertumbuhan spiritual. Cabang
                lomba yang dipertandingkan meliputi Musabaqah Tilawatil Qur’an
                (MTQ), Musabaqah Hifdzil Qur’an (MHQ), Lomba Da’i, Karya Tulis
                Ilmiah Al-Qur’an (KTIQ), poster, dan videografi.
              </Typography>
            </div>

            {/* Right Icon */}
            <div className='order-1 flex flex-col justify-center items-center'>
              <Typography
                as='h2'
                font='marquisette'
                weight='bold'
                className='text-4xl md:text-4xl lg:text-5xl mb-6 bg-gradient-to-r from-[#FFDD9D] to-[#FFB121] bg-clip-text text-transparent'
              >
                Get to know Ramadan Islamic Competition
              </Typography>
              <NextImage
                src='/images/ric/landing/logo-rdk.png'
                alt='Decoration'
                width={529}
                height={605}
                className='flex justify-center items-center w-1/2'
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT'S ON RIC */}
      <section className='relative bg-[#9B2C2C] py-4 lg:py-12 overflow-hidden'>
        {/* Top Decoration */}
        <NextImage
          src='/images/ric/landing/section-3-up-decoration.png'
          alt='Top Decoration'
          width={200}
          height={200}
          className='absolute top-48 left-0 z-5 w-18 lg:w-56'
        />

        {/* Bottom Decoration */}
        <NextImage
          src='/images/ric/landing/section-3-bottom-decoration.png'
          alt='Bottom Decoration'
          width={200}
          height={200}
          className='absolute bottom-0 right-0 z-5 w-18 lg:w-56'
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 md:px-8 z-20'>
          <Typography
            as='h2'
            font='marquisette'
            weight='bold'
            className='text-4xl md:text-4xl lg:text-5xl text-center mb-12 bg-gradient-to-r from-[#FFDD9D] to-[#FFB121] bg-clip-text text-transparent'
          >
            What's on Ramadan Islamic <br />
            Competition RDK 47 ITS?
          </Typography>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
            {EVENTS.map((event) => {
              const quota = getQuotaByEventId(event.id);
              const registered = Number(quota?.registered ?? 0);
              const total = Number(quota?.total ?? 0);
              const isNotOpened = !!quota && total === 0;
              const isUnlimited = total === 9999;
              const remaining = total - registered;
              const isFull = quota
                ? !isUnlimited && !isNotOpened && remaining <= 0
                : false;
              const isAlmostFull = quota
                ? !isUnlimited &&
                  !isNotOpened &&
                  remaining > 0 &&
                  remaining <= 5
                : false;

              return (
                <div
                  key={event.id}
                  className='bg-[#FFE9B5] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-between text-center hover:shadow-lg transition-shadow cursor-pointer h-full'
                >
                  <Typography
                    as='h3'
                    weight='bold'
                    className='text-[#681819] text-sm lg:text-3xl mb-4'
                  >
                    {event.title}
                  </Typography>

                  <div className='w-20 h-20 md:w-32 md:h-32 mb-4 relative'>
                    <NextImage
                      src={event.icon}
                      alt={event.title}
                      width={96}
                      height={96}
                      className='w-full h-full object-contain'
                    />
                  </div>

                  {/* Quota Display */}
                  <div className='w-full mb-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <Typography
                        as='span'
                        className='text-xs md:text-sm text-[#681819]'
                      >
                        {isUnlimited || isNotOpened ? 'Kuota' : 'Sisa Kuota'}
                      </Typography>
                      {isQuotaLoading ? (
                        <Skeleton className='w-16 h-4' />
                      ) : (
                        <Typography
                          as='span'
                          weight='bold'
                          className={`text-xs md:text-sm ${
                            isUnlimited
                              ? 'text-blue-600'
                              : isNotOpened
                                ? 'text-gray-600'
                                : isFull
                                  ? 'text-red-600'
                                  : isAlmostFull
                                    ? 'text-orange-500'
                                    : 'text-green-600'
                          }`}
                        >
                          {!quota
                            ? '-'
                            : isNotOpened
                              ? 'Belum Dibuka'
                              : isUnlimited
                                ? 'Tidak Terbatas'
                                : isFull
                                  ? 'Penuh'
                                  : `${remaining}/${total}`}
                        </Typography>
                      )}
                    </div>
                    {isQuotaLoading ? (
                      <Skeleton className='w-full h-2.5 rounded-full' />
                    ) : isUnlimited ? (
                      <div className='w-full bg-blue-200 rounded-full h-2.5'>
                        <div
                          className='h-2.5 rounded-full bg-blue-600 transition-all'
                          style={{ width: '100%' }}
                        />
                      </div>
                    ) : (
                      <div className='w-full bg-[#D9D9D9] rounded-full h-2.5'>
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            isNotOpened
                              ? 'bg-gray-400'
                              : isFull
                                ? 'bg-red-600'
                                : isAlmostFull
                                  ? 'bg-orange-500'
                                  : 'bg-green-600'
                          }`}
                          style={{
                            width:
                              quota && total > 0
                                ? `${Math.min((registered / total) * 100, 100)}%`
                                : '0%',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    className={`font-bold py-2 px-6 rounded-lg text-xs md:text-sm transition-colors w-full ${
                      isFull || isNotOpened
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-[#681819] hover:bg-[#5A1415] text-white'
                    }`}
                    onClick={() =>
                      !isFull && !isNotOpened && handleRegisterClick(event.link)
                    }
                    disabled={isFull || isNotOpened}
                  >
                    {isNotOpened
                      ? 'Belum Dibuka'
                      : isFull
                        ? 'Kuota Penuh'
                        : 'Daftar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Decoration */}
        <NextImage
          src='/images/ric/landing/section-4-bottom-left-decoration.png'
          alt='Bottom Decoration'
          width={200}
          height={200}
          className='absolute bottom-0 left-0 z-5 w-18 lg:w-56'
        />
      </section>

      {/* SECTION 5: OUR MOMENT */}
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
          className='text-center text-[#681819] mb-6'
        >
          Our Moment in RIC RDK 46
        </Typography>

        <div
          className='relative flex items-center gap-4 md:gap-8'
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className='flex-shrink-0 bg-white hover:bg-gray-100 text-[#681819] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 border-2 border-[#681819] ml-2'
            aria-label='Previous slide'
          >
            <ChevronLeft className='w-6 h-6 md:w-8 md:h-8' />
          </button>

          {/* Carousel Images Container */}
          <div className='flex-1 overflow-hidden'>
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
                  className='relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg bg-white flex-shrink-0'
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
                    className='object-cover hover:scale-105 transition-transform duration-500 ease-in-out'
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className='flex-shrink-0 bg-white hover:bg-gray-100 text-[#681819] p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 border-2 border-[#681819] mr-2'
            aria-label='Next slide'
          >
            <ChevronRight className='w-6 h-6 md:w-8 md:h-8' />
          </button>
        </div>

        {/* Dots Indicator */}
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
      </section>

      {/* SECTION 6: GET IN TOUCH */}
      <section className='relative bg-white py-12 md:py-20 overflow-hidden'>
        {/* Right Decoration */}
        <NextImage
          src='/images/ric/landing/section-6-right-bottom-decoration.png'
          alt='Right Decoration'
          width={300}
          height={300}
          className='absolute bottom-0 right-0 z-5 w-20 md:w-40 opacity-40'
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 md:px-8 z-20'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16'>
            {/* Left Side - Location */}
            <div>
              <Typography
                as='h3'
                font='marquisette'
                weight='bold'
                className='text-4xl md:text-4xl lg:text-5xl text-[#681819] mb-6'
              >
                Get In Touch
              </Typography>

              <Typography
                as='h4'
                weight='bold'
                className='text-[#681819] mb-3 text-base md:text-lg'
              >
                Lokasi
              </Typography>

              <Typography
                as='p'
                className='text-[#666] text-sm md:text-base mb-6 leading-relaxed'
              >
                Masjid Manarul Ilmi, Kampus ITS, Jl. Raya ITS, Keputih, Kel.
                Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60111
              </Typography>

              <Typography
                as='h4'
                weight='bold'
                className='text-[#681819] mb-4 text-base md:text-lg'
              >
                Contact Person
              </Typography>
              <div className='space-y-3'>
                {[
                  { name: 'CP MHQ 🧕Nasywaa', phone: '0895405759422' },
                  { name: 'CP MHQ 🤵Zuhdi', phone: '083110471600' },
                  { name: 'CP MTQ 🤵Rafly', phone: '085608272676' },
                  { name: 'CP MTQ 🧕Dinda', phone: '082338045098' },
                  { name: 'CP DAI 🤵Aufa', phone: '081217042575' },
                  { name: 'CP DAI 🤵Naufal', phone: '08980442427' },
                  { name: 'CP KTIQ 🤵Nadhif', phone: '081290233045' },
                  { name: 'CP KTIQ 🤵Salwa', phone: '082131711572' },
                  { name: 'CP POSTER 🧕Nasywa', phone: '081265281067' },
                  { name: 'CP POSTER 🤵Sofyan', phone: '081232265003' },
                  { name: 'CP VIDEOGRAFI 🧕Khosyi', phone: '087739030500' },
                  { name: 'CP VIDEOGRAFI 🤵Sofyan', phone: '081232265003' },
                ].map((contact, index) => (
                  <a
                    key={index}
                    href={`https://wa.me/62${contact.phone.slice(1)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-3 text-[#681819] hover:text-[#5A1415] transition-colors text-sm md:text-base'
                  >
                    <FaWhatsapp className='text-xl flex-shrink-0' />
                    <span>
                      {contact.phone} ({contact.name})
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side - Map */}
            <div className='relative h-80 md:h-full min-h-96 rounded-lg overflow-hidden shadow-lg'>
              <iframe
                src='https://maps.google.com/maps?hl=en&q=masjid%20manarul%20ilmi%20its&t=&z=14&ie=UTF8&iwloc=B&output=embed'
                width={320}
                height={400}
                style={{ border: 0 }}
                allowFullScreen={undefined}
                aria-hidden='false'
                tabIndex={0}
                className='rounded max-w-lg w-full h-full'
                title='Masjid Manarul Ilmi ITS'
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
