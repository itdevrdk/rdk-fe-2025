'use client';

import { Eye, Search } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
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

import { useGetMe } from '@/app/admin/hook/getMe';
import {
  useGetSuggestions,
  useUpdateSuggestionStatus,
} from '@/app/admin/suggestions/hook/useSuggestion';

import {
  Suggestion,
  SuggestionQuery,
  SuggestionStatus,
} from '@/types/entities/suggestion';

const statusColors: Record<SuggestionStatus, string> = {
  [SuggestionStatus.NEW]: 'bg-blue-100 text-blue-700',
  [SuggestionStatus.READ]: 'bg-yellow-100 text-yellow-700',
  [SuggestionStatus.SOLVED]: 'bg-green-100 text-green-700',
};

import SuggestionModal from '@/components/admin/SuggestionModal';

// Type for table data with id field added
type SuggestionTableData = Suggestion & { id: string };

export default function AdminSuggestionsPage() {
  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    React.useState<SuggestionTableData | null>(null);

  // Build query params
  const queryParams: SuggestionQuery = React.useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined,
      status:
        statusFilter !== 'all' ? (statusFilter as SuggestionStatus) : undefined,
    }),
    [currentPage, searchQuery, statusFilter],
  );

  // Data fetching
  const {
    data: suggestionsData,
    isLoading,
    isError,
  } = useGetSuggestions(queryParams);
  const { user, isLoading: isUserLoading } = useGetMe();
  const updateStatusMutation = useUpdateSuggestionStatus();

  const rawData = suggestionsData?.data ?? [];
  const data = rawData.map((item) => ({ ...item, id: item.suggestion_id }));
  const totalPages = suggestionsData?.meta?.total_page ?? 1;

  // Handlers
  const handleStatusChange = async (
    id: string,
    newStatus: SuggestionStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        data: { status: newStatus },
      });
      toast('Status berhasil diperbarui', SUCCESS_TOAST);
    } catch (error) {
      toast('Gagal memperbarui status', DANGER_TOAST);
    }
  };

  const handleViewDetail = (item: SuggestionTableData) => {
    setSelectedSuggestion(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleModalStatusUpdate = async (
    id: string,
    newStatus: SuggestionStatus,
  ) => {
    await handleStatusChange(id, newStatus);
    handleModalClose();
  };

  // Columns
  const columns: TableColumn<SuggestionTableData>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-12',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'name',
      header: 'Nama',
      className: 'w-48',
      render: (item) => <span className='font-medium'>{item.name}</span>,
    },
    {
      key: 'suggestion',
      header: 'Isi Masukan',
      render: (item) => (
        <p
          className='line-clamp-2 text-sm text-gray-600'
          title={item.suggestion}
        >
          {item.suggestion}
        </p>
      ),
    },
    {
      key: 'timestamp',
      header: 'Tanggal',
      className: 'w-40',
      render: (item) => (
        <span className='text-sm text-gray-500'>
          {new Date(item.timestamp).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-40',
      render: (item) => (
        <Select
          defaultValue={item.status}
          onValueChange={(val) =>
            handleStatusChange(item.suggestion_id, val as SuggestionStatus)
          }
          disabled={updateStatusMutation.isPending}
        >
          <SelectTrigger
            className={cn(
              'h-8 w-32 border-none text-xs font-medium',
              statusColors[item.status as SuggestionStatus],
            )}
          >
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SuggestionStatus.NEW}>Baru</SelectItem>
            <SelectItem value={SuggestionStatus.READ}>Dibaca</SelectItem>
            <SelectItem value={SuggestionStatus.SOLVED}>Selesai</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-20',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleViewDetail(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Lihat detail'
            title='Lihat detail'
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (isUserLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminSidebar user={user}>
      <Typography
        as='h1'
        font='marquisette'
        variant='h4'
        className='mb-6 text-primary-100'
      >
        Kotak Saran
      </Typography>

      {/* Toolbar */}
      <div className='mb-4 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
        {/* Search */}
        <div className='relative w-full max-w-md'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari nama atau isi saran...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className='pl-10'
          />
        </div>

        {/* Filter */}
        <div className='w-full lg:w-auto'>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-full lg:w-[180px]'>
              <SelectValue placeholder='Filter Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Status</SelectItem>
              <SelectItem value={SuggestionStatus.NEW}>Baru</SelectItem>
              <SelectItem value={SuggestionStatus.READ}>Dibaca</SelectItem>
              <SelectItem value={SuggestionStatus.SOLVED}>Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage={isError ? 'Gagal memuat data.' : 'Belum ada masukan.'}
      />

      <SuggestionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        data={selectedSuggestion}
        onUpdateStatus={handleModalStatusUpdate}
        isLoading={updateStatusMutation.isPending}
      />
    </AdminSidebar>
  );
}
