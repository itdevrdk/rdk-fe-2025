'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Copy, Edit2, Plus, Search, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useShortenLink } from '@/hooks/useShortenLink';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import ShortenLinkModal from '@/components/admin/ShortenLinkModal';
import Button from '@/components/buttons/Button';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import { useGetMe } from '../hook/getMe';

import { CreateShortenLinkRequest, ShortenLink } from '@/types/shortenLink';

export default function AdminShortenLinkPage() {
  const {
    loading: isLinksLoading,
    getAllShortenLinks,
    createShortenLink,
    updateShortenLink,
    deleteShortenLink,
  } = useShortenLink();

  const { user, isLoading: isUserLoading } = useGetMe();

  const [links, setLinks] = useState<ShortenLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLink, setSelectedLink] = useState<ShortenLink | null>(null);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await getAllShortenLinks({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      });
      // res is ShortenLinkListResponse with data and meta at root level
      setLinks(res?.data ?? []);
      setTotalPages(res?.meta?.total_page ?? 1);
    } catch (error) {
      toast.error('Gagal memuat data shorten link');
    }
  }, [currentPage, debouncedSearch, getAllShortenLinks]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Reset page when search changes is handled by dependency in fetchLinks?
  // Actually usually we should reset page when search *term* changes immediately to avoid showing page 2 of empty results.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedLink(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (link: ShortenLink) => {
    setIsEditMode(true);
    setSelectedLink(link);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLink(null);
  };

  const handleSubmit = async (data: CreateShortenLinkRequest) => {
    try {
      if (isEditMode && selectedLink) {
        await updateShortenLink(selectedLink.link_id, data);
        toast.success('Link berhasil diperbarui');
      } else {
        await createShortenLink(data);
        toast.success('Link berhasil ditambahkan');
      }
      handleCloseModal();
      fetchLinks();
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const handleDelete = async (link_id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus link ini?')) {
      try {
        await deleteShortenLink(link_id);
        toast.success('Link berhasil dihapus');
        fetchLinks();
      } catch (error) {
        toast.error('Gagal menghapus link');
      }
    }
  };

  // Columns configuration
  const columns: TableColumn<ShortenLink & { id: string }>[] = [
    {
      key: 'created_at',
      header: 'Created At',
      render: (item) =>
        format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: id }),
    },
    {
      key: 'shorten_link',
      header: 'Shorten Link',
      render: (item) => {
        const fullLink = `${window.location.origin}/s/${item.shorten_link}`;
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(fullLink);
            toast.success('Link berhasil disalin!');
          } catch (error) {
            toast.error('Gagal menyalin link');
          }
        };

        return (
          <button
            onClick={handleCopy}
            className='flex items-center gap-1 font-medium text-primary-600 hover:underline cursor-pointer'
            title='Klik untuk menyalin link'
          >
            {item.shorten_link}
            <Copy size={14} />
          </button>
        );
      },
    },
    {
      key: 'original_link',
      header: 'Original Link',
      className: 'max-w-xs truncate',
      render: (item) => (
        <a
          href={item.original_link}
          target='_blank'
          rel='noreferrer'
          className='hover:text-primary-600 hover:underline'
          title={item.original_link}
        >
          {item.original_link}
        </a>
      ),
    },
    {
      key: 'visit_count',
      header: 'Visitors',
      className: 'text-center',
      render: (item) => <div className='text-center'>{item.visit_count}</div>,
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
            onClick={() => handleDelete(item.link_id)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Delete'
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tableData = links.map((link) => ({
    ...link,
    id: link.link_id,
  }));

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
        Shorten Link
      </Typography>

      {/* Toolbar - Mobile */}
      <div className='mb-4 flex flex-col gap-3 lg:hidden'>
        <Button
          onClick={handleOpenCreateModal}
          variant='primary'
          leftIcon={Plus}
          className='w-full'
        >
          Tambah Shorten Link
        </Button>

        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari Short Link atau Original Link'
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
            placeholder='Cari Short Link atau Original Link'
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
          Tambah Shorten Link
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={tableData}
        isLoading={isLinksLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage='Belum ada shorten link.'
      />

      <ShortenLinkModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        isEdit={isEditMode}
        data={selectedLink}
        onSubmit={handleSubmit}
      />
    </AdminSidebar>
  );
}
