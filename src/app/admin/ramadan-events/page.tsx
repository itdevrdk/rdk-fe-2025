'use client';

import { Edit, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useEvent } from '@/hooks/useEvent';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import EventModal from '@/components/admin/EventModal';
import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';

import { useGetMe } from '../hook/getMe';

import { CreateEventRequest, RamadanEvent } from '@/types/event';

export default function AdminEventsPage() {
  const { getEvents, createEvent, updateEvent, deleteEvent, loading } =
    useEvent();
  const { user, isLoading: isUserLoading } = useGetMe();

  const [events, setEvents] = useState<RamadanEvent[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RamadanEvent | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const fetchEvents = React.useCallback(async () => {
    try {
      const data = await getEvents({ year: 2025 }); // Assuming 2025 for now
      if (data) {
        setEvents(data);
      }
    } catch (error) {
      toast.error('Gagal memuat data kegiatan');
    }
  }, [getEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
      fetchEvents();
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
      fetchEvents();
    } catch (error) {
      toast.error('Gagal menghapus kegiatan');
    }
  };

  // Pagination (client-side for now as API seems to return all events in one list based on query)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

        <AdminTable
          columns={columns}
          data={paginatedEvents}
          isLoading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
