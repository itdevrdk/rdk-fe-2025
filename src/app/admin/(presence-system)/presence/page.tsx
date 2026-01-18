'use client';

import { Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import PresenceModal from '@/components/admin/PresenceModal';
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

import { usePresence, usePresenceList } from '../hook/usePresence';
import { useGetMe } from '../../hook/getMe';

import {
  CreatePresenceForm,
  Presence,
  PresenceStatus,
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

export default function PresencePage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<
    PresenceStatus | 'all'
  >('all');
  const [eventFilter, setEventFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>(
    'create',
  );
  const [selectedData, setSelectedData] = React.useState<Presence | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Presence | null>(null);

  // Loading state for mutations
  const [isMutating, setIsMutating] = React.useState(false);

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // Hooks
  const {
    createPresence,
    updatePresence,
    deletePresence,
    getCommitteesForDropdown,
    getEventsForDropdown,
  } = usePresence();
  const { data, meta, refetch } = usePresenceList({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
    event_id: eventFilter !== 'all' ? eventFilter : undefined,
    status: statusFilter,
  });

  const committees = React.useMemo(
    () => getCommitteesForDropdown(),
    [getCommitteesForDropdown],
  );
  const events = React.useMemo(
    () => getEventsForDropdown(),
    [getEventsForDropdown],
  );

  const totalPages = meta?.total_page || 1;

  // Reset to page 1 when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, eventFilter]);

  // Handlers
  const handleCreate = () => {
    setSelectedData(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEdit = (item: Presence) => {
    setSelectedData(item);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleView = (item: Presence) => {
    setSelectedData(item);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = (item: Presence) => {
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

  const handleSubmit = async (formData: CreatePresenceForm) => {
    try {
      setIsMutating(true);
      if (modalMode === 'create') {
        await createPresence(formData);
        toast('Presensi berhasil ditambahkan', SUCCESS_TOAST);
      } else if (modalMode === 'edit' && selectedData) {
        await updatePresence(selectedData.id, { status: formData.status });
        toast('Presensi berhasil diperbarui', SUCCESS_TOAST);
      }
      handleModalClose();
      refetch();
    } catch {
      toast('Terjadi kesalahan', DANGER_TOAST);
    } finally {
      setIsMutating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsMutating(true);
      await deletePresence(deleteTarget.id);
      toast('Presensi berhasil dihapus', SUCCESS_TOAST);
      handleDeleteModalClose();
      refetch();
    } catch {
      toast('Terjadi kesalahan saat menghapus', DANGER_TOAST);
    } finally {
      setIsMutating(false);
    }
  };

  // Table columns
  const columns: TableColumn<Presence>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-16',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'committee',
      header: 'Nama Panitia',
      render: (item) => item.committee?.fullname || '-',
    },
    {
      key: 'event',
      header: 'Event',
      render: (item) => item.committee_event?.name || '-',
      className: 'hidden md:table-cell',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span
          className={cn(
            'inline-flex rounded-full px-3 py-1 text-xs font-medium',
            item.status === 'attend'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700',
          )}
        >
          {item.status === 'attend' ? 'Hadir' : 'Tidak Hadir'}
        </span>
      ),
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
        Data Presensi
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
          Tambah Presensi
        </Button>

        {/* Search */}
        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari nama panitia...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Filters */}
        <div className='flex gap-2'>
          <Select
            value={eventFilter}
            onValueChange={(value) => setEventFilter(value)}
          >
            <SelectTrigger className='flex-1'>
              <SelectValue placeholder='Filter Event' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Event</SelectItem>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as PresenceStatus | 'all')
            }
          >
            <SelectTrigger className='flex-1'>
              <SelectValue placeholder='Filter Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Status</SelectItem>
              <SelectItem value='attend'>Hadir</SelectItem>
              <SelectItem value='skip'>Tidak Hadir</SelectItem>
            </SelectContent>
          </Select>
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
            placeholder='Cari nama panitia...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Right side actions */}
        <div className='flex items-center gap-3'>
          {/* Event Filter */}
          <Select
            value={eventFilter}
            onValueChange={(value) => setEventFilter(value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter Event' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Event</SelectItem>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as PresenceStatus | 'all')
            }
          >
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Filter Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Status</SelectItem>
              <SelectItem value='attend'>Hadir</SelectItem>
              <SelectItem value='skip'>Tidak Hadir</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Button */}
          <Button variant='primary' leftIcon={Plus} onClick={handleCreate}>
            Tambah Presensi
          </Button>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={data}
        isLoading={false}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage='Tidak ada data presensi'
      />

      {/* Create/Edit/View Modal */}
      <PresenceModal
        isOpen={modalOpen}
        closeModal={handleModalClose}
        isEdit={modalMode === 'edit'}
        isView={modalMode === 'view'}
        data={selectedData}
        onSubmit={handleSubmit}
        isLoading={isMutating}
        committees={committees}
        events={events}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isLoading={isMutating}
        title='Hapus Presensi'
        message='Apakah Anda yakin ingin menghapus data presensi ini? Tindakan ini tidak dapat dibatalkan.'
      />
    </AdminSidebar>
  );
}
