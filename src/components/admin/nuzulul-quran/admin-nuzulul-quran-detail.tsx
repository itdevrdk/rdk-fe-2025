'use client';

import { Dialog, Transition } from '@headlessui/react';
import { UserCheck, X } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import {
  useGetNuzululQuranDetail,
  useUpdateNuzululQuranStatus,
} from '@/hooks/useNuzululQuranAdmin';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

interface AdminNuzululQuranDetailProps {
  isOpen: boolean;
  onClose: () => void;
  code: string | null;
}

export default function AdminNuzululQuranDetail({
  isOpen,
  onClose,
  code,
}: AdminNuzululQuranDetailProps) {
  const { data, isLoading } = useGetNuzululQuranDetail(code);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateNuzululQuranStatus();

  const handleCheckIn = () => {
    if (!code) return;
    updateStatus(
      { code, status: 'joined' },
      {
        onSuccess: () => {
          toast.success('Berhasil check-in peserta');
          onClose(); // Optional: close modal on success
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Gagal update status');
        },
      },
    );
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={React.Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Detail Peserta
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className='rounded-full p-1 hover:bg-gray-100'
                  >
                    <X size={20} className='text-gray-500' />
                  </button>
                </div>

                {isLoading ? (
                  <div className='flex justify-center py-8'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-100 border-t-transparent'></div>
                  </div>
                ) : data?.data ? (
                  <div className='mt-4 space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Typography variant='label' className='text-gray-500'>
                          Nama Lengkap
                        </Typography>
                        <Typography
                          variant='body'
                          weight='medium'
                          className='text-base'
                        >
                          {data.data.fullname}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant='label' className='text-gray-500'>
                          Kode
                        </Typography>
                        <Typography
                          variant='body'
                          weight='medium'
                          className='text-base'
                        >
                          {data.data.code}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant='label' className='text-gray-500'>
                          Instansi
                        </Typography>
                        <Typography
                          variant='body'
                          weight='medium'
                          className='text-base'
                        >
                          {data.data.institution}
                        </Typography>
                      </div>

                      <div>
                        <Typography variant='label' className='text-gray-500'>
                          Kota/Kabupaten
                        </Typography>
                        <Typography
                          variant='body'
                          weight='medium'
                          className='text-base'
                        >
                          {data.data.city}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant='label' className='text-gray-500'>
                          Provinsi
                        </Typography>
                        <Typography
                          variant='body'
                          weight='medium'
                          className='text-base'
                        >
                          {data.data.province}
                        </Typography>
                      </div>
                    </div>

                    <div className='rounded-lg bg-gray-50 p-3'>
                      <Typography variant='label' className='text-gray-500'>
                        Status
                      </Typography>
                      <div className='flex items-center gap-2 mt-1'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            data.data.status === 'joined'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {data.data.status === 'joined'
                            ? 'Hadir'
                            : 'Terdaftar'}
                        </span>
                      </div>
                    </div>

                    <div className='mt-6 grid grid-cols-2 gap-3'>
                      <Button
                        variant='outline'
                        onClick={onClose}
                        className='w-full justify-center'
                      >
                        Tutup
                      </Button>
                      {data.data.status !== 'joined' && (
                        <Button
                          onClick={handleCheckIn}
                          isLoading={isUpdating}
                          leftIcon={UserCheck}
                          className='w-full justify-center'
                        >
                          Check In
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='py-8 text-center text-gray-500'>
                    Data tidak ditemukan
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
