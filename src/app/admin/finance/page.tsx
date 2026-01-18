'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import FinanceModal from '@/components/admin/FinanceModal';
import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import { DANGER_TOAST, SUCCESS_TOAST } from '@/components/Toast';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import { formatIDR } from '@/utils/format';

import {
  useCreateFinanceReport,
  useDeleteFinanceReport,
  useGetFinanceReports,
  useUpdateFinanceReport,
} from './hook/useFinanceAdmin';
import { useGetMe } from '../hook/getMe';

import {
  CreateFinanceReportForm,
  FinanceReport,
  FinanceReportQuery,
} from '@/types/finance';

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function AdminFinancePage() {
  const { user, isLoading: isUserLoading } = useGetMe();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FinanceReport | null>(
    null,
  );

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Build query params
  const queryParams: FinanceReportQuery = React.useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch || undefined,
    }),
    [currentPage, debouncedSearch],
  );

  // Data fetching with React Query
  const {
    data: reportsData,
    isLoading: isReportsLoading,
    isError,
  } = useGetFinanceReports(queryParams);

  // Mutations
  const createMutation = useCreateFinanceReport();
  const updateMutation = useUpdateFinanceReport();
  const deleteMutation = useDeleteFinanceReport();

  // Extract data from response
  const reports = reportsData?.data ?? [];
  const totalPages = reportsData?.meta?.total_page ?? 1;

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedReport(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (report: FinanceReport) => {
    setIsEditMode(true);
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleSubmit = async (data: CreateFinanceReportForm) => {
    try {
      if (isEditMode && selectedReport) {
        await updateMutation.mutateAsync({
          id: selectedReport.id_report,
          data,
        });
        toast('Laporan berhasil diperbarui', SUCCESS_TOAST);
      } else {
        await createMutation.mutateAsync(data);
        toast('Laporan berhasil ditambahkan', SUCCESS_TOAST);
      }
      handleCloseModal();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Terjadi kesalahan';
      toast(errorMessage, DANGER_TOAST);
    }
  };

  const handleDelete = async (id_report: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await deleteMutation.mutateAsync(id_report);
        toast('Laporan berhasil dihapus', SUCCESS_TOAST);
      } catch (error) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Gagal menghapus laporan';
        toast(errorMessage, DANGER_TOAST);
      }
    }
  };

  // Data preparation for AdminTable
  const tableData = reports.map((report) => ({
    ...report,
    id: report.id_report, // Map id_report to id for AdminTable
  }));

  const columns: TableColumn<FinanceReport & { id: string }>[] = [
    {
      key: 'created_at',
      header: 'Tanggal',
      render: (item) =>
        format(new Date(item.created_at), 'dd MMM yyyy', { locale: id }),
    },
    {
      key: 'income',
      header: 'Pemasukan',
      className: 'font-medium text-green-600',
      render: (item) => formatIDR(item.income),
    },
    {
      key: 'expenses',
      header: 'Pengeluaran',
      className: 'font-medium text-red-600',
      render: (item) => formatIDR(item.expenses),
    },
    {
      key: 'balance',
      header: 'Saldo',
      className: 'font-medium text-blue-600',
      render: (item) => formatIDR(item.balance),
    },
    {
      key: 'target',
      header: 'Target',
      render: (item) => formatIDR(item.target),
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-28',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleOpenEditModal(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Edit'
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id_report)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Delete'
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

  if (!user) {
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
        Manajemen Keuangan
      </Typography>

      {/* Toolbar - Mobile */}
      <div className='mb-4 flex flex-col gap-3 lg:hidden'>
        <Button
          variant='primary'
          leftIcon={Plus}
          onClick={handleOpenCreateModal}
          className='w-full'
        >
          Tambah
        </Button>

        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari berdasarkan tanggal'
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
            placeholder='Cari berdasarkan tanggal'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Right side actions */}
        <Button
          onClick={handleOpenCreateModal}
          variant='primary'
          leftIcon={Plus}
        >
          Tambah Laporan
        </Button>
      </div>

      {/* Error State */}
      {isError && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
          <p className='text-red-600'>Gagal memuat data. Silakan coba lagi.</p>
        </div>
      )}

      <AdminTable
        columns={columns}
        data={tableData}
        isLoading={isReportsLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage={
          debouncedSearch
            ? 'Tidak ada laporan yang cocok dengan pencarian'
            : 'Belum ada data laporan keuangan.'
        }
      />

      <FinanceModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        isEdit={isEditMode}
        data={selectedReport}
        onSubmit={handleSubmit}
      />
    </AdminSidebar>
  );
}
