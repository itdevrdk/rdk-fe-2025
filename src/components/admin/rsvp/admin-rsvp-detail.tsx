'use client';

import * as React from 'react';

import { useGetRsvpDetail } from '@/hooks/useRsvpAdmin';

import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Typography from '@/components/Typography';

type AdminRsvpDetailProps = {
  isOpen: boolean;
  onClose: () => void;
  code: string | null;
};

export default function AdminRsvpDetail({
  isOpen,
  onClose,
  code,
}: AdminRsvpDetailProps) {
  const { data, isLoading } = useGetRsvpDetail(code);
  const detail = data?.data;

  // Function to determine grid columns based on content length
  const getGridClass = () => {
    return 'grid grid-cols-1 md:grid-cols-2 gap-4';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Detail Pendaftar'>
      {isLoading ? (
        <div className='flex justify-center p-8'>
          <Loading />
        </div>
      ) : detail ? (
        <div className='space-y-6'>
          {/* Header Info */}
          <div className='border-b border-gray-200 pb-4'>
            <Typography variant='h5' className='font-bold text-gray-900'>
              {detail.fullname}
            </Typography>
            <div className='mt-1 flex flex-wrap gap-2 text-sm text-gray-500'>
              <span className='rounded bg-blue-50 px-2 py-1 text-blue-700 font-medium'>
                {detail.code}
              </span>
              <span
                className={`rounded px-2 py-1 font-medium ${
                  detail.status === 'joined'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {detail.status === 'joined' ? 'Hadir' : 'Terdaftar'}
              </span>
            </div>
            <Typography variant='body' className='mt-2 text-gray-600 italic'>
              {detail.event_name} • ID: {detail.rsvp_id}
            </Typography>
          </div>

          {/* Details Grid */}
          <div className={getGridClass()}>
            <div className='space-y-1'>
              <Typography variant='label' className='text-gray-500'>
                Institusi / Asal
              </Typography>
              <Typography variant='body' className='font-medium text-gray-900'>
                {detail.institution || '-'}
              </Typography>
            </div>

            <div className='space-y-1'>
              <Typography variant='label' className='text-gray-500'>
                Provinsi
              </Typography>
              <Typography variant='body' className='font-medium text-gray-900'>
                {detail.province || '-'}
              </Typography>
            </div>

            <div className='space-y-1'>
              <Typography variant='label' className='text-gray-500'>
                Kota / Kabupaten
              </Typography>
              <Typography variant='body' className='font-medium text-gray-900'>
                {detail.city || '-'}
              </Typography>
            </div>

            {/* Add more fields here as generic RSVP expands (email, etc if available in response) */}
          </div>
        </div>
      ) : (
        <div className='p-4 text-center text-gray-500'>
          Data tidak ditemukan
        </div>
      )}
    </Modal>
  );
}
