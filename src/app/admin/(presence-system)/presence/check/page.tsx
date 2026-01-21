'use client';

import { CheckCircle, Search, XCircle } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import { DANGER_TOAST, SUCCESS_TOAST } from '@/components/Toast';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useCheckPresence,
  useGetEventsForDropdown,
  useSetPresenceStatus,
} from '../../hook/usePresence';
import { useGetMe } from '../../../hook/getMe';

import {
  CheckPresenceResponse,
  PresenceStatus,
} from '@/types/entities/presence';

export default function CheckPresencePage() {
  // Form state
  const [identifier, setIdentifier] = React.useState('');
  const [selectedEventId, setSelectedEventId] = React.useState<string>('');

  // Result state
  const [checkResult, setCheckResult] =
    React.useState<CheckPresenceResponse | null>(null);
  const [notFound, setNotFound] = React.useState(false);

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // API Hooks - React Query
  const { data: events } = useGetEventsForDropdown();
  const checkMutation = useCheckPresence();
  const setStatusMutation = useSetPresenceStatus();

  // Auto-select first event when events load
  React.useEffect(() => {
    if (events && events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  // Handle check button
  const handleCheck = async () => {
    if (!identifier.trim()) {
      toast('Masukkan nama lengkap atau NRP', DANGER_TOAST);
      return;
    }

    if (!selectedEventId) {
      toast('Pilih event terlebih dahulu', DANGER_TOAST);
      return;
    }

    setNotFound(false);
    setCheckResult(null);

    try {
      const result = await checkMutation.mutateAsync({
        identifier: identifier.trim(),
        event_id: selectedEventId,
      });

      setCheckResult(result);
      setNotFound(false);
    } catch {
      setCheckResult(null);
      setNotFound(true);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (status: PresenceStatus) => {
    if (!checkResult) return;

    try {
      const result = await setStatusMutation.mutateAsync({
        committee_id: checkResult.committee.id,
        event_id: checkResult.committee_event.id,
        status,
      });

      // Update local state with new presence
      if (result.data) {
        setCheckResult({
          ...checkResult,
          presence: {
            id: result.data.id,
            status: result.data.status,
            timestamp: result.data.timestamp,
          },
        });
      }

      const statusText =
        status === 'attend'
          ? 'Hadir'
          : status === 'permit'
            ? 'Izin'
            : 'Tidak Hadir';

      toast(`Status berhasil diubah menjadi ${statusText}`, SUCCESS_TOAST);
    } catch {
      toast('Gagal mengubah status', DANGER_TOAST);
    }
  };

  // Handle reset/clear
  const handleClear = () => {
    setIdentifier('');
    setSelectedEventId('');
    setCheckResult(null);
    setNotFound(false);
  };

  // Loading state
  if (isUserLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  // Error state
  if (isError || !user) {
    return null;
  }

  return (
    <AdminSidebar user={user}>
      {/* Page Title */}
      <Typography
        as='h1'
        font='marquisette'
        variant='h4'
        className='mb-6 text-primary-100'
      >
        Check Presensi
      </Typography>

      {/* Search Form */}
      <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6'>
        <Typography
          as='h2'
          font='zabal'
          weight='bold'
          className='mb-4 text-lg text-gray-900'
        >
          Cari Panitia
        </Typography>

        <div className='flex flex-col gap-4 lg:flex-row lg:items-end'>
          {/* Identifier Input */}
          <div className='flex-1'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Nama Lengkap atau NRP
            </label>
            <div className='relative'>
              <Search
                size={18}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              />
              <Input
                placeholder='Masukkan nama lengkap atau NRP...'
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className='pl-10'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCheck();
                  }
                }}
              />
            </div>
          </div>

          {/* Event Select */}
          <div className='lg:w-64'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Event
            </label>
            <Select
              value={selectedEventId}
              onValueChange={(value) => setSelectedEventId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Pilih event' />
              </SelectTrigger>
              <SelectContent>
                {events?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className='flex gap-2'>
            <Button
              variant='primary'
              onClick={handleCheck}
              isLoading={checkMutation.isPending}
              leftIcon={Search}
            >
              Check
            </Button>
            <Button variant='outline' onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Not Found Message */}
      {notFound && (
        <div className='mb-8 rounded-lg border border-orange-200 bg-orange-50 p-6 text-center'>
          <Typography
            as='p'
            font='zabal'
            weight='medium'
            className='text-orange-700'
          >
            Data tidak ditemukan. Pastikan nama lengkap atau NRP yang dimasukkan
            sudah benar.
          </Typography>
        </div>
      )}

      {/* Result Card */}
      {checkResult && (
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          {/* Committee Info */}
          <div className='mb-6 border-b border-gray-200 pb-6'>
            <Typography
              as='h3'
              font='zabal'
              weight='bold'
              className='mb-4 text-lg text-gray-900'
            >
              Data Panitia
            </Typography>
            <div className='grid gap-4 sm:grid-cols-3'>
              <div>
                <Typography
                  as='p'
                  font='zabal'
                  className='text-sm text-gray-500'
                >
                  Nama Lengkap
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  weight='medium'
                  className='text-gray-900'
                >
                  {checkResult.committee.fullname}
                </Typography>
              </div>
              <div>
                <Typography
                  as='p'
                  font='zabal'
                  className='text-sm text-gray-500'
                >
                  NRP
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  weight='medium'
                  className='text-gray-900'
                >
                  {checkResult.committee.nrp}
                </Typography>
              </div>
              <div>
                <Typography
                  as='p'
                  font='zabal'
                  className='text-sm text-gray-500'
                >
                  Jurusan
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  weight='medium'
                  className='text-gray-900'
                >
                  {checkResult.committee.major}
                </Typography>
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className='mb-6 border-b border-gray-200 pb-6'>
            <Typography
              as='h3'
              font='zabal'
              weight='bold'
              className='mb-4 text-lg text-gray-900'
            >
              Event
            </Typography>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <Typography
                  as='p'
                  font='zabal'
                  className='text-sm text-gray-500'
                >
                  Nama Event
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  weight='medium'
                  className='text-gray-900'
                >
                  {checkResult.committee_event.name}
                </Typography>
              </div>
              <div>
                <Typography
                  as='p'
                  font='zabal'
                  className='text-sm text-gray-500'
                >
                  Tanggal
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  weight='medium'
                  className='text-gray-900'
                >
                  {new Date(
                    checkResult.committee_event.timestamp,
                  ).toLocaleDateString('id-ID', {
                    dateStyle: 'full',
                  })}
                </Typography>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className='mb-6'>
            <Typography
              as='h3'
              font='zabal'
              weight='bold'
              className='mb-4 text-lg text-gray-900'
            >
              Status Presensi
            </Typography>
            <div className='flex items-center gap-4'>
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                  checkResult.presence
                    ? checkResult.presence.status === 'attend'
                      ? 'bg-green-100 text-green-700'
                      : checkResult.presence.status === 'permit'
                        ? 'bg-yellow-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600',
                )}
              >
                {checkResult.presence ? (
                  checkResult.presence.status === 'attend' ? (
                    <>
                      <CheckCircle size={16} />
                      Hadir
                    </>
                  ) : checkResult.presence.status === 'permit' ? (
                    <>
                      <CheckCircle size={16} />
                      Izin
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Tidak Hadir
                    </>
                  )
                ) : (
                  'Belum Presensi'
                )}
              </span>
            </div>
          </div>

          {/* Update Status Buttons */}
          <div>
            <Typography
              as='h3'
              font='zabal'
              weight='bold'
              className='mb-4 text-lg text-gray-900'
            >
              Ubah Status
            </Typography>
            <div className='flex flex-wrap gap-3'>
              <Button
                variant='primary'
                leftIcon={CheckCircle}
                onClick={() => handleUpdateStatus('attend')}
                isLoading={setStatusMutation.isPending}
                className={cn(
                  'bg-green-600 hover:bg-green-700',
                  checkResult.presence?.status === 'attend' &&
                    'ring-2 ring-green-300 ring-offset-2',
                )}
              >
                Hadir
              </Button>
              <Button
                variant='primary'
                leftIcon={CheckCircle}
                onClick={() => handleUpdateStatus('permit')}
                isLoading={setStatusMutation.isPending}
                className={cn(
                  'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
                  checkResult.presence?.status === 'permit' &&
                    'ring-2 ring-yellow-300 ring-offset-2',
                )}
              >
                Izin
              </Button>
              <Button
                variant='primary'
                leftIcon={XCircle}
                onClick={() => handleUpdateStatus('skip')}
                isLoading={setStatusMutation.isPending}
                className={cn(
                  'bg-red-600 hover:bg-red-700',
                  checkResult.presence?.status === 'skip' &&
                    'ring-2 ring-red-300 ring-offset-2',
                )}
              >
                Tidak Hadir
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}
