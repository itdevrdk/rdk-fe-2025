'use client';

import * as React from 'react';

import AdminRsvpCheck from '@/components/admin/rsvp/admin-rsvp-check';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';

import { useGetMe } from '../../hook/getMe';

export default function AdminRsvpCheckPage() {
  const { user, isLoading: isUserLoading } = useGetMe();

  if (isUserLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminSidebar user={user}>
      <div className='mb-6 flex items-center justify-between'>
        <Typography variant='h4' className='font-bold text-gray-900'>
          Check In RSVP
        </Typography>
      </div>

      <AdminRsvpCheck />
    </AdminSidebar>
  );
}
