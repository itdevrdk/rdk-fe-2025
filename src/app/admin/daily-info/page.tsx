'use client';

import { format } from 'date-fns';
import { Edit, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import toast from 'react-hot-toast';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import DailyInfoModal from '@/components/admin/DailyInfoModal';
import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import { DANGER_TOAST, SUCCESS_TOAST } from '@/components/Toast';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import {
  useDeleteDailyInfo,
  useGetDailyInfos,
} from '@/app/admin/daily-info/hook/useDailyInfo';
import { useGetMe } from '@/app/admin/hook/getMe';

import { DailyInfo, DailyInfoQuery } from '@/types/entities/daily-info';

export default function AdminDailyInfoPage() {
  // State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const itemsPerPage = 10;

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedDailyInfo, setSelectedDailyInfo] =
    React.useState<DailyInfo | null>(null);

  // Build query params
  const queryParams: DailyInfoQuery = React.useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }),
    [currentPage, startDate, endDate],
  );

  // Data fetching
  const {
    data: dailyInfosData,
    isLoading,
    isError,
  } = useGetDailyInfos(queryParams);
  const { user, isLoading: isUserLoading } = useGetMe();
  const deleteMutation = useDeleteDailyInfo();

  const data = dailyInfosData?.data?.data ?? [];
  const totalPages = dailyInfosData?.data?.meta?.total_page ?? 1;

  // Handlers
  const handleEdit = (item: DailyInfo) => {
    setSelectedDailyInfo(item);
    setModalOpen(true);
  };

  const handleDelete = async (date: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      await deleteMutation.mutateAsync(date);
      toast('Berhasil menghapus data', SUCCESS_TOAST);
    } catch (error) {
      toast('Gagal menghapus data', DANGER_TOAST);
    }
  };

  const handleCreate = () => {
    setSelectedDailyInfo(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDailyInfo(null);
  };

  // Columns
  const columns: TableColumn<DailyInfo>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-12',
      render: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: 'date',
      header: 'Tanggal',
      className: 'w-40',
      render: (item) => format(new Date(item.date), 'dd MMM yyyy'),
    },
    {
      key: 'menus',
      header: 'Menu Sahur & Buka',
      render: (item) => (
        <div className='flex flex-col gap-1 text-sm'>
          <div>
            <span className='font-semibold'>Sahur:</span>{' '}
            {item.sahur_menu || '-'}
          </div>
          <div>
            <span className='font-semibold'>Buka:</span>{' '}
            {item.iftar_menu || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'kajian',
      header: 'Kajian',
      render: (item) => {
        if (!item.kajian_title && !item.kajian_speaker) return '-';
        return (
          <div className='flex flex-col gap-1 text-sm'>
            <div className='font-medium'>{item.kajian_title}</div>
            <div className='text-gray-500'>{item.kajian_speaker}</div>
          </div>
        );
      },
    },
    {
      key: 'special_event',
      header: 'Event & Program',
      render: (item) => {
        if (!item.special_event && !item.program_title) return '-';
        return (
          <div className='flex flex-col gap-1 text-sm'>
            {item.special_event && (
              <div>
                <span className='font-semibold text-purple-600'>Event:</span>{' '}
                {item.special_event}
              </div>
            )}
            {item.program_title && (
              <div>
                <span className='font-semibold text-blue-600'>Program:</span>{' '}
                {item.program_title}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-24',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleEdit(item)}
            className='rounded-lg border border-gray-200 p-2 text-blue-600 hover:bg-blue-50'
            aria-label='Edit'
            title='Edit'
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.date)}
            className='rounded-lg border border-gray-200 p-2 text-red-600 hover:bg-red-50'
            aria-label='Hapus'
            title='Hapus'
          >
            <Trash2 size={16} />
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
      <div className='mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <Typography
          as='h1'
          font='marquisette'
          variant='h4'
          className='text-primary-100'
        >
          Daily Info
        </Typography>
        <Button onClick={handleCreate} leftIcon={Plus}>
          Tambah Data
        </Button>
      </div>

      {/* Toolbar */}
      <div className='mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-end'>
        <div className='w-full md:w-auto'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Dari Tanggal
          </label>
          <Input
            type='date'
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className='w-full md:w-auto'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Sampai Tanggal
          </label>
          <Input
            type='date'
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {(startDate || endDate) && (
          <Button
            variant='outline'
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setCurrentPage(1);
            }}
            className='mb-[2px]'
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage={
          isError ? 'Gagal memuat data' : 'Belum ada data Daily Info'
        }
      />

      <DailyInfoModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        data={selectedDailyInfo}
      />
    </AdminSidebar>
  );
}
