'use client';

import { Download, Eye, Search } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import KhatamanModal from '@/components/admin/KhatamanModal';
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
  useExportKhatamanParticipants,
  useGetKhatamanParticipantDetail,
  useGetKhatamanParticipants,
  useUpdateKhatamanStatus,
} from './hook/useKhatamanAkbarAdmin';
import { useGetMe } from '../../hook/getMe';

import {
  KhatamanParticipant,
  KhatamanParticipantType,
  KhatamanRegistrationStatus,
  KhatamanStatusUpdatePayload,
} from '@/types/entities/khataman';

// Constant for the event code as required
const EVENT_CODE = 'KHATAMAN_AKBAR_47';

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

export default function AdminKhatamanPage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<
    KhatamanRegistrationStatus | 'all'
  >('all');
  const [typeFilter, setTypeFilter] = React.useState<
    KhatamanParticipantType | 'all'
  >('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // API Hooks
  const {
    data: registrationsData,
    isLoading: isListLoading,
    isError: isListError,
    refetch: refetchList,
  } = useGetKhatamanParticipants({
    event_code: EVENT_CODE,
    page: currentPage,
    per_page: itemsPerPage,
    search: debouncedSearch || undefined,
    registration_status: statusFilter,
    participant_type: typeFilter,
  });

  // Fetch detail when viewing
  const { data: detailData, isLoading: isDetailLoading } =
    useGetKhatamanParticipantDetail(modalOpen ? selectedId : null);

  // Update Status Mutation
  const updateMutation = useUpdateKhatamanStatus();

  // Export Mutation
  const exportMutation = useExportKhatamanParticipants();

  // Extract data from response
  const registrations = React.useMemo(
    () => registrationsData?.data?.items || [],
    [registrationsData?.data],
  );

  const meta = registrationsData?.data?.pagination;
  const totalPages = meta?.total_page || 1;

  // Get selected data for modal (from detail or list fallback)
  const selectedData = React.useMemo(() => {
    if (detailData?.data) {
      return detailData.data;
    }
    if (selectedId) {
      return registrations.find((r) => r.id === selectedId) || null;
    }
    return null;
  }, [detailData, selectedId, registrations]);

  // Reset to page 1 when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, typeFilter]);

  // Handlers
  const handleView = (item: KhatamanParticipant) => {
    setSelectedId(item.id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  const handleStatusUpdate = async (payload: KhatamanStatusUpdatePayload) => {
    if (!selectedId) return;

    try {
      await updateMutation.mutateAsync({ id: selectedId, payload });
      toast('Status peserta berhasil diperbarui', SUCCESS_TOAST);
      handleModalClose();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Terjadi kesalahan saa memperbarui status';
      toast(errorMessage, DANGER_TOAST);
    }
  };

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync({
        event_code: EVENT_CODE,
        search: debouncedSearch,
        registration_status: statusFilter,
        participant_type: typeFilter,
      });
      toast('Berhasil memulai download', SUCCESS_TOAST);
    } catch (error) {
      toast('Gagal mengunduh data', DANGER_TOAST);
    }
  };

  // Table columns
  const columns: TableColumn<KhatamanParticipant>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-16',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'full_name',
      header: 'Nama Lengkap',
    },
    {
      key: 'participant_type',
      header: 'Tipe',
      render: (item) => (
        <span
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
            item.participant_type === 'ITS'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-orange-100 text-orange-700',
          )}
        >
          {item.participant_type}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'No. WA',
      className: 'hidden md:table-cell',
    },
    {
      key: 'commitment_level',
      header: 'Komitmen',
      className: 'hidden lg:table-cell',
      render: (item) => (
        <span className='text-sm'>
          {item.commitment_level === 'SIAP'
            ? 'Siap'
            : item.commitment_level === 'DIUSAHAKAN'
              ? 'Diusahakan'
              : 'Tidak Siap'}
        </span>
      ),
    },
    {
      key: 'registration_status',
      header: 'Status',
      render: (item) => {
        const status = item.registration_status;
        return (
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-xs font-medium',
              status === 'SELECTED'
                ? 'bg-green-100 text-green-700'
                : status === 'REJECTED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700',
            )}
          >
            {status === 'SELECTED'
              ? 'Terpilih'
              : status === 'REJECTED'
                ? 'Ditolak'
                : 'Terdaftar'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-20',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleView(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Lihat detail'
            title='Lihat detail & Update Status'
          >
            <Eye size={16} />
          </button>
        </div>
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
      {/* Page Title */}
      <Typography
        as='h1'
        font='marquisette'
        variant='h4'
        className='mb-6 text-primary-100'
      >
        Manajemen Peserta Khataman Akbar
      </Typography>

      <div className='flex justify-end mb-4'>
        <Button
          onClick={handleExport}
          isLoading={exportMutation.isPending}
          leftIcon={Download}
        >
          Export CSV
        </Button>
      </div>

      {/* Toolbar */}
      <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        {/* Search */}
        <div className='relative w-full lg:max-w-md'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari nama atau email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
          {/* Filter Type */}
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value as KhatamanParticipantType | 'all');
            }}
          >
            <SelectTrigger className='w-full sm:w-[150px]'>
              <SelectValue placeholder='Tipe Peserta' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Tipe</SelectItem>
              <SelectItem value='ITS'>ITS</SelectItem>
              <SelectItem value='UMUM'>UMUM</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Status */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as KhatamanRegistrationStatus | 'all');
            }}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Status Registrasi' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Status</SelectItem>
              <SelectItem value='REGISTERED'>Terdaftar</SelectItem>
              <SelectItem value='SELECTED'>Terpilih</SelectItem>
              <SelectItem value='REJECTED'>Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error State */}
      {isListError && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
          <p className='text-red-600'>
            Gagal memuat data peserta. Silakan coba lagi.
          </p>
          <Button
            variant='outline'
            className='mt-2'
            onClick={() => refetchList()}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Table */}
      <AdminTable
        columns={columns}
        data={registrations}
        isLoading={isListLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage='Tidak ada data peserta ditemukan'
      />

      {/* Detail & Update Modal */}
      <KhatamanModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        data={selectedData}
        onUpdateStatus={handleStatusUpdate}
        isLoading={updateMutation.isPending || isDetailLoading}
      />
    </AdminSidebar>
  );
}
