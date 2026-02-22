'use client';

import * as React from 'react';

import AdminFeedbackData from '@/components/admin/feedback/admin-feedback-data';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';

import { useGetMe } from '../hook/getMe';

export default function AdminFeedbackPage() {
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
          Data Feedback
        </Typography>
      </div>

      <AdminFeedbackData />
    </AdminSidebar>
  );
}
