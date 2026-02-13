import { Metadata } from 'next';
import * as React from 'react';

import AdminNuzululQuranData from '@/components/admin/nuzulul-quran/admin-nuzulul-quran-data';
import Typography from '@/components/Typography';

export const metadata: Metadata = {
  title: 'Data RSVP Nuzulul Quran',
};

export default function NuzululQuranAdminPage() {
  return (
    <section>
      <div className='mb-6 flex items-center justify-between'>
        <Typography variant='h4' className='font-bold text-gray-900'>
          Data Pendaftar Nuzulul Quran
        </Typography>
      </div>

      <AdminNuzululQuranData />
    </section>
  );
}
