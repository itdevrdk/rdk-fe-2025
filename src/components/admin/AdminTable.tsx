'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  // Pagination props
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  emptyMessage = 'Tidak ada data',
  currentPage,
  totalPages,
  onPageChange,
}: AdminTableProps<T>) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }

    return pages;
  };

  return (
    <div className='w-full'>
      {/* Table */}
      <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200 bg-gray-50'>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-gray-600',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className='border-b border-gray-100 last:border-b-0'
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className='px-4 py-4'>
                      <div className='h-4 w-full animate-pulse rounded bg-gray-200' />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-4 py-8 text-center text-gray-500'
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className='border-b border-gray-100 last:border-b-0 hover:bg-gray-50'
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn('px-4 py-4 text-sm', column.className)}
                    >
                      {column.render
                        ? column.render(item, index)
                        : String(item[column.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='mt-4 flex items-center justify-center gap-1'>
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className='hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 lg:block'
            aria-label='First page'
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Previous page'
          >
            <ChevronLeft size={18} />
            <span className='hidden sm:inline'>Previous</span>
          </button>

          {/* Page Numbers */}
          <div className='flex items-center gap-1'>
            {getPageNumbers().map((page, index) =>
              typeof page === 'string' ? (
                <span key={`ellipsis-${index}`} className='px-2 text-gray-400'>
                  {page}
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'min-w-[36px] rounded-lg px-3 py-2 text-sm transition-colors',
                    currentPage === page
                      ? 'border border-gray-300 bg-white font-medium text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100',
                  )}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Next page'
          >
            <span className='hidden sm:inline'>Next</span>
            <ChevronRight size={18} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className='hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 lg:block'
            aria-label='Last page'
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
