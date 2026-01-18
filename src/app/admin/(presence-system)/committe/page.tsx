'use client';

import { Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import CommitteeModal from '@/components/admin/CommitteeModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import { DANGER_TOAST, SUCCESS_TOAST } from '@/components/Toast';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import {
  useCreateCommittee,
  useDeleteCommittee,
  useGetCommittees,
  useUpdateCommittee,
} from '../hook/useCommittee';
import { useGetMe } from '../../hook/getMe';

import { Committee, CreateCommitteeForm } from '@/types/entities/presence';

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

export default function CommitteePage() {
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
  const [selectedData, setSelectedData] = React.useState<Committee | null>(
    null,
  );

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Committee | null>(
    null,
  );

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // API Hooks - Using React Query
  const { data: committeesData, isLoading: isListLoading } = useGetCommittees({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
  });

  // Mutations
  const createMutation = useCreateCommittee();
  const updateMutation = useUpdateCommittee();
  const deleteMutation = useDeleteCommittee();

  // Extract data from response
  const committees = React.useMemo(
    () => committeesData?.data || [],
    [committeesData?.data],
  );
  const meta = committeesData?.meta;
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

  const handleEdit = (item: Committee) => {
    setSelectedData(item);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleView = (item: Committee) => {
    setSelectedData(item);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = (item: Committee) => {
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

  const handleSubmit = async (formData: CreateCommitteeForm) => {
    try {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(formData);
        toast('Panitia berhasil ditambahkan', SUCCESS_TOAST);
      } else if (modalMode === 'edit' && selectedData) {
        await updateMutation.mutateAsync({
          id: selectedData.id,
          data: formData,
        });
        toast('Panitia berhasil diperbarui', SUCCESS_TOAST);
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
      toast('Panitia berhasil dihapus', SUCCESS_TOAST);
      handleDeleteModalClose();
    } catch {
      toast('Terjadi kesalahan saat menghapus', DANGER_TOAST);
    }
  };

  // Table columns
  const columns: TableColumn<Committee>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-16',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'fullname',
      header: 'Nama Lengkap',
    },
    {
      key: 'major',
      header: 'Jurusan',
      className: 'hidden md:table-cell',
    },
    {
      key: 'nrp',
      header: 'NRP',
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
        Data Panitia
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
          Tambah Panitia
        </Button>

        {/* Search */}
        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari nama atau NRP...'
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
            placeholder='Cari nama atau NRP...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Add Button */}
        <Button variant='primary' leftIcon={Plus} onClick={handleCreate}>
          Tambah Panitia
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={committees}
        isLoading={isListLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage='Tidak ada data panitia'
      />

      {/* Create/Edit/View Modal */}
      <CommitteeModal
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
        title='Hapus Panitia'
        message={`Apakah Anda yakin ingin menghapus panitia "${deleteTarget?.fullname}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </AdminSidebar>
  );
}
