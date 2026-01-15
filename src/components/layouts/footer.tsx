import { Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { RiTiktokLine } from 'react-icons/ri';

import Typography from '@/components/Typography';

export default function Footer() {
  return (
    <footer className='relative overflow-hidden bg-gradient-to-r from-[#C33A3C] to-[#942B2C] text-white'>
      <Image
        src='/images/footer/ornament-bottom-left.png'
        alt='Ornament Bottom Left'
        width={320}
        height={320}
        className='pointer-events-none absolute bottom-0 left-0 '
      />

      <Image
        src='/images/footer/ornament-top-right.png'
        alt='Ornament Top Right'
        width={280}
        height={280}
        className='pointer-events-none absolute right-0 top-0 '
      />

      <div className='relative mx-auto max-w-7xl px-6 py-14 mt-6'>
        {/* Desktop */}
        <div className='hidden items-center justify-between md:flex'>
          {/* Logo */}
          <div className='flex items-center gap-4'>
            <Image
              src='/images/footer/logo-rdk47.svg'
              alt='RDK 47'
              width={56}
              height={56}
            />
            <Typography as='span' variant='h5' font='marquisette' weight='bold'>
              RDK 47
            </Typography>
          </div>

          {/* Menu */}
          <nav className='flex gap-10'>
            {[
              'Kalender',
              'Kegiatan',
              'Pendaftaran Kegiatan',
              'Laporan Keuangan',
            ].map((item) => (
              <Typography
                key={item}
                as='a'
                href='#'
                variant='body'
                font='zabal'
                weight='regular'
                className='transition-opacity hover:opacity-80'
              >
                {item}
              </Typography>
            ))}
          </nav>

          {/* Social Media */}
          <div className='flex gap-6'>
            <Link
              href='https://whatsapp.com/channel/0029VaqSS5UFCCoZBnLNIE43'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='WhatsApp'
            >
              <FaWhatsapp className='text-white w-[28px] h-[28px]' />
            </Link>
            <Link
              href='https://instagram.com/rdk.its'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='Instagram'
            >
              <Instagram width={28} height={28} className='text-white' />
            </Link>
            <Link
              href='https://www.tiktok.com/@rdk.its'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='TikTok'
            >
              <RiTiktokLine size={28} className='text-white' />
            </Link>
            <Link
              href='https://www.youtube.com/@MasjidITS'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='YouTube'
            >
              <Youtube width={28} height={28} className='text-white' />
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div className='flex flex-col items-center gap-6 text-center md:hidden'>
          <div className='flex flex-row items-center gap-4'>
            <Image
              src='/images/footer/logo-rdk47.svg'
              alt='RDK 47'
              width={64}
              height={64}
            />
            <Typography as='span' variant='h1' font='marquisette' weight='bold'>
              RDK 47
            </Typography>
          </div>

          <nav className='flex flex-col gap-5'>
            {[
              'Kalender',
              'Kegiatan',
              'Pendaftaran Kegiatan',
              'Laporan Keuangan',
            ].map((item) => (
              <Typography
                key={item}
                as='a'
                href='#'
                variant='body'
                font='zabal'
                weight='regular'
              >
                {item}
              </Typography>
            ))}
          </nav>

          {/* Social Media */}
          <div className='flex justify-center gap-6 mt-6'>
            <Link
              href='https://whatsapp.com/channel/0029VaqSS5UFCCoZBnLNIE43'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='WhatsApp'
            >
              <FaWhatsapp className='text-white w-[28px] h-[28px]' />
            </Link>
            <Link
              href='https://instagram.com/rdk.its'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='Instagram'
            >
              <Instagram width={28} height={28} className='text-white' />
            </Link>
            <Link
              href='https://www.tiktok.com/@rdk.its'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='TikTok'
            >
              <RiTiktokLine size={28} className='text-white' />
            </Link>
            <Link
              href='https://www.youtube.com/@MasjidITS'
              target='_blank'
              className='hover:scale-110 transition-transform'
              title='YouTube'
            >
              <Youtube width={28} height={28} className='text-white' />
            </Link>
          </div>
        </div>
        <div className='relative border-t border-white/30 mt-8 py-6'>
          <Typography
            as='p'
            variant='label'
            font='zabal'
            weight='regular'
            className='text-center md:text-start text-white'
          >
            © 2026 RDK 47 Institut Teknologi Sepuluh Nopember. All rights
            reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
