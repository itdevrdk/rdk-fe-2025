'use client';

import { Eye, Search, Trash2 } from 'lucide-react';
import * as React from 'react';

import { getRatingConfig } from '@/lib/feedback';
import useDebounce from '@/hooks/useDebounce';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import AdminFeedbackDetail from '@/components/admin/feedback/admin-feedback-detail';
import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

import {
  useBulkDeleteFeedback,
  useDeleteFeedback,
  useGetFeedbackList,
  useGetFeedbackSummary,
} from '@/app/admin/feedback/hook/useFeedback';

import { EMOJI_RATINGS, FeedbackRating } from '@/types/feedback';
import { VALID_EVENT_NAMES } from '@/types/rsvp';

export default function AdminFeedbackData() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = React.useState<FeedbackRating | ''>(
    '',
  );
  const [eventFilter, setEventFilter] = React.useState<string>('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] =
    React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(
    null,
  );

  const { data, isLoading } = useGetFeedbackList({
    page,
    limit: 10,
    search: debouncedSearch,
    rating: ratingFilter || undefined,
    event: eventFilter || undefined,
    sort: 'newest',
  });

  const { data: summary } = useGetFeedbackSummary(eventFilter || undefined);

  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteFeedback();
  const { mutate: bulkDeleteFeedback, isPending: isBulkDeleting } =
    useBulkDeleteFeedback();

  // Get summary counts
  const totalCount = summary?.data?.total_count || 0;
  const averageRating = summary?.data?.average_rating_score || 0;
  const positiveCount =
    (summary?.data?.rating_breakdown?.['happy'] || 0) +
    (summary?.data?.rating_breakdown?.['very-happy'] || 0);
  const negativeCount =
    (summary?.data?.rating_breakdown?.['angry'] || 0) +
    (summary?.data?.rating_breakdown?.['very-angry'] || 0);

  // Transform data to satisfy AdminTable's <T extends { id: string | number }> requirement
  const tableData = React.useMemo(() => {
    return (data?.data?.data || []).map((item) => ({
      ...item,
      id: item.id,
    }));
  }, [data?.data?.data]);

  const handleSelectAll = React.useCallback(() => {
    if (selectedIds.length === tableData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tableData.map((item) => item.id));
    }
  }, [selectedIds.length, tableData]);

  const handleToggleSelect = React.useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteFeedback(deleteTargetId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
        },
      });
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length > 0) {
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteFeedback(selectedIds, {
      onSuccess: () => {
        setIsBulkDeleteModalOpen(false);
        setSelectedIds([]);
      },
    });
  };

  const columns: TableColumn<(typeof tableData)[0]>[] = [
    {
      key: 'select',
      header: '',
      className: 'w-[40px]',
      render: (item) => (
        <input
          type='checkbox'
          checked={selectedIds.includes(item.id)}
          onChange={() => handleToggleSelect(item.id)}
          className='h-4 w-4 rounded border-gray-300 text-[#681819] focus:ring-[#681819]'
        />
      ),
    },
    {
      key: 'name',
      header: 'Nama',
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item) => {
        const config = getRatingConfig(item.rating);
        return (
          <span
            className='inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium'
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
            }}
          >
            <span>{config.emoji}</span>
            <span>{config.label}</span>
          </span>
        );
      },
    },
    {
      key: 'message',
      header: 'Pesan',
      className: 'max-w-[300px]',
      render: (item) => (
        <span className='line-clamp-2 text-gray-600'>{item.message}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Tanggal',
      render: (item) => (
        <span className='text-gray-500'>
          {new Date(item.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-[150px]',
      render: (item) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setSelectedId(item.id)}
            leftIcon={Eye}
          >
            Detail
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleDeleteClick(item.id)}
            className='text-red-600 hover:bg-red-50 hover:border-red-300'
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Total Feedback Card */}
        <div className='rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
          <Typography variant='body' className='mb-2 text-sm text-blue-700'>
            Total Feedback
          </Typography>
          <Typography variant='h3' className='font-bold text-blue-900'>
            {totalCount}
          </Typography>
        </div>

        {/* Average Rating Card */}
        <div className='rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
          <Typography variant='body' className='mb-2 text-sm text-purple-700'>
            Rating Rata-rata
          </Typography>
          <Typography variant='h3' className='font-bold text-purple-900'>
            {averageRating.toFixed(1)} / 5.0
          </Typography>
        </div>

        {/* Positive Feedback Card */}
        <div className='rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
          <Typography variant='body' className='mb-2 text-sm text-green-700'>
            Feedback Positif
          </Typography>
          <Typography variant='h3' className='font-bold text-green-900'>
            {positiveCount}
          </Typography>
        </div>

        {/* Negative Feedback Card */}
        <div className='rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
          <Typography variant='body' className='mb-2 text-sm text-red-700'>
            Feedback Negatif
          </Typography>
          <Typography variant='h3' className='font-bold text-red-900'>
            {negativeCount}
          </Typography>
        </div>
      </div>

      {/* Rating Distribution */}
      {summary?.data?.rating_breakdown && (
        <div className='rounded-lg border border-gray-200 bg-white p-4'>
          <Typography variant='body' className='mb-3 font-medium text-gray-700'>
            Distribusi Rating
          </Typography>
          <div className='flex flex-wrap gap-3'>
            {EMOJI_RATINGS.map(({ value }) => {
              const config = getRatingConfig(value);
              const count = summary.data.rating_breakdown[value] || 0;
              const percentage =
                totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

              return (
                <div
                  key={value}
                  className='flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2'
                >
                  <span className='text-xl'>{config.emoji}</span>
                  <div className='flex flex-col'>
                    <span className='text-xs font-medium text-gray-700'>
                      {config.label}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='relative w-full sm:w-72'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100'
            placeholder='Cari nama atau pesan...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
          <select
            className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100 sm:w-48'
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value as FeedbackRating | '');
              setPage(1);
            }}
          >
            <option value=''>Semua Rating</option>
            {EMOJI_RATINGS.map(({ value, emoji, label }) => (
              <option key={value} value={value}>
                {emoji} {label}
              </option>
            ))}
          </select>

          <select
            className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100 sm:w-52'
            value={eventFilter}
            onChange={(e) => {
              setEventFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value=''>Semua Kegiatan</option>
            {VALID_EVENT_NAMES.map((eventName) => (
              <option key={eventName} value={eventName}>
                {eventName}
              </option>
            ))}
          </select>

          {selectedIds.length > 0 && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleBulkDeleteClick}
              className='text-red-600 hover:bg-red-50 hover:border-red-300'
              leftIcon={Trash2}
            >
              Hapus ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Select All Row */}
      {tableData.length > 0 && (
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={
              selectedIds.length === tableData.length && tableData.length > 0
            }
            onChange={handleSelectAll}
            className='h-4 w-4 rounded border-gray-300 text-[#681819] focus:ring-[#681819]'
          />
          <span className='text-sm text-gray-600'>
            Pilih Semua ({selectedIds.length}/{tableData.length})
          </span>
        </div>
      )}

      {/* Table */}
      <AdminTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        currentPage={data?.data?.meta?.page || 1}
        totalPages={data?.data?.meta?.total_page || 1}
        onPageChange={setPage}
        emptyMessage='Belum ada data feedback'
      />

      {/* Detail Modal */}
      <AdminFeedbackDetail
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        feedbackId={selectedId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title='Hapus Feedback'
        message='Apakah Anda yakin ingin menghapus feedback ini? Tindakan ini tidak dapat dibatalkan.'
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        isLoading={isBulkDeleting}
        title='Hapus Feedback Terpilih'
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} feedback? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
