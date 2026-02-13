'use client';

import { Eye, Search } from 'lucide-react';
import * as React from 'react';

import useDebounce from '@/hooks/useDebounce';
import { useGetNuzululQuranRegistrations } from '@/hooks/useNuzululQuranAdmin';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import Button from '@/components/buttons/Button';

import AdminNuzululQuranDetail from './admin-nuzulul-quran-detail';

export default function AdminNuzululQuranData() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [selectedCode, setSelectedCode] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const { data, isLoading } = useGetNuzululQuranRegistrations({
    page,
    limit: 10,
    search: debouncedSearch,
    status: statusFilter,
  });

  // Transform data to satisfy AdminTable's <T extends { id: string | number }> requirement
  // We use 'code' as the unique 'id'
  const tableData = React.useMemo(() => {
    return (data?.data || []).map((item) => ({
      ...item,
      id: item.code,
    }));
  }, [data?.data]);

  const columns: TableColumn<(typeof tableData)[0]>[] = [
    {
      key: 'fullname',
      header: 'Nama Lengkap',
    },
    {
      key: 'code',
      header: 'Kode',
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-[100px]',
      render: (item) => (
        <Button
          variant='outline'
          size='sm'
          onClick={() => setSelectedCode(item.code)}
          leftIcon={Eye}
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='relative w-full sm:w-72'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100'
            placeholder='Cari nama atau kode...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100 sm:w-48'
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value='all'>Semua Status</option>
          <option value='registered'>Registered</option>
          <option value='joined'>Joined</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        currentPage={data?.meta.page || 1}
        totalPages={data?.meta.total_page || 1}
        onPageChange={setPage}
        emptyMessage='Belum ada data pendaftar'
      />

      <AdminNuzululQuranDetail
        isOpen={!!selectedCode}
        onClose={() => setSelectedCode(null)}
        code={selectedCode}
      />
    </div>
  );
}
