'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Typography from '@/components/Typography';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kegiatanOpen, setKegiatanOpen] = useState(false);

  const kegiatanItems = [
    { name: 'Ramadan Islamic Competition', href: '/ric' },
    { name: 'Kajian Inspiratif', href: '/kajian-inspiratif' },
    { name: "Nuzulul Qur'an", href: '/nuzulul-quran' },
    { name: 'Lailatul Hikmah', href: '/lailatul-hikmah' },
  ];

  return (
    <header className='relative z-50 bg-white'>
      <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-6'>
        <Link href='/' className='flex items-center gap-3'>
          <NextImage
            src='/images/navbar/logo-rdk.svg'
            alt='RDK 47'
            width={40}
            height={40}
            priority
          />
          <Typography
            as='span'
            font='marquisette'
            weight='bold'
            variant='h5'
            className='text-lg text-[#8B1E1F]'
          >
            RDK 47
          </Typography>
        </Link>

        {/* DESKTOP MENU */}
        <nav className='hidden items-center md:flex gap-10'>
          <Typography className='cursor-pointer text-[#8B1E1F]' weight='bold'>
            Kalender
          </Typography>

          <div className='relative'>
            <button
              onClick={() => setKegiatanOpen((v) => !v)}
              className='flex items-center gap-1 text-[#8B1E1F] cursor-pointer'
            >
              <Typography weight='bold'>Kegiatan</Typography>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  kegiatanOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`
                absolute left-0 top-full mt-3 w-48 rounded-lg bg-white shadow-lg
                origin-top
                transition-all duration-300 ease-out
                ${kegiatanOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}
              `}
            >
              {kegiatanItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setKegiatanOpen(false)}
                  className='block cursor-pointer px-4 py-3 text-sm text-[#8B1E1F] hover:bg-[#FFE9B5]'
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href='/#pendaftaran-kegiatan'>
            <Typography weight='bold' className='cursor-pointer text-[#8B1E1F]'>
              Pendaftaran Kegiatan
            </Typography>
          </Link>

          <Link href='/report'>
            <Typography weight='bold' className='cursor-pointer text-[#8B1E1F]'>
              Laporan Keuangan
            </Typography>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className='md:hidden text-[#8B1E1F]'
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`
          md:hidden overflow-hidden bg-white
          transition-all duration-300 ease-out
          ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <nav className='flex flex-col gap-6 px-6 py-6'>
          <Typography weight='bold' className='cursor-pointer text-[#8B1E1F]'>
            Kalender
          </Typography>
          <button
            onClick={() => setKegiatanOpen((v) => !v)}
            className='flex items-center justify-between text-[#8B1E1F]'
          >
            <Typography weight='bold'>Kegiatan</Typography>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                kegiatanOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {kegiatanOpen && (
            <div className='mb-6 overflow-hidden transition-all duration-300 ease-out'>
              <div className='flex flex-col gap-4 pt-2'>
                {kegiatanItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='cursor-pointer text-sm text-[#8B1E1F]'
                    onClick={() => {
                      setKegiatanOpen(false);
                      setMobileOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href='/#pendaftaran-kegiatan'
            onClick={() => setMobileOpen(false)}
          >
            <Typography className='cursor-pointer text-[#8B1E1F]' weight='bold'>
              Pendaftaran Kegiatan
            </Typography>
          </Link>

          <Link href='/report' onClick={() => setMobileOpen(false)}>
            <Typography weight='bold' className='cursor-pointer text-[#8B1E1F]'>
              Laporan Keuangan
            </Typography>
          </Link>
        </nav>
      </div>
    </header>
  );
}
