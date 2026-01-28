'use client';

import {
  Download,
  Edit2,
  Eye,
  FileSpreadsheet,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import RicModal from '@/components/admin/RicModal';
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
  useCreateRicRegistration,
  useDeleteRicRegistration,
  useExportRicExcel,
  useExportRicPdf,
  useGetRicRegistrationDetail,
  useGetRicRegistrations,
  useUpdateRicRegistration,
} from './hook/useRicAdmin';
import { useGetMe } from '../../hook/getMe';

import {
  RicRegistration,
  RicRegistrationFormData,
  RicRegistrationStatus,
} from '@/types/entities/ric-admin';

const eventTypeLabels: Record<string, string> = {
  MHQ: 'Musabaqah Hifdzil Quran',
  MTQ: 'Musabaqah Tilawatil Quran',
  DAI: "Da'i",
  KTIQ: 'Karya Tulis Ilmiah Quran',
  POSTER: 'Poster',
  VIDEOGRAFI: 'Videografi',
};

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

export default function AdminRicPage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<
    RicRegistrationStatus | 'all'
  >('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>(
    'create',
  );
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] =
    React.useState<RicRegistration | null>(null);

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // API Hooks
  const {
    data: registrationsData,
    isLoading: isListLoading,
    isError: isListError,
    refetch: refetchList,
  } = useGetRicRegistrations({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
    status: statusFilter,
  });

  // Fetch detail when viewing/editing
  const { data: detailData, isLoading: isDetailLoading } =
    useGetRicRegistrationDetail(
      modalOpen && (modalMode === 'view' || modalMode === 'edit')
        ? selectedId
        : null,
    );

  // Mutations
  const createMutation = useCreateRicRegistration();
  const updateMutation = useUpdateRicRegistration();
  const deleteMutation = useDeleteRicRegistration();
  const exportPdfMutation = useExportRicPdf();
  const exportExcelMutation = useExportRicExcel();

  // Extract data from response
  const registrations = React.useMemo(
    () => registrationsData?.data || [],
    [registrationsData?.data],
  );
  const meta = registrationsData?.meta;
  const totalPages = meta?.total_page || 1;

  // Get selected data for modal (from detail or list)
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
  }, [debouncedSearch, statusFilter]);

  // Handlers
  const handleCreate = () => {
    setSelectedId(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEdit = (item: RicRegistration) => {
    setSelectedId(item.id);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleView = (item: RicRegistration) => {
    setSelectedId(item.id);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = (item: RicRegistration) => {
    setDeleteTarget(item);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleSubmit = async (formData: RicRegistrationFormData) => {
    try {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(formData);
        toast('Pendaftaran berhasil ditambahkan', SUCCESS_TOAST);
      } else if (modalMode === 'edit' && selectedId) {
        await updateMutation.mutateAsync({ id: selectedId, data: formData });
        toast('Pendaftaran berhasil diperbarui', SUCCESS_TOAST);
      }
      handleModalClose();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Terjadi kesalahan';
      toast(errorMessage, DANGER_TOAST);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast('Pendaftaran berhasil dihapus', SUCCESS_TOAST);
      handleDeleteModalClose();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Terjadi kesalahan saat menghapus';
      toast(errorMessage, DANGER_TOAST);
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportPdfMutation.mutateAsync({
        search: debouncedSearch || undefined,
        status: statusFilter,
      });
      toast('Export PDF berhasil', SUCCESS_TOAST);
    } catch (error) {
      toast('Gagal export PDF', DANGER_TOAST);
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportExcelMutation.mutateAsync({
        search: debouncedSearch || undefined,
        status: statusFilter,
      });
      toast('Export Excel berhasil', SUCCESS_TOAST);
    } catch (error) {
      toast('Gagal export Excel', DANGER_TOAST);
    }
  };

  // Table columns
  const columns: TableColumn<RicRegistration>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-16',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'registration_id',
      header: 'Kode Pendaftaran',
      className: 'hidden md:table-cell',
    },
    {
      key: 'team_name',
      header: 'Nama Tim / Peserta',
      render: (item) => {
        const isIndividual = ['MHQ', 'MTQ', 'DAI', 'POSTER'].includes(
          item.event_type,
        );
        return isIndividual ? item.leader_name || '-' : item.team_name || '-';
      },
    },
    {
      key: 'event_type',
      header: 'Jenis Lomba',
      render: (item) => eventTypeLabels[item.event_type] || item.event_type,
    },
    {
      key: 'institution',
      header: 'Institusi',
      className: 'hidden lg:table-cell',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const statusUpper = item.status?.toUpperCase();
        return (
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-xs font-medium',
              statusUpper === 'VERIFIED'
                ? 'bg-green-100 text-green-700'
                : statusUpper === 'REJECTED'
                  ? 'bg-red-100 text-red-700'
                  : statusUpper === 'REVISION_NEEDED'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700',
            )}
          >
            {statusUpper === 'VERIFIED'
              ? 'Terverifikasi'
              : statusUpper === 'REJECTED'
                ? 'Ditolak'
                : statusUpper === 'REVISION_NEEDED'
                  ? 'Perlu Revisi'
                  : 'Belum Terverifikasi'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-28',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleView(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='View details'
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Delete'
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => handleEdit(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Edit'
          >
            <Edit2 size={16} />
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
        Data Pendaftaran RIC
      </Typography>

      {/* Toolbar - Mobile */}
      <div className='mb-4 flex flex-col gap-3 lg:hidden'>
        {/* Add Button */}
        <Button
          variant='primary'
          leftIcon={Plus}
          onClick={handleCreate}
          className='w-full'
        >
          Tambah
        </Button>

        {/* Export Buttons */}
        <div className='flex gap-2'>
          <Button
            variant='primary'
            leftIcon={Download}
            className='flex-1'
            onClick={handleExportPdf}
            isLoading={exportPdfMutation.isPending}
          >
            Export PDF
          </Button>
          <Button
            variant='primary'
            leftIcon={FileSpreadsheet}
            className='flex-1'
            onClick={handleExportExcel}
            isLoading={exportExcelMutation.isPending}
          >
            Export Excel
          </Button>
        </div>

        {/* Search */}
        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Telusuri nama, email, atau kode registrasi'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as RicRegistrationStatus | 'all');
          }}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Filter' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua Status</SelectItem>
            <SelectItem value='VERIFIED'>Terverifikasi</SelectItem>
            <SelectItem value='UNVERIFIED'>Belum Terverifikasi</SelectItem>
            <SelectItem value='REVISION_NEEDED'>Perlu Revisi</SelectItem>
            <SelectItem value='REJECTED'>Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toolbar - Desktop */}
      <div className='mb-4 hidden items-center justify-between gap-4 lg:flex'>
        {/* Search */}
        <div className='relative flex-1 max-w-md'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Telusuri nama, email, atau kode registrasi'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Right side actions */}
        <div className='flex items-center gap-3'>
          {/* Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as RicRegistrationStatus | 'all');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Filter' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Status</SelectItem>
              <SelectItem value='VERIFIED'>Terverifikasi</SelectItem>
              <SelectItem value='UNVERIFIED'>Belum Terverifikasi</SelectItem>
              <SelectItem value='REVISION_NEEDED'>Perlu Revisi</SelectItem>
              <SelectItem value='REJECTED'>Ditolak</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Button */}
          <Button variant='primary' leftIcon={Plus} onClick={handleCreate}>
            Tambah
          </Button>

          {/* Export Buttons */}
          <Button
            variant='primary'
            leftIcon={Download}
            onClick={handleExportPdf}
            isLoading={exportPdfMutation.isPending}
          >
            Export PDF
          </Button>
          <Button
            variant='primary'
            leftIcon={FileSpreadsheet}
            onClick={handleExportExcel}
            isLoading={exportExcelMutation.isPending}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isListError && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
          <p className='text-red-600'>Gagal memuat data. Silakan coba lagi.</p>
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
        emptyMessage='Tidak ada data pendaftaran'
      />

      {/* Create/Edit/View Modal */}
      <RicModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        data={selectedData}
        onSubmit={handleSubmit}
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending ||
          isDetailLoading
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title='Hapus Pendaftaran'
        message={`Apakah Anda yakin ingin menghapus pendaftaran tim "${deleteTarget?.team_name || deleteTarget?.registration_id}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </AdminSidebar>
  );
}
