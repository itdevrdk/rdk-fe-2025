'use client';

import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

type EventKey = 'MHQ' | 'MTQ' | 'DAI' | 'KTIQ' | 'POSTER' | 'VIDEOGRAFI';

const WA_GROUP_LINK: Record<EventKey, string> = {
  MHQ: 'https://chat.whatsapp.com/K7oWbcTYs9NDB7NG4sgtf7',
  MTQ: 'https://chat.whatsapp.com/FK6Bc8OgMU3Cqr4OPLmpjo',
  DAI: 'https://chat.whatsapp.com/DuqUnCAzH0V3RH9vWui78X',
  KTIQ: 'https://chat.whatsapp.com/JhCUQnCW01K9jc1vrnw1Oo',
  POSTER: 'https://chat.whatsapp.com/CMCXKyqVlfr5LEDBYe2UED',
  VIDEOGRAFI: 'https://chat.whatsapp.com/Hza0vYATHRwJqrNyxT5JxQ',
};

const CONTACT_PERSON: Record<EventKey, { name: string; phone: string }[]> = {
  MHQ: [
    { name: 'CP MHQ 🧕Nasywaa', phone: '0895405759422' },
    { name: 'CP MHQ 🤵Zuhdi', phone: '083110471600' },
  ],
  MTQ: [
    { name: 'CP MTQ 🤵Rafly', phone: '085608272676' },
    { name: 'CP MTQ 🧕Dinda', phone: '082338045098' },
  ],
  DAI: [
    { name: 'CP DAI 🤵Aufa', phone: '081217042575' },
    { name: 'CP DAI 🤵Naufal', phone: '08980442427' },
  ],
  KTIQ: [
    { name: 'CP KTIQ 🤵Nadhif', phone: '081290233045' },
    { name: 'CP KTIQ 🤵Salwa', phone: '082131711572' },
  ],
  POSTER: [
    { name: 'CP POSTER 🧕Nasywa', phone: '081265281067' },
    { name: 'CP POSTER 🤵Sofyan', phone: '081232265003' },
  ],
  VIDEOGRAFI: [
    { name: 'CP VIDEOGRAFI 🧕Khosyi', phone: '087739030500' },
    { name: 'CP VIDEOGRAFI 🤵Sofyan', phone: '081232265003' },
  ],
};

const EVENT_LABEL: Record<EventKey, string> = {
  MHQ: 'MHQ (Individu)',
  MTQ: 'MTQ (Individu)',
  DAI: 'Dai (Individu)',
  KTIQ: 'KTIQ (Tim)',
  POSTER: 'Poster (Individu)',
  VIDEOGRAFI: 'Videografi (Tim)',
};

const isEventKey = (value: string): value is EventKey => value in WA_GROUP_LINK;

function RICSuccessContent() {
  const searchParams = useSearchParams();
  const eventParam = (searchParams.get('event') || '').toUpperCase();
  const eventKey = isEventKey(eventParam) ? eventParam : null;

  const contactPersons = eventKey
    ? CONTACT_PERSON[eventKey].map((cp) => ({
        name: cp.name,
        phone: cp.phone,
        waLink: `https://wa.me/62${cp.phone.replace(/^0+/, '')}`,
      }))
    : [
        {
          name: 'Panitia RIC',
          phone: '08123456789',
          waLink: 'https://wa.me/6281234567890',
        },
      ];

  const contactLabel = eventKey ? EVENT_LABEL[eventKey] : 'Cabang lomba';

  const waGroupLink = eventKey
    ? WA_GROUP_LINK[eventKey]
    : 'https://chat.whatsapp.com/';

  return (
    <Layout withNavbar withFooter>
      {/* SUCCESS SECTION */}
      <section className='relative bg-[#FFE9B5] min-h-screen flex flex-col py-12 md:py-20 overflow-hidden'>
        {/* Top Right Decoration - Lamps */}
        <NextImage
          src='/images/nuzulul-quran/success/top-right-decoration-lamp.png'
          alt='Top Right Decoration'
          width={147}
          height={243}
          className='absolute top-0 right-0 z-10 w-20 md:w-32 lg:w-auto'
        />

        {/* Bottom Left Stars */}
        <NextImage
          src='/images/nuzulul-quran/success/bottom-left -stars.png'
          alt='Bottom Left Stars'
          width={280}
          height={260}
          className='absolute bottom-0 left-0 z-5 w-20 md:w-40 opacity-70'
        />

        {/* Bottom Right Stars */}
        <NextImage
          src='/images/nuzulul-quran/success/bottom-right-stars.png'
          alt='Bottom Right Stars'
          width={280}
          height={260}
          className='absolute bottom-0 right-0 z-5 w-20 md:w-40 opacity-70'
        />

        <div className='relative mx-auto max-w-4xl w-full px-4 md:px-6 z-20 flex flex-col items-center'>
          {/* Title */}
          <Typography
            as='h1'
            variant='h2'
            font='marquisette'
            weight='bold'
            className='text-[#681819] text-3xl md:text-4xl mb-8 md:mb-12 text-center'
          >
            Terima Kasih Sudah Mendaftar!
          </Typography>

          {/* Success Card */}
          <div className='bg-white rounded-2xl p-8 md:p-12 shadow-lg max-w-4xl w-full mb-12'>
            {/* Description Text */}
            <div className='space-y-4'>
              <Typography
                as='p'
                className='text-[#681819] text-center text-sm md:text-base leading-relaxed'
              >
                Selamat! Kamu resmi jadi bagian dari peserta Ramadan Islamic
                Competition RDK 47 ITS✨
              </Typography>

              <Typography
                as='p'
                className='text-[#681819] text-center text-sm md:text-base leading-relaxed'
              >
                INFO PENTING! Seluruh peserta dan pendamping WAJIB bergabung ke
                grup sesuai cabang lomba yang dipilih, ya! Di sana kamu bakal
                dapat info penting seputar teknis lomba, jadwal, dan update
                terbaru langsung dari panitia.
              </Typography>

              <Typography
                as='p'
                className='text-[#681819] text-center text-sm md:text-base leading-relaxed'
              >
                Cabang lomba kamu:{' '}
                <span className='font-semibold'>{contactLabel}</span>
              </Typography>
            </div>

            {/* WhatsApp Button */}
            <a
              href={waGroupLink}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-8 flex items-center justify-center gap-2 w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors text-sm md:text-base'
            >
              <FaWhatsapp width={20} height={20} />
              Gabung Grup WhatsApp
            </a>
          </div>

          {/* Contact Person Section */}
          <div className='w-full mb-12'>
            <Typography
              as='h3'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='text-[#681819] text-center mb-6 text-xl md:text-2xl'
            >
              Contact Person • {contactLabel}
            </Typography>

            <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 flex-wrap'>
              {contactPersons.map((cp, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <FaWhatsapp className='text-2xl text-[#681819]' />
                  <a
                    href={cp.waLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[#681819] font-semibold hover:text-[#5A1415] transition-colors text-sm md:text-base'
                  >
                    {cp.phone} ({cp.name})
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default function RICSuccessPage() {
  return (
    <Suspense
      fallback={
        <Layout withNavbar withFooter>
          <div className='min-h-screen flex items-center justify-center'>
            Loading...
          </div>
        </Layout>
      }
    >
      <RICSuccessContent />
    </Suspense>
  );
}
