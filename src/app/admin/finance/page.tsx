'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Pencil, Plus, Trash } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useFinanceReport } from '@/hooks/useFinanceReport';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import FinanceModal from '@/components/admin/FinanceModal';
import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

import { CreateFinanceReportRequest, FinanceReport } from '@/types/finance';

export default function AdminFinancePage() {
  const { reports, createReport, updateReport, deleteReport } =
    useFinanceReport();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FinanceReport | null>(
    null,
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleSubmit = async (data: CreateFinanceReportRequest) => {
    try {
      if (isEditMode && selectedReport) {
        await updateReport(selectedReport.id_report, data);
        toast.success('Laporan berhasil diperbarui');
      } else {
        await createReport(data);
        toast.success('Laporan berhasil ditambahkan');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleDelete = async (id_report: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await deleteReport(id_report);
        toast.success('Laporan berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus laporan');
      }
    }
  };

  // Format currency helper
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Data preparation for AdminTable
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return reports
      .slice(startIndex, startIndex + itemsPerPage)
      .map((report) => ({
        ...report,
        id: report.id_report, // Map id_report to id for AdminTable
      }));
  }, [reports, currentPage]);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const columns: TableColumn<FinanceReport & { id: string }>[] = [
    {
      key: 'created_at',
      header: 'Tanggal',
      render: (item) =>
        format(new Date(item.created_at), 'dd MMMM yyyy HH:mm', { locale: id }),
    },
    {
      key: 'income',
      header: 'Pemasukan',
      className: 'font-medium text-green-600',
      render: (item) => formatRupiah(item.income),
    },
    {
      key: 'expenses',
      header: 'Pengeluaran',
      className: 'font-medium text-red-600',
      render: (item) => formatRupiah(item.expenses),
    },
    {
      key: 'balance',
      header: 'Saldo',
      className: 'font-medium text-blue-600',
      render: (item) => formatRupiah(item.balance),
    },
    {
      key: 'target',
      header: 'Target',
      render: (item) => formatRupiah(item.target),
    },
    {
      key: 'shortfall',
      header: 'Kekurangan',
      render: (item) => {
        const shortfall = item.target - item.income;
        const isShortfallData = shortfall > 0;
        return (
          <span
            className={`font-medium ${
              isShortfallData ? 'text-orange-600' : 'text-green-600'
            }`}
          >
            {isShortfallData ? formatRupiah(shortfall) : 'Tercapai'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'text-center',
      render: (item) => (
        <div className='flex justify-center gap-2'>
          <button
            onClick={() => handleOpenEditModal(item)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            title='Edit'
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id_report)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            title='Hapus'
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className='p-6'>
      {/* Page Title */}
      <Typography
        as='h1'
        font='marquisette'
        variant='h4'
        className='mb-6 text-primary-100'
      >
        Manajemen Keuangan
      </Typography>

      <div className='mb-6 flex items-center justify-between'>
        {/* Placeholder for left side toolbar if needed (search, etc.) */}
        <div />

        <Button
          onClick={handleOpenCreateModal}
          variant='primary'
          leftIcon={Plus}
        >
          Tambah Laporan
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={paginatedReports}
        isLoading={false} // Mock data
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage='Belum ada data laporan keuangan.'
      />

      <FinanceModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        isEdit={isEditMode}
        data={selectedReport}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
