'use client';

import { Eye, Search } from 'lucide-react';
import * as React from 'react';

import useDebounce from '@/hooks/useDebounce';
import { useEvent } from '@/hooks/useEvent';
import { useGetRsvps } from '@/hooks/useRsvpAdmin';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import AdminRsvpDetail from '@/components/admin/rsvp/admin-rsvp-detail';
import Button from '@/components/buttons/Button';
import Loading from '@/components/Loading';

export default function AdminRsvpData() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [selectedCode, setSelectedCode] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [selectedEventName, setSelectedEventName] = React.useState<string>('');

  // Fetch events for dropdown
  const { getEvents, loading: isEventsLoading } = useEvent();
  const [events, setEvents] = React.useState<{ id: string; title: string }[]>(
    [],
  );

  React.useEffect(() => {
    const fetchEvents = async () => {
      const eventData = await getEvents();
      if (eventData) {
        setEvents(eventData);
      }
    };
    fetchEvents();
  }, [getEvents]);

  const { data, isLoading } = useGetRsvps({
    page,
    limit: 10,
    search: debouncedSearch,
    status:
      statusFilter === 'all'
        ? undefined
        : (statusFilter as 'registered' | 'joined'),
    event_name: selectedEventName,
  });

  // Transform data to satisfy AdminTable's <T extends { id: string | number }> requirement
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
      key: 'event_name',
      header: 'Event',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const status = item.status as 'registered' | 'joined';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === 'joined'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status === 'joined' ? 'Hadir' : 'Terdaftar'}
          </span>
        );
      },
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

  if (isEventsLoading && events.length === 0) {
    return <Loading />;
  }

  return (
    <div className='space-y-4'>
      {/* Event Selector */}
      <div className='mb-4'>
        <label
          htmlFor='event-select'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Pilih Event
        </label>
        <select
          id='event-select'
          className='block w-full sm:w-1/2 rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100'
          value={selectedEventName}
          onChange={(e) => {
            setSelectedEventName(e.target.value);
            setPage(1);
          }}
        >
          <option value=''>Semua Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.title}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

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
        currentPage={data?.meta?.page || 1}
        totalPages={data?.meta?.total_page || 1}
        onPageChange={setPage}
        emptyMessage='Belum ada data pendaftar'
      />
      <AdminRsvpDetail
        isOpen={!!selectedCode}
        onClose={() => setSelectedCode(null)}
        code={selectedCode}
      />
    </div>
  );
}
