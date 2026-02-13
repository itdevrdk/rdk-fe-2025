import { Metadata } from 'next';
import * as React from 'react';

import AdminNuzululQuranCheck from '@/components/admin/nuzulul-quran/admin-nuzulul-quran-check';
import Typography from '@/components/Typography';

export const metadata: Metadata = {
  title: 'Check RSVP Nuzulul Quran',
};

export default function NuzululQuranCheckPage() {
  return (
    <section>
      <div className='mb-6 flex items-center justify-between'>
        <Typography variant='h4' className='font-bold text-gray-900'>
          Check RSVP Nuzulul Quran
        </Typography>
      </div>

      <AdminNuzululQuranCheck />
    </section>
  );
}
