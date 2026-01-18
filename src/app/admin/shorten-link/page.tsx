'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ExternalLink, Pencil, Plus, Search, Trash } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useShortenLink } from '@/hooks/useShortenLink';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import ShortenLinkModal from '@/components/admin/ShortenLinkModal';
import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import { CreateShortenLinkRequest, ShortenLink } from '@/types/shortenLink';

export default function AdminShortenLinkPage() {
  const {
    loading,
    getAllShortenLinks,
    createShortenLink,
    updateShortenLink,
    deleteShortenLink,
  } = useShortenLink();

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
      setLinks(res.data.data_per_page);
      setTotalPages(res.data.meta.max_page);
    } catch (error) {
      toast.error('Gagal memuat data shorten link');
    }
  }, [getAllShortenLinks, currentPage, debouncedSearch]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

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
      render: (item) => (
        <a
          href={`/s/${item.shorten_link}`}
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-1 font-medium text-primary-600 hover:underline'
        >
          {item.shorten_link}
          <ExternalLink size={14} />
        </a>
      ),
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
            onClick={() => handleDelete(item.link_id)}
            className='rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100'
            title='Hapus'
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tableData = links.map((link) => ({
    ...link,
    id: link.link_id,
  }));

  return (
    <div className='p-6'>
      {/* Page Title */}
      <Typography
        as='h1'
        font='marquisette'
        variant='h4'
        className='mb-6 text-primary-100'
      >
        Shorten Link
      </Typography>

      {/* Toolbar */}
      <div className='mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
        {/* Search */}
        <div className='relative max-w-md flex-1'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari Short Link atau Original Link'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className='pl-10'
          />
        </div>

        {/* Add Button */}
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
        isLoading={loading}
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
    </div>
  );
}
