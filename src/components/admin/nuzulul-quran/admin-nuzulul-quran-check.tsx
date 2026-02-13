'use client';

import { Search, UserCheck } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import {
  useGetNuzululQuranDetail,
  useUpdateNuzululQuranStatus,
} from '@/hooks/useNuzululQuranAdmin';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

export default function AdminNuzululQuranCheck() {
  const [code, setCode] = React.useState('');
  const [searchTrigger, setSearchTrigger] = React.useState<string | null>(null);

  // When searchTrigger is set, we fetch the data
  const { data, isLoading, isError } = useGetNuzululQuranDetail(searchTrigger);

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateNuzululQuranStatus();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSearchTrigger(code);
  };

  const handleCheckIn = () => {
    if (!data?.data?.code) return;
    updateStatus(
      { code: data.data.code, status: 'joined' },
      {
        onSuccess: () => {
          toast.success('Berhasil check-in peserta');
          // No need to clear search, let them see the updated status
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Gagal update status');
        },
      },
    );
  };

  React.useEffect(() => {
    if (searchTrigger && !isLoading && isError) {
      toast.error('Peserta tidak ditemukan');
      setSearchTrigger(null);
    }
  }, [isError, isLoading, searchTrigger]);

  return (
    <div className='mx-auto max-w-2xl'>
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <Typography variant='h4' className='mb-6 font-bold text-gray-900'>
          Check In Peserta
        </Typography>

        <form onSubmit={handleSearch} className='mb-8'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                className='block w-full rounded-lg border border-gray-300 bg-white p-3 pl-10 text-gray-900 focus:border-primary-100 focus:ring-primary-100'
                placeholder='Masukkan Kode Peserta'
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <Button type='submit' isLoading={isLoading}>
              Cari
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className='flex justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-100 border-t-transparent'></div>
          </div>
        ) : data?.data ? (
          <div className='rounded-lg border border-gray-100 bg-gray-50 p-6'>
            <div className='mb-6 flex items-start justify-between'>
              <div>
                <Typography variant='h5' className='font-bold text-gray-900'>
                  {data.data.fullname}
                </Typography>
                <Typography variant='body' className='text-gray-500'>
                  {data.data.institution}
                </Typography>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  data.data.status === 'joined'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {data.data.status === 'joined' ? 'Hadir' : 'Terdaftar'}
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 border-t border-gray-200 py-4'>
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
                  No. Telepon
                </Typography>
                <Typography
                  variant='body'
                  weight='medium'
                  className='text-base'
                >
                  {data.data.telephone}
                </Typography>
              </div>
            </div>
            <div className='mt-6'>
              {data.data.status === 'joined' ? (
                <div className='flex w-full items-center justify-center gap-2 rounded-lg bg-green-100 p-3 text-green-800'>
                  <UserCheck size={20} />
                  <span className='font-medium'>Peserta Sudah Check In</span>
                </div>
              ) : (
                <Button
                  onClick={handleCheckIn}
                  isLoading={isUpdating}
                  leftIcon={UserCheck}
                  className='w-full justify-center'
                >
                  Konfirmasi Kehadiran
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className='py-8 text-center text-gray-500'>
            Silakan masukkan kode peserta untuk melakukan check-in
          </div>
        )}
      </div>
    </div>
  );
}
