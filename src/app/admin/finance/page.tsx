'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useFinanceReport } from '@/hooks/useFinanceReport';

import FinanceModal from '@/components/admin/FinanceModal';
import Button from '@/components/buttons/Button';

import { CreateFinanceReportRequest, FinanceReport } from '@/types/finance';

export default function AdminFinancePage() {
  const { reports, createReport, updateReport, deleteReport } =
    useFinanceReport();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FinanceReport | null>(
    null,
  );

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

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800'>Manajemen Keuangan</h1>
        <Button
          onClick={handleOpenCreateModal}
          variant='primary'
          leftIcon={Plus}
        >
          Tambah Laporan
        </Button>
      </div>

      <div className='overflow-x-auto rounded-lg bg-white shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Tanggal
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Pemasukan
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Pengeluaran
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Saldo
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Target
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Kekurangan
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500'>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='px-6 py-4 text-center text-sm text-gray-500'
                >
                  Belum ada data laporan keuangan.
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                // Determine shortfall: if target > income, shortfall is target - income. Else 0 (or covered)
                const shortfall = report.target - report.income;
                const isShortfallData = shortfall > 0;

                return (
                  <tr key={report.id_report} className='hover:bg-gray-50'>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                      {format(
                        new Date(report.created_at),
                        'dd MMMM yyyy HH:mm',
                        { locale: id },
                      )}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600'>
                      {formatRupiah(report.income)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-red-600'>
                      {formatRupiah(report.expenses)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600'>
                      {formatRupiah(report.balance)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                      {formatRupiah(report.target)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${isShortfallData ? 'text-orange-600' : 'text-green-600'}`}
                    >
                      {isShortfallData ? formatRupiah(shortfall) : 'Tercapai'}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-center text-sm font-medium'>
                      <div className='flex justify-center gap-2'>
                        <button
                          onClick={() => handleOpenEditModal(report)}
                          className='rounded-full bg-yellow-100 p-2 text-yellow-600 hover:bg-yellow-200 transition-colors'
                          title='Edit'
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id_report)}
                          className='rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors'
                          title='Hapus'
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
