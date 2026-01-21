'use client';

import { Check, Copy } from 'lucide-react';
import NextImage from 'next/image';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';

export default function InfaqRamadhanPage() {
  const [copied, setCopied] = useState(false);

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
      <main className='w-full overflow-x-hidden'>
        {/*  SECTION 1  */}
        <section className='relative overflow-hidden bg-[#FFDD9D] pb-[150px] md:pb-0'>
          {/* ORNAMENTS */}
          <NextImage
            src='/images/infaq/ass1.png'
            alt=''
            width={240}
            height={240}
            className='absolute right-0 top-0 w-28 md:w-44'
          />
          <NextImage
            src='/images/infaq/ass2.png'
            alt=''
            width={240}
            height={240}
            className='hidden md:block md:absolute left-0 bottom-0 w-28 md:w-44'
          />
          <NextImage
            src='/images/infaq/ass3.png'
            alt=''
            width={600}
            height={600}
            className='hidden md:block md:absolute right-0 bottom-0 w-28 md:w-auto'
          />

          <div className='relative z-10 mx-auto max-w-7xl px-6 py-20 grid gap-10 md:grid-cols-2 items-center'>
            {/* TEXT */}
            <div>
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='md:text-start text-center mb-2 bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'
              >
                Infaq Ramadhan
              </Typography>

              <p className='md:text-start text-center mb-6 text-sm text-[#681819]'>
                Ramadan Di Kampus 1447 H ITS
              </p>

              <Typography
                font='marquisette'
                weight='bold'
                className='md:text-start text-center mb-4 text-sm italic leading-relaxed text-[#3a1c1c]'
              >
                يَا أَيُّهَا الَّذِينَ آمَنُوا أَنفِقُوا مِن طَيِّبَاتِ مَا
                كَسَبْتُمْ وَمِمَّا أَخْرَجْنَا لَكُم مِّنَ الْأَرْضِ
              </Typography>

              <p className='md:text-start text-center mb-6 text-xs leading-relaxed text-[#3a1c1c]'>
                Hai orang-orang yang beriman, infakkanlah (di jalan Allah)
                sebagian dari hasil usaha kalian yang baik-baik dan sebagian
                dari apa yang Kami keluarkan dari bumi untuk kalian. (QS.
                Al-Baqarah: 267)
              </p>

              <p className='md:text-start text-center mb-3 text-sm font-medium text-[#681819]'>
                Infaq dapat berupa
              </p>

              <div className='flex flex-wrap gap-3 justify-center md:justify-start'>
                <Button className='bg-gradient-to-r from-[#942B2C] to-[#C33A3C] text-white hover:bg-[#7a1c1d]'>
                  Uang Tunai
                </Button>
                <Button className='bg-gradient-to-r from-[#942B2C] to-[#C33A3C] text-white hover:bg-[#7a1c1d]'>
                  Transfer
                </Button>
                <Button className='bg-gradient-to-r from-[#942B2C] to-[#C33A3C] text-white hover:bg-[#7a1c1d]'>
                  Makanan / Minuman
                </Button>
                <Button className='bg-gradient-to-r from-[#942B2C] to-[#C33A3C] text-white hover:bg-[#7a1c1d]'>
                  Barang
                </Button>
              </div>

              <p className='md:text-start text-center mt-4 text-xs italic text-[#681819]'>
                Kami menerima apabila dari donatur memohon hari tertentu untuk
                menanggung konsumsi pada hari tersebut.
              </p>
            </div>
          </div>
          <NextImage
            src='/images/infaq/ass3-m.png'
            alt=''
            width={400}
            height={400}
            className='absolute md:hidden bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 pointer-events-none'
          />
        </section>

        {/*  SECTION 2  */}
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
                  <a href='wa.me/087817503128' target='_blank' rel='noreferrer'>
                    <Typography
                      variant='title'
                      className='mr-4 bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
                    >
                      {' '}
                      <FaWhatsapp className='inline text-[#681819]' />{' '}
                      087817503128 (Fikri)
                    </Typography>
                  </a>
                  <a href='wa.me/085239204463' target='_blank' rel='noreferrer'>
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
                className='mb-2 text-center bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
              >
                Scan to Donate
              </Typography>
              <NextImage
                src='/images/infaq/qris.png'
                alt='QRIS Donasi'
                width={360}
                height={480}
                className='w-full max-w-sm'
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
