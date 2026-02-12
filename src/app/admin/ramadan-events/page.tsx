'use client';

import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import useDebounce from '@/hooks/useDebounce';
import { useEvent } from '@/hooks/useEvent';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import EventModal from '@/components/admin/EventModal';
import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import { useGetMe } from '../hook/getMe';

import {
  CreateEventRequest,
  MetaPagination,
  RamadanEvent,
} from '@/types/event';

export default function AdminEventsPage() {
  const { getAdminEvents, createEvent, updateEvent, deleteEvent, loading } =
    useEvent();
  const { user, isLoading: isUserLoading } = useGetMe();

  const [events, setEvents] = useState<RamadanEvent[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({
    page: 1,
    limit: 10,
    total_data: 0,
    total_page: 0,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RamadanEvent | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const fetchEvents = React.useCallback(
    async (page: number, search: string) => {
      try {
        const res = await getAdminEvents({
          page,
          limit: 10,
          search,
        });
        if (res) {
          setEvents(res.data.data);
          setMeta(res.data.meta);
        }
      } catch (error) {
        toast.error('Gagal memuat data kegiatan');
      }
    },
    [getAdminEvents],
  );

  useEffect(() => {
    fetchEvents(meta.page, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, meta.page]); // Only triggering when search or page changes

  // Reset page to 1 when search changes
  useEffect(() => {
    setMeta((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const handleCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: RamadanEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingEventId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: CreateEventRequest) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, { ...data, id: editingEvent.id });
        toast.success('Kegiatan berhasil diperbarui');
      } else {
        await createEvent(data);
        toast.success('Kegiatan berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchEvents(meta.page, debouncedSearch);
    } catch (error) {
      toast.error('Gagal menyimpan kegiatan');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEventId) return;
    try {
      await deleteEvent(deletingEventId);
      toast.success('Kegiatan berhasil dihapus');
      setIsDeleteModalOpen(false);
      fetchEvents(meta.page, debouncedSearch);
    } catch (error) {
      toast.error('Gagal menghapus kegiatan');
    }
  };

  const columns: TableColumn<RamadanEvent>[] = [
    {
      key: 'title',
      header: 'Nama Kegiatan',
    },
    {
      key: 'date',
      header: 'Waktu',
      render: (item) => {
        const start = new Date(item.date).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = item.end_date
          ? new Date(item.end_date).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';
        return (
          <span>
            {start} {end ? `- ${end}` : ''}
          </span>
        );
      },
    },
    {
      key: 'location',
      header: 'Lokasi',
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'text-right',
      render: (item) => (
        <div className='flex justify-end gap-2'>
          <Button
            size='sm'
            variant='outline'
            className='p-2'
            onClick={() => handleEdit(item)}
          >
            <Edit size={16} />
          </Button>
          <Button
            size='sm'
            variant='primary'
            className='p-2 bg-red-600 hover:bg-red-700 border-red-600 text-white'
            onClick={() => handleDeleteClick(item.id)}
          >
            <Trash2 size={16} />
          </Button>
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

  if (!user) {
    return null;
  }

  return (
    <AdminSidebar user={user}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <Typography
            as='h1'
            font='marquisette'
            variant='h4'
            className='text-primary-100'
          >
            Manajemen Kegiatan Ramadhan
          </Typography>
          <Button onClick={handleCreate} leftIcon={Plus}>
            Tambah Kegiatan
          </Button>
        </div>

        <div className='flex justify-end'>
          <div className='relative w-full max-w-xs'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />
            <Input
              id='search'
              placeholder='Cari kegiatan...'
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className='pl-10'
            />
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={events}
          isLoading={loading}
          currentPage={meta.page}
          totalPages={meta.total_page}
          onPageChange={(page) => setMeta((prev) => ({ ...prev, page }))}
        />

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isLoading={loading}
          editData={editingEvent}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isLoading={loading}
          title='Hapus Kegiatan'
          message='Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.'
        />
      </div>
    </AdminSidebar>
  );
}
