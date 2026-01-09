import Image from 'next/image';

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
        </div>
        <div className='relative border-t border-white/30 mt-8 py-6'>
          <Typography
            as='p'
            variant='label'
            font='zabal'
            weight='regular'
            className='text-center md:text-start text-white'
          >
            © 2025 RDK 47 Institut Teknologi Sepuluh Nopember. All rights
            reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
