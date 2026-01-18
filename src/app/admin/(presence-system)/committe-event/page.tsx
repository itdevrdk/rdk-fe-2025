'use client';

import { Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import CommitteeEventModal from '@/components/admin/CommitteeEventModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import { DANGER_TOAST, SUCCESS_TOAST } from '@/components/Toast';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import {
  useCreateCommitteeEvent,
  useDeleteCommitteeEvent,
  useGetCommitteeEvents,
  useUpdateCommitteeEvent,
} from '../hook/useCommitteeEvent';
import { useGetMe } from '../../hook/getMe';

import {
  CommitteeEvent,
  CreateCommitteeEventForm,
} from '@/types/entities/presence';

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

export default function CommitteeEventPage() {
  // State for search
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>(
    'create',
  );
  const [selectedData, setSelectedData] = React.useState<CommitteeEvent | null>(
    null,
  );

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<CommitteeEvent | null>(
    null,
  );

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // API Hooks - Using React Query
  const { data: eventsData, isLoading: isListLoading } = useGetCommitteeEvents({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
  });

  // Mutations
  const createMutation = useCreateCommitteeEvent();
  const updateMutation = useUpdateCommitteeEvent();
  const deleteMutation = useDeleteCommitteeEvent();

  // Extract data from response
  const events = React.useMemo(
    () => eventsData?.data || [],
    [eventsData?.data],
  );
  const meta = eventsData?.meta;
  const totalPages = meta?.total_page || 1;

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Handlers
  const handleCreate = () => {
    setSelectedData(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEdit = (item: CommitteeEvent) => {
    setSelectedData(item);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleView = (item: CommitteeEvent) => {
    setSelectedData(item);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = (item: CommitteeEvent) => {
    setDeleteTarget(item);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedData(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleSubmit = async (formData: CreateCommitteeEventForm) => {
    try {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(formData);
        toast('Event berhasil ditambahkan', SUCCESS_TOAST);
      } else if (modalMode === 'edit' && selectedData) {
        await updateMutation.mutateAsync({
          id: selectedData.id,
          data: formData,
        });
        toast('Event berhasil diperbarui', SUCCESS_TOAST);
      }
      handleModalClose();
    } catch {
      toast('Terjadi kesalahan', DANGER_TOAST);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast('Event berhasil dihapus', SUCCESS_TOAST);
      handleDeleteModalClose();
    } catch {
      toast('Terjadi kesalahan saat menghapus', DANGER_TOAST);
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      dateStyle: 'medium',
    });
  };

  // Table columns
  const columns: TableColumn<CommitteeEvent>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-16',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'name',
      header: 'Nama Event',
    },
    {
      key: 'timestamp',
      header: 'Tanggal',
      render: (item) => formatDate(item.timestamp),
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
            onClick={() => handleEdit(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Edit'
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Delete'
          >
            <Trash2 size={16} />
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
        Data Event
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
          Tambah Event
        </Button>

        {/* Search */}
        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari nama event...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
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
            placeholder='Cari nama event...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Add Button */}
        <Button variant='primary' leftIcon={Plus} onClick={handleCreate}>
          Tambah Event
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={events}
        isLoading={isListLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage='Tidak ada data event'
      />

      {/* Create/Edit/View Modal */}
      <CommitteeEventModal
        isOpen={modalOpen}
        closeModal={handleModalClose}
        isEdit={modalMode === 'edit'}
        isView={modalMode === 'view'}
        data={selectedData}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title='Hapus Event'
        message={`Apakah Anda yakin ingin menghapus event "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </AdminSidebar>
  );
}
