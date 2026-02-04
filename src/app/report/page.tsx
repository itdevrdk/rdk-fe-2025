'use client';

import { Check, Copy, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useFinanceReport } from '@/hooks/useFinanceReport';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';

import { formatIDR } from '@/utils/format';

import { FinanceReportDetails } from '@/types/finance';

// Date formatter helper
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  );
};

export default function ReportPage() {
  const { getFinanceReportDetails } = useFinanceReport();
  const [data, setData] = React.useState<FinanceReportDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getFinanceReportDetails();
      if (result) {
        setData(result);
      }
      setLoading(false);
    };
    fetchData();
  }, [getFinanceReportDetails]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('7770778977');
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <Layout withNavbar withFooter>
      <main className='relative min-h-screen bg-[#FDFBF7] overflow-x-hidden'>
        {/* HERO SECTION */}
        <section className='relative w-screen bg-[#FFDD9D] h-screen pt-32 pb-48'>
          {/* Background Elements */}
          <div className='absolute hidden lg:block bottom-0 right-0 translate-y-18 translate-x-48 z-0 h-full w-1/2'>
            <Image
              src='/images/report/section-1-gradation.png'
              alt='Background Gradient'
              fill
              className='object-cover object-right-bottom'
            />
          </div>
          <div className='absolute hidden lg:block bottom-0 left-0 translate-y-18 -translate-x-48 z-0 h-full w-1/2'>
            <Image
              src='/images/report/section-1-gradation.png'
              alt='Background Gradient'
              fill
              className='object-cover object-right-bottom'
            />
          </div>

          {/* Floating Elements - Coins & Stars */}
          <div className='absolute top-24 lg:top-64 left-8 lg:left-64 w-16 lg:w-24 animate-[float_3s_ease-in-out_infinite]'>
            <Image
              src='/images/report/section-1-left-coin.png'
              alt='Coin'
              width={100}
              height={100}
              className='object-contain'
            />
          </div>
          <div className='absolute top-16 lg:top-48 right-10 lg:right-64 w-20 lg:w-32 animate-[float_4s_ease-in-out_infinite]'>
            <Image
              src='/images/report/section-1-right-coin.png'
              alt='Coin'
              width={128}
              height={128}
              className='object-contain'
            />
          </div>
          <div className='absolute bottom-0 left-0 w-full h-full pointer-events-none'>
            <Image
              src='/images/report/section-1-left-stars.png'
              alt='Stars'
              width={998}
              height={850}
              className='absolute bottom-0 left-0 w-48 lg:w-128 h-auto'
            />
          </div>
          <div className='absolute bottom-0 right-0 w-full h-full pointer-events-none'>
            <Image
              src='/images/report/section-1-right-stars.png'
              alt='Stars'
              width={998}
              height={850}
              className='absolute bottom-0 right-0 w-48 lg:w-128 h-auto'
            />
          </div>

          <div className='relative z-10 max-w-7xl mx-auto px-4 text-center'>
            <div className='mb-4 flex justify-center'>
              <Image
                src='/images/report/logo-rdk.png'
                alt='RDK Logo'
                width={120}
                height={120}
                className='object-contain'
              />
            </div>

            <Typography
              as='h1'
              font='marquisette'
              className='text-4xl md:text-5xl lg:text-6xl text-[#681819]'
            >
              Laporan Keuangan
            </Typography>
            <Typography
              as='p'
              font='zabal'
              className='text-lg md:text-xl lg:text-2xl text-[#8B5E3C]'
            >
              Ramadan Di Kampus 1447 H ITS
            </Typography>
          </div>

          {/* Wall Decoration Bottom */}
          <div className='absolute bottom-0 left-0 w-full'>
            <Image
              src='/images/report/secttion-1-bottom-decoration.png'
              alt='Mosque Wall Decoration'
              width={1920}
              height={1080}
              className='w-full h-1/2 object-contain object-bottom'
            />
          </div>
        </section>

        {/* FINANCIAL REPORT SECTION */}
        <section className='relative z-20 pt-24 px-6 lg:px-0'>
          <div className='mx-auto max-w-7xl'>
            <div className='mb-12 text-center bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'>
              <Typography
                as='h2'
                font='marquisette'
                className='text-4xl md:text-5xl lg:text-6xl mb-8'
              >
                Laporan Keuangan
              </Typography>
            </div>

            {/* Saldo Terkini Card */}
            <div className='relative mb-12 overflow-hidden rounded-[40px] bg-[#FFE8C5] p-8 lg:p-12 shadow-lg'>
              {/* Decorative Money */}
              <div className='absolute hidden lg:block right-0 bottom-0 h-full w-1/4'>
                <Image
                  src='/images/report/section-2-right-money.png'
                  alt='Money Decoration'
                  fill
                  className='object-contain object-right'
                />
              </div>

              <div className='relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:space-y-4 w-full justify-center'>
                <div className='flex gap-4 items-center justify-center w-full'>
                  <Image
                    src='/images/report/section-2-left-coin.png'
                    alt='coin'
                    width={200}
                    height={200}
                    className='hidden lg:block absolute left-16 bottom-0 animate-float'
                  />
                  <Typography
                    as='div'
                    font='marquisette'
                    className='text-5xl md:text-6xl lg:text-8xl text-[#681819]' // Increased text size
                  >
                    {loading
                      ? '...'
                      : data
                        ? formatIDR(data.total_balance)
                        : 'Rp0'}
                  </Typography>
                </div>
                <Typography
                  as='div'
                  font='zabal'
                  className='text-lg md:text-xl lg:text-2xl text-black font-semibold mx-auto'
                >
                  Saldo Terkini
                </Typography>
              </div>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {/* Income */}
              <div className='rounded-[32px] border border-gray-100 bg-white p-8 lg:p-10 shadow-sm'>
                <div className='mb-6'>
                  <Typography
                    as='h3'
                    font='zabal'
                    weight='bold'
                    className='text-lg md:text-xl lg:text-2xl text-black'
                  >
                    Pemasukan
                  </Typography>
                  <Typography
                    as='div'
                    font='marquisette'
                    className='text-3xl md:text-4xl lg:text-5xl text-[#75C883] my-2'
                  >
                    {loading
                      ? '...'
                      : data
                        ? formatIDR(data.income.total)
                        : 'Rp0'}
                  </Typography>
                  <Typography
                    as='p'
                    className='text-xs md:text-sm lg:text-base text-gray-400'
                  >
                    *Terakhir diperbarui{' '}
                    {data ? formatDate(data.income.last_updated) : '-'}
                  </Typography>
                </div>
                <div className='h-64 w-full'>
                  {loading ? (
                    <div className='h-full w-full bg-gray-100 rounded animate-pulse' />
                  ) : (
                    <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart data={data?.income.history || []}>
                        <defs>
                          <linearGradient
                            id='colorIncome'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='#FCD34D'
                              stopOpacity={0.1}
                            />
                            <stop
                              offset='95%'
                              stopColor='#FCD34D'
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray='3 3'
                          stroke='#f0f0f0'
                        />
                        <XAxis
                          dataKey='name'
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Tooltip />
                        <Area
                          type='monotone'
                          dataKey='value'
                          stroke='#FCD34D'
                          strokeWidth={2}
                          fillOpacity={1}
                          fill='url(#colorIncome)'
                          dot={{ r: 3, fill: '#FCD34D' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Expense */}
              <div className='rounded-[32px] border border-gray-100 bg-white p-8 lg:p-10 shadow-sm'>
                <div className='mb-6'>
                  <Typography
                    as='h3'
                    font='zabal'
                    weight='bold'
                    className='text-lg md:text-xl lg:text-2xl text-black'
                  >
                    Pengeluaran
                  </Typography>
                  <Typography
                    as='div'
                    font='marquisette'
                    className='text-3xl md:text-4xl lg:text-5xl text-[#E05D5D] my-2'
                  >
                    {loading
                      ? '...'
                      : data
                        ? formatIDR(data.expense.total)
                        : 'Rp0'}
                  </Typography>
                  <Typography
                    as='p'
                    className='text-xs md:text-sm lg:text-base text-gray-400'
                  >
                    *Terakhir diperbarui{' '}
                    {data ? formatDate(data.expense.last_updated) : '-'}
                  </Typography>
                </div>
                <div className='h-64 w-full'>
                  {loading ? (
                    <div className='h-full w-full bg-gray-100 rounded animate-pulse' />
                  ) : (
                    <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart data={data?.expense.history || []}>
                        <defs>
                          <linearGradient
                            id='colorExpense'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='#A78BFA'
                              stopOpacity={0.1}
                            />
                            <stop
                              offset='95%'
                              stopColor='#A78BFA'
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray='3 3'
                          stroke='#f0f0f0'
                        />
                        <XAxis
                          dataKey='name'
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Tooltip />
                        <Area
                          type='monotone'
                          dataKey='value'
                          stroke='#A78BFA'
                          strokeWidth={2}
                          fillOpacity={1}
                          fill='url(#colorExpense)'
                          dot={{ r: 3, fill: '#A78BFA' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARTNERSHIP PACKAGES - Synced from Sponsorship Page */}
        <section className='bg-white py-24'>
          <div className='mx-auto max-w-7xl px-6'>
            <Typography
              as='h2'
              variant='h3'
              font='marquisette'
              weight='bold'
              className='text-4xl md:text-5xl lg:text-6xl mb-16 text-center bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
            >
              Paket Kerjasama
            </Typography>

            <div className='grid gap-8 md:grid-cols-2 mb-10'>
              {/* FIRDAUS */}
              <div className='relative overflow-hidden rounded-2xl bg-[#FFF3D4] p-6'>
                <Image
                  src='/images/sponsor/ass4.png'
                  alt=''
                  width={250}
                  height={150}
                  className='absolute right-0 bottom-0 pointer-events-none'
                />

                {/* CONTENT */}
                <div className='relative z-10 max-w-[70%]'>
                  <h3 className='font-marquisette text-xl text-[#8B1E1E]'>
                    Paket Firdaus
                  </h3>
                  <p className='mb-4 text-sm text-[#8B1E1E]'>Rp150.000.000</p>

                  <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                    Benefit
                  </p>

                  <div className='flex flex-wrap gap-2'>
                    {[
                      'Logo XL di Semua Media',
                      'Adlibs MC 25x Mention',
                      'Video Profil 3 Menit',
                      'Undangan VIP Halal Bihalal ITS',
                      'Iklan Videotron Gerbang Utama ITS',
                    ].map((b, i) => (
                      <span
                        key={i}
                        className='rounded bg-white px-3 py-1 text-xs text-[#681819]'
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ADN */}
              <div className='relative overflow-hidden rounded-2xl bg-[#FFF3D4] p-6'>
                <Image
                  src='/images/sponsor/ass5.png'
                  alt=''
                  width={150}
                  height={100}
                  className='absolute right-0 bottom-0 pointer-events-none'
                />

                <div className='relative z-10 max-w-[70%]'>
                  <h3 className='font-marquisette text-xl text-[#8B1E1E]'>
                    Paket ‘Adn
                  </h3>
                  <p className='mb-4 text-sm text-[#8B1E1E]'>Rp100.000.000</p>

                  <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                    Benefit
                  </p>

                  <div className='flex flex-wrap gap-2'>
                    {[
                      'Logo XL di Semua Media',
                      'Video Profil 3 Menit',
                      'Run Text Live Stream 15 Hari',
                      'Adlibs MC 18x Mention',
                    ].map((b, i) => (
                      <span
                        key={i}
                        className='rounded bg-white px-3 py-1 text-xs text-[#681819]'
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='grid gap-8 md:grid-cols-3'>
              {/* NAIM */}
              <div className='rounded-2xl border border-[#FFD48A] bg-[#FFF9EE] p-6'>
                <h3 className='font-marquisette text-lg text-[#8B1E1E] text-center'>
                  Paket Na’im
                </h3>
                <p className='mb-4 text-sm text-[#8B1E1E] text-center'>
                  Rp50.000.000
                </p>

                <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                  Benefit
                </p>

                <div className='flex flex-wrap gap-2'>
                  {[
                    'Logo L di Semua Media',
                    'Adlibs MC 12x Mention',
                    'Video Profil 2 Menit',
                  ].map((b, i) => (
                    <span
                      key={i}
                      className='rounded bg-[#FFE3AE] px-3 py-1 text-xs text-[#681819]'
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* MAWA */}
              <div className='rounded-2xl border border-[#FFD48A] bg-[#FFF9EE] p-6'>
                <h3 className='font-marquisette text-lg text-center text-[#8B1E1E]'>
                  Paket Ma’wa
                </h3>
                <p className='mb-4 text-sm text-[#8B1E1E] text-center'>
                  Rp25.000.000
                </p>

                <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                  Benefit
                </p>

                <div className='flex flex-wrap gap-2'>
                  {[
                    'Logo M di Semua Media',
                    'Adlibs MC 6x Mention',
                    'Video Profil 1 Menit',
                  ].map((b, i) => (
                    <span
                      key={i}
                      className='rounded bg-[#FFE3AE] px-3 py-1 text-xs text-[#681819]'
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* DARUSSALAM */}
              <div className='rounded-2xl border border-[#FFD48A] bg-[#FFF9EE] p-6'>
                <h3 className='font-marquisette text-lg text-[#8B1E1E] text-center'>
                  Paket Darussalam
                </h3>
                <p className='mb-4 text-sm text-[#8B1E1E] text-center'>
                  Rp10.000.000
                </p>

                <p className='mb-2 text-xs font-semibold text-[#C33A3C]'>
                  Benefit
                </p>

                <div className='flex flex-wrap gap-2'>
                  {[
                    'Logo S di Semua Media',
                    'Adlibs MC 3x Mention',
                    'Deskripsi Perusahaan (No Video)',
                  ].map((b, i) => (
                    <span
                      key={i}
                      className='rounded bg-[#FFE3AE] px-3 py-1 text-xs text-[#681819]'
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DONATION SECTION - Synced from Infaq Page */}
        <section className='bg-white py-8 md:py-24'>
          <div className='mx-auto max-w-7xl px-6 grid gap-16 md:grid-cols-2'>
            {/* LEFT */}
            <div className='order-2 md:order-1'>
              <div className='border-b-1 border-[#BCBCBC]'>
                <Typography
                  as='h2'
                  variant='h4'
                  font='marquisette'
                  weight='bold'
                  className='mb-4 bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
                >
                  Donasi Langsung
                </Typography>

                <Typography
                  variant='title'
                  font='zabal'
                  className='mb-6 text-sm'
                >
                  Sekretariat JMMI ITS, Barat Daya Masjid Manarul Ilmi Kampus
                  ITS Sukolilo
                </Typography>
              </div>
              <div className='border-b-1 border-[#BCBCBC] mt-4'>
                <Typography
                  as='h3'
                  variant='h4'
                  font='marquisette'
                  weight='bold'
                  className='mb-4 bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
                >
                  Layanan Jemput Infaq
                </Typography>

                <Typography
                  variant='title'
                  font='zabal'
                  className='mb-6 text-sm'
                >
                  Khusus Warga Perumdos & Sekitar Kampus, Kami Siap Jemput
                  Donasi Anda!
                </Typography>
              </div>
              <div className='mt-4'>
                <Typography
                  as='h3'
                  variant='h4'
                  font='marquisette'
                  weight='bold'
                  className='mb-2 bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
                >
                  Rekening Transfer
                </Typography>

                <div className='flex items-center gap-3'>
                  <Typography
                    variant='h5'
                    font='zabal'
                    className='font-semibold'
                  >
                    BSI 7770778977
                  </Typography>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleCopy}
                    className='flex items-center gap-2 rounded-md bg-[#681819] px-4 text-white hover:bg-[#681819] hover:text-white'
                  >
                    {copied ? (
                      <>
                        Tersalin
                        <Check className='h-4 w-4' />
                      </>
                    ) : (
                      <>
                        Salin
                        <Copy className='h-4 w-4' />
                      </>
                    )}
                  </Button>
                </div>

                <p className='mt-2 text-xs'>(a.n Takmir Masjid Manarul Ilmi)</p>

                <p className='mt-2 text-xs'>
                  Tambahkan kode <strong>“047”</strong> pada nominal transfer
                  (Contoh: Rp 10.047)
                </p>
              </div>
              <div className='justify-end mt-6'>
                <Typography
                  as='h2'
                  variant='h4'
                  font='zabal'
                  weight='bold'
                  className='mb-2 text-black'
                >
                  Contact Person
                </Typography>

                <div className='space-x-2 text-sm flex flex-row items-center '>
                  <a
                    href='https://wa.me/6287817503128'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Typography
                      variant='title'
                      className='mr-4 bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
                    >
                      {' '}
                      <FaWhatsapp className='inline text-[#681819]' />{' '}
                      087817503128 (Fikri)
                    </Typography>
                  </a>
                  <a
                    href='https://wa.me/6285239204463'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Typography
                      variant='title'
                      className='bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
                    >
                      {' '}
                      <FaWhatsapp className='inline text-[#681819]' />{' '}
                      085239204463 (Putri)
                    </Typography>
                  </a>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center items-center order-1 md:order-2'>
              <Typography
                as='h3'
                variant='h4'
                font='marquisette'
                weight='bold'
                className='mb-2 text-4xl lg:text-6xl text-center bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
              >
                Scan to Donate
              </Typography>
              <Image
                src='/images/infaq/qris.png'
                alt='QRIS Donasi'
                width={360}
                height={480}
                className='w-full max-w-sm'
              />
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className='px-4 py-20 bg-white text-center'>
          <Typography
            as='h2'
            font='marquisette'
            className='text-4xl lg:text-6xl bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent mb-6'
          >
            Ingin Berdiskusi Lebih Lanjut?
          </Typography>
          <div className='flex flex-col md:flex-row justify-center gap-6 md:gap-12 items-center text-[#A67C00] font-medium'>
            <div className='flex items-center gap-2'>
              <Typography variant='label'>
                <FaWhatsapp className='mr-1 inline w-4 h-4' />
                <a
                  href='https://wa.me/6285237756975'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:underline hover:text-[#C33A3C] transition-colors'
                >
                  +62852-3775-6975 (Viqi)
                </a>
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='label'>
                <Mail className='mr-1 inline w-4 h-4' />
                <a
                  href='mailto:rdkitssponsorship@gmail.com'
                  className='hover:underline hover:text-[#C33A3C] transition-colors'
                >
                  rdkitssponsorship@gmail.com
                </a>
              </Typography>
            </div>
          </div>
          <div className='mt-6 flex justify-center items-center gap-2 text-[#A67C00] text-sm'>
            <Typography variant='label'>
              <MapPin className='mr-1 inline w-4 h-4' /> Sekretariat Masjid
              Manarul Ilmi, Jl. Teknik Mesin No. 173, Kampus ITS Sukolilo
            </Typography>
          </div>
        </section>
      </main>
    </Layout>
  );
}
