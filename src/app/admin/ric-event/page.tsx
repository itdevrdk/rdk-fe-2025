'use client';

import { Edit2, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import RicEventModal from '@/components/admin/RicEventModal';
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
  getErrorMessage,
  useCreateRicEvent,
  useDeleteRicEvent,
  useGetRicEvents,
  useUpdateRicEvent,
} from './hook/useRicEvent';
import { useGetMe } from '../hook/getMe';

import {
  CreateRicEventRequest,
  RicEvent,
  RicEventFormData,
  RicEventQuery,
  RicEventType,
  UpdateRicEventRequest,
} from '@/types/entities/ric-event';

const eventTypeLabels: Record<string, string> = {
  MHQ: 'Musabaqah Hifdzil Quran',
  MTQ: 'Musabaqah Tilawatil Quran',
  DAI: "Da'i",
  KTIQ: 'Karya Tulis Ilmiah Quran',
  POSTER: 'Poster',
  VIDEOGRAFI: 'Videografi',
};

export default function AdminRicEventPage() {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = React.useState('');
  const [eventTypeFilter, setEventTypeFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Build query params for API
  const queryParams: RicEventQuery = React.useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined,
      event_type:
        eventTypeFilter !== 'all'
          ? (eventTypeFilter as RicEventType)
          : undefined,
      sort_by: 'created_at',
      sort_order: 'desc',
    }),
    [currentPage, searchQuery, eventTypeFilter],
  );

  // Fetch RIC events data
  const {
    data: eventsData,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useGetRicEvents(queryParams);

  // Mutations
  const createMutation = useCreateRicEvent();
  const updateMutation = useUpdateRicEvent();
  const deleteMutation = useDeleteRicEvent();

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>(
    'create',
  );
  const [selectedData, setSelectedData] = React.useState<RicEvent | null>(null);
  const [modalError, setModalError] = React.useState<string | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<RicEvent | null>(null);

  // Fetch user data
  const { user, isLoading: isUserLoading, isError } = useGetMe();

  // Get data from API response
  const data = eventsData?.data ?? [];
  const totalPages = eventsData?.meta?.total_page ?? 1;

  // Handlers
  const handleCreate = () => {
    setSelectedData(null);
    setModalMode('create');
    setModalError(null);
    setModalOpen(true);
  };

  const handleEdit = (item: RicEvent) => {
    setSelectedData(item);
    setModalMode('edit');
    setModalError(null);
    setModalOpen(true);
  };

  const handleView = (item: RicEvent) => {
    setSelectedData(item);
    setModalMode('view');
    setModalError(null);
    setModalOpen(true);
  };

  const handleDelete = (item: RicEvent) => {
    setDeleteTarget(item);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedData(null);
    setModalError(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleSubmit = async (formData: RicEventFormData) => {
    setModalError(null);

    try {
      if (modalMode === 'create') {
        const createData: CreateRicEventRequest = {
          event_type: formData.event_type as RicEventType,
          quota: formData.quota,
        };
        await createMutation.mutateAsync(createData);
        toast('Event berhasil ditambahkan', SUCCESS_TOAST);
        handleModalClose();
      } else if (modalMode === 'edit' && selectedData) {
        const updateData: UpdateRicEventRequest = {
          event_type: formData.event_type as RicEventType,
          quota: formData.quota,
        };
        await updateMutation.mutateAsync({
          id: selectedData.id,
          data: updateData,
        });
        toast('Event berhasil diperbarui', SUCCESS_TOAST);
        handleModalClose();
      }
    } catch (error) {
      const errorMsg = getErrorMessage(error as never);
      setModalError(errorMsg);
      toast(errorMsg, DANGER_TOAST);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast('Event berhasil dihapus', SUCCESS_TOAST);
      handleDeleteModalClose();
    } catch (error) {
      const errorMsg = getErrorMessage(error as never);
      toast(errorMsg, DANGER_TOAST);
    }
  };
  const columns: TableColumn<RicEvent>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-12',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'event_type',
      header: 'Jenis Event',
      render: (item) => (
        <div>
          <p className='font-medium text-gray-900'>
            {eventTypeLabels[item.event_type] || item.event_type}
          </p>
          <p className='text-xs text-gray-500'>{item.event_type}</p>
        </div>
      ),
    },
    {
      key: 'quota',
      header: 'Kuota',
      render: (item) => (
        <div className='flex items-center gap-1 text-sm'>
          <Users size={14} className='text-gray-500' />
          <span
            className={cn(
              (item.registration_count || 0) >= item.quota
                ? 'text-red-600 font-medium'
                : 'text-gray-600',
            )}
          >
            {item.registration_count || 0}/{item.quota}
          </span>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Dibuat',
      className: 'hidden md:table-cell',
      render: (item) => (
        <span className='text-sm text-gray-600'>
          {new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
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
        Data Event RIC
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
            placeholder='Telusuri event...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className='pl-10'
          />
        </div>

        {/* Filter */}
        <Select
          value={eventTypeFilter}
          onValueChange={(value) => {
            setEventTypeFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Filter Jenis Event' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua Jenis</SelectItem>
            <SelectItem value='MHQ'>MHQ</SelectItem>
            <SelectItem value='MTQ'>MTQ</SelectItem>
            <SelectItem value='DAI'>DAI</SelectItem>
            <SelectItem value='KTIQ'>KTIQ</SelectItem>
            <SelectItem value='POSTER'>POSTER</SelectItem>
            <SelectItem value='VIDEOGRAFI'>VIDEOGRAFI</SelectItem>
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
            placeholder='Telusuri event...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className='pl-10'
          />
        </div>

        {/* Right side actions */}
        <div className='flex items-center gap-3'>
          {/* Filter */}
          <Select
            value={eventTypeFilter}
            onValueChange={(value) => {
              setEventTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter Jenis Event' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Jenis</SelectItem>
              <SelectItem value='MHQ'>MHQ</SelectItem>
              <SelectItem value='MTQ'>MTQ</SelectItem>
              <SelectItem value='DAI'>DAI</SelectItem>
              <SelectItem value='KTIQ'>KTIQ</SelectItem>
              <SelectItem value='POSTER'>POSTER</SelectItem>
              <SelectItem value='VIDEOGRAFI'>VIDEOGRAFI</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Button */}
          <Button variant='primary' leftIcon={Plus} onClick={handleCreate}>
            Tambah Event
          </Button>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={data}
        isLoading={isEventsLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage={
          isEventsError
            ? 'Gagal memuat data. Silakan coba lagi.'
            : 'Tidak ada data event'
        }
      />

      {/* Create/Edit/View Modal */}
      <RicEventModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        data={selectedData}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        errorMessage={modalError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title='Hapus Event'
        message={`Apakah Anda yakin ingin menghapus event "${eventTypeLabels[deleteTarget?.event_type || ''] || deleteTarget?.event_type}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </AdminSidebar>
  );
}
