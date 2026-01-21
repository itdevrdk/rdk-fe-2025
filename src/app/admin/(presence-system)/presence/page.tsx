'use client';

import { ArrowLeft, Edit2, Search } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import EditReasonModal from '@/components/admin/EditReasonModal';
import PresenceStatusBadge from '@/components/admin/PresenceStatusBadge';
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
  useGetEventsForDropdown,
  useGetPresences,
  useUpdatePresence,
} from '../hook/usePresence';
import { useGetMe } from '../../hook/getMe';

import { Presence, PresenceStatus } from '@/types/entities/presence';

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function PresencePage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEventId, setSelectedEventId] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal states
  const [editReasonModalOpen, setEditReasonModalOpen] = React.useState(false);
  const [selectedPresence, setSelectedPresence] =
    React.useState<Presence | null>(null);

  // Loading state for mutations
  const [isMutating, setIsMutating] = React.useState(false);

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // Fetch events for dropdown
  const { data: events = [] } = useGetEventsForDropdown();

  // Hooks - Fetch presences list for selected event (paginated for table)
  const {
    data: presencesData,
    refetch,
    isLoading: isPresencesLoading,
  } = useGetPresences({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
    event_id: selectedEventId || undefined,
    status: 'all',
  });

  // Fetch ALL presences for summary counts (without pagination)
  const { data: allPresencesData } = useGetPresences({
    page: 1,
    limit: 10000, // Large limit to get all data
    search: undefined, // No search filter for total counts
    event_id: selectedEventId || undefined,
    status: 'all',
  });

  // Extract data and meta from response (memoized to fix hook dependencies)
  const data = React.useMemo(
    () => presencesData?.data || [],
    [presencesData?.data],
  );
  const meta = presencesData?.meta;

  // Extract all data for counts
  const allData = React.useMemo(
    () => allPresencesData?.data || [],
    [allPresencesData?.data],
  );

  // Mutations
  const updatePresenceMutation = useUpdatePresence();

  const totalPages = meta?.total_page || 1;

  // Calculate summary counts from ALL data (not paginated)
  const totalPresent = React.useMemo(
    () => allData.filter((p) => p.status === 'attend').length,
    [allData],
  );
  const totalAbsent = React.useMemo(
    () => allData.filter((p) => p.status === 'skip').length,
    [allData],
  );

  // Get selected event info
  const selectedEvent = React.useMemo(
    () => events.find((e) => e.id === selectedEventId),
    [events, selectedEventId],
  );

  // Reset to page 1 when search or event changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedEventId]);

  // Auto-select first event if none selected
  React.useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  // Handlers
  const handleEditReason = (item: Presence) => {
    setSelectedPresence(item);
    setEditReasonModalOpen(true);
  };

  const handleStatusChange = async (
    item: Presence,
    newStatus: PresenceStatus,
  ) => {
    try {
      setIsMutating(true);
      await updatePresenceMutation.mutateAsync({
        id: item.id,
        data: { status: newStatus },
      });
      toast('Status presensi berhasil diperbarui', SUCCESS_TOAST);
      refetch();
    } catch {
      toast('Terjadi kesalahan', DANGER_TOAST);
    } finally {
      setIsMutating(false);
    }
  };

  const handleReasonSubmit = async (reason: string) => {
    if (!selectedPresence) return;

    try {
      setIsMutating(true);
      await updatePresenceMutation.mutateAsync({
        id: selectedPresence.id,
        data: { reason },
      });
      toast('Alasan berhasil disimpan', SUCCESS_TOAST);
      setEditReasonModalOpen(false);
      refetch();
    } catch {
      toast('Terjadi kesalahan', DANGER_TOAST);
    } finally {
      setIsMutating(false);
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  // Table columns
  const columns: TableColumn<Presence>[] = [
    {
      key: 'no',
      header: 'NO',
      className: 'w-16',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'name',
      header: 'Nama',
      render: (item) => (
        <div>
          <div className='font-medium'>{item.committee?.fullname || '-'}</div>
          {item.reason && (
            <div className='text-xs text-gray-500 mt-1'>
              Alasan: {item.reason}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'nrp',
      header: 'NRP',
      render: (item) => item.committee?.nrp || '-',
      className: 'hidden md:table-cell',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Select
          value={item.status}
          onValueChange={(value) =>
            handleStatusChange(item, value as PresenceStatus)
          }
          disabled={isMutating}
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue>
              <PresenceStatusBadge status={item.status} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='attend'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 rounded-full bg-green-500'></div>
                <span>Hadir</span>
              </div>
            </SelectItem>
            <SelectItem value='skip'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 rounded-full bg-red-500'></div>
                <span>Tidak Hadir</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'actions',
      header: 'AKSI',
      className: 'w-20',
      render: (item) => (
        <button
          onClick={() => handleEditReason(item)}
          className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 transition-colors'
          aria-label='Edit reason'
        >
          <Edit2 size={16} />
        </button>
      ),
    },
  ];

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
      <div className='space-y-6'>
        {/* Back Button */}
        <Button
          variant='outline'
          leftIcon={ArrowLeft}
          onClick={() => window.history.back()}
          className='mb-4'
        >
          Kembali
        </Button>

        {/* Page Title */}
        <Typography
          as='h1'
          font='marquisette'
          variant='h4'
          className='text-primary-100'
        >
          Sistem Presensi Panitia
        </Typography>

        {/* Event Selector */}
        <div className='flex flex-col sm:flex-row gap-3'>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className='w-full sm:w-[300px]'>
              <SelectValue placeholder='Pilih Event' />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEvent && (
          <>
            {/* Event Information Card */}
            <div className='bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
              <div className='space-y-3'>
                <div>
                  <Typography
                    variant='body'
                    className='text-gray-600 text-sm mb-1'
                  >
                    Nama Event:
                  </Typography>
                  <Typography
                    variant='h6'
                    className='font-semibold text-gray-900'
                  >
                    {selectedEvent.name}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant='body'
                    className='text-gray-600 text-sm mb-1'
                  >
                    Tanggal dan Waktu Pelaksanaan:
                  </Typography>
                  <Typography
                    variant='body'
                    className='font-medium text-gray-800'
                  >
                    {formatDate(selectedEvent.timestamp)}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Present Card */}
              <div className='bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1'>
                <Typography
                  variant='body'
                  className='text-green-700 text-sm mb-2'
                >
                  Hadir
                </Typography>
                <Typography variant='h3' className='font-bold text-green-900'>
                  {totalPresent}
                </Typography>
              </div>

              {/* Absent Card */}
              <div className='bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1'>
                <Typography
                  variant='body'
                  className='text-red-700 text-sm mb-2'
                >
                  Tidak Hadir
                </Typography>
                <Typography variant='h3' className='font-bold text-red-900'>
                  {totalAbsent}
                </Typography>
              </div>
            </div>

            {/* Search Toolbar */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <div className='relative flex-1'>
                <Search
                  size={18}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                />
                <Input
                  placeholder='Telusuri (nama atau NRP)...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            {/* Table */}
            <AdminTable
              columns={columns}
              data={data}
              isLoading={isPresencesLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              emptyMessage='Tidak ada data presensi untuk event ini'
            />
          </>
        )}

        {!selectedEvent && events.length === 0 && (
          <div className='bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center'>
            <Typography variant='body' className='text-yellow-800'>
              Belum ada event yang tersedia. Silakan buat event terlebih dahulu.
            </Typography>
          </div>
        )}
      </div>

      {/* Edit Reason Modal */}
      <EditReasonModal
        isOpen={editReasonModalOpen}
        onClose={() => setEditReasonModalOpen(false)}
        presence={selectedPresence}
        onSubmit={handleReasonSubmit}
        isLoading={isMutating}
      />
    </AdminSidebar>
  );
}
