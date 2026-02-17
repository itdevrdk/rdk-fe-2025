'use client';

import { Search, Trash2, UserCheck } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { useGetRsvpDetail, useUpdateRsvpStatus } from '@/hooks/useRsvpAdmin';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

// Static list of event names
const EVENT_NAMES = [
  'Nuzulul Quran',
  'Ngabuburits #1',
  'Ngabuburits #2',
  'Ngabuburits #3',
  'Ngabuburits #4',
  'Simposium Ramadan #1',
  'Simposium Ramadan #2',
  'Lailatul Hikmah',
  'HOMe (Heart Of Muslimah)',
];

export default function AdminRsvpCheck() {
  const [code, setCode] = React.useState('');
  const [searchTrigger, setSearchTrigger] = React.useState<string | null>(null);

  // Event Selection State
  const [selectedEventName, setSelectedEventName] = React.useState<string>('');

  // When searchTrigger is set, we fetch the data
  // Note: getRsvpDetail fetches only by code. It returns the data regardless of event.
  // However, we might want to verify if the fetched RSVP belongs to the selected event.
  const { data, isLoading, isError } = useGetRsvpDetail(searchTrigger);

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateRsvpStatus();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSearchTrigger(code);
  };

  const handleCheckIn = () => {
    if (!data?.data?.code) return;

    // Verify event match
    // Verify event match only if a specific event is selected
    if (selectedEventName && data.data.event_name !== selectedEventName) {
      toast.error(
        `Kode ini terdaftar untuk event "${data.data.event_name}", bukan "${selectedEventName}"`,
      );
      return;
    }

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
    <div className='mx-auto w-full'>
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <Typography variant='h4' className='mb-6 font-bold text-gray-900'>
          Check In Peserta
        </Typography>

        {/* Event Selector */}
        <div className='mb-6'>
          <label
            htmlFor='event-select'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Pilih Event untuk Check-In
          </label>
          <select
            id='event-select'
            className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100'
            value={selectedEventName}
            onChange={(e) => {
              setSelectedEventName(e.target.value);
              // Clear search results when switching event
              setSearchTrigger(null);
              setCode('');
            }}
          >
            <option value=''>Semua Event (Pencarian Global)</option>
            {EVENT_NAMES.map((eventName) => (
              <option key={eventName} value={eventName}>
                {eventName}
              </option>
            ))}
          </select>
          <p className='text-xs text-gray-500 mt-1'>
            Pastikan Anda memilih event yang benar sebelum melakukan check-in.
          </p>
        </div>

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
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setCode('');
                setSearchTrigger(null);
              }}
              disabled={!code && !searchTrigger}
              className='px-3'
            >
              <Trash2 size={20} />
            </Button>
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
            {/* Verification Warning if Event doesn't match */}
            {selectedEventName &&
              data.data.event_name !== selectedEventName && (
                <div
                  className='mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded'
                  role='alert'
                >
                  <p className='font-bold'>Peringatan Event Tidak Cocok!</p>
                  <p>
                    Kode ini terdaftar untuk "
                    <strong>{data.data.event_name}</strong>", tetapi Anda sedang
                    memeriksa untuk "<strong>{selectedEventName}</strong>".
                  </p>
                </div>
              )}

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
            <div className='border-t border-gray-200 py-4'>
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
                  disabled={
                    !!selectedEventName &&
                    data.data.event_name !== selectedEventName
                  }
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
