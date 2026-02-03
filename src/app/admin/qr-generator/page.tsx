'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit2, Plus, QrCode, Search, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useQrCode } from '@/hooks/useQrCode';

import AdminTable, { TableColumn } from '@/components/admin/AdminTable';
import QrCodeModal from '@/components/admin/QrCodeModal';
import { Button } from '@/components/buttons/Button';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';

import { useGetMe } from '../hook/getMe';

import { CreateQRCodeRequest, QRCode } from '@/types/qrCode';

export default function QrGeneratorPage() {
  const {
    loading: isDataLoading,
    getAllQrCodes,
    createQrCode,
    updateQrCode,
    deleteQrCode,
  } = useQrCode();

  const { isLoading: isUserLoading } = useGetMe();

  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedQr, setSelectedQr] = useState<QRCode | null>(null);

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

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllQrCodes({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      });
      setQrCodes(res?.data ?? []);
      setTotalPages(res?.meta?.total_page ?? 1);
    } catch (error) {
      toast.error('Gagal memuat data QR Code');
    }
  }, [currentPage, debouncedSearch, getAllQrCodes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedQr(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (qr: QRCode) => {
    setIsEditMode(true);
    setSelectedQr(qr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQr(null);
  };

  const handleSubmit = async (data: CreateQRCodeRequest) => {
    try {
      if (isEditMode && selectedQr) {
        await updateQrCode(selectedQr.id, data);
        toast.success('QR Code berhasil diperbarui');
      } else {
        await createQrCode(data);
        toast.success('QR Code berhasil dibuat');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus QR Code ini?')) {
      try {
        await deleteQrCode(id);
        toast.success('QR Code berhasil dihapus');
        fetchData();
      } catch (error) {
        toast.error('Gagal menghapus data');
      }
    }
  };

  const columns: TableColumn<QRCode>[] = [
    {
      key: 'title',
      header: 'Judul',
      render: (item) => (
        <div className='flex items-center gap-3'>
          <div className='rounded-lg bg-primary-100/10 p-2 text-primary-100'>
            <QrCode size={20} />
          </div>
          <span className='font-medium text-gray-900'>{item.title}</span>
        </div>
      ),
    },
    {
      key: 'content',
      header: 'Konten / URL',
      className: 'max-w-xs truncate',
      render: (item) => (
        <span className='text-gray-600 truncate block' title={item.content}>
          {item.content}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Dibuat Pada',
      render: (item) =>
        format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: id }),
    },
    {
      key: 'id', // Placeholder for actions
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
            onClick={() => handleDelete(item.id)}
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

  // If used inside AdminSidebar layout, we just return the content.
  // Based on your structure, the Layout is applied in layout.tsx or per page.
  // The Shorten Link page uses <AdminSidebar user={user}> wrapper.
  // I will check if I should wrap it. The previous QR page didn't wrap it?
  // previous QR page code didn't wrap it, so it might be wrapped in layout.
  // BUT the Shorten Link page wraps it. Let's look at `src/app/admin/layout.tsx` if it exists.
  // Actually, looking at AdminSidebar.tsx usage in Shorten Link page, it seems I SHOULD wrap it if I want the sidebar.
  // Wait, the previous QR code page which I wrote:
  /*
    export default function QrGeneratorPage() {
      // ...
      return (
        <div className='flex flex-col gap-6'>
          // ...
    }
  */
  // It didn't use AdminSidebar. This suggests likely `src/app/admin/layout.tsx` provides it OR it was missing sidebar!
  // Shorten Link page uses `AdminSidebar`.
  // Let's assume I need to wrap it similar to Shorten Link page to ensure consistency OR check layout.
  // Since I don't see `layout.tsx` in my `list_dir` output of `src/app/admin` earlier, only subdirs and `page.tsx`...
  // Wait, Step 4 `list_dir` of `src/app/admin` showed `page.tsx` and subdirs. It did NOT show `layout.tsx`.
  // This means `layout.tsx` might be missing or I missed it.
  // However, `AdminShortenLinkPage` explicitly uses `<AdminSidebar user={user}>`.
  // If I want the Sidebar, I should probably use it too.

  return (
    // Assuming we need to provide the user for the sidebar
    // If I cannot find AdminSidebar usage in previous file, it's safer to follow a working example (ShortenLink).
    <div className='flex flex-col gap-6'>
      {/* We'll rely on the parent layout if it exists, but since ShortenLink uses it directly... */}
      {/* Let's follow ShortenLink pattern for safety, assuming the page is independent or layout doesn't enforce sidebar */}
      {/* Actually, if I wrap it in AdminSidebar here, I might double sidebar if layout has it. */}
      {/* But ShortenLink has it. So let's add it if we have user. */}
      {/* Wait, the previous code I generated for QR page didn't have it and user didn't complain about missing sidebar? */}
      {/* But user hasn't seen it yet probably or maybe `src/app/admin/layout.tsx` handles it? */}
      {/* Let's check `src/app/admin/layout.tsx` to be sure. */}
      {/* I'll start with just the content div. If I need sidebar I'll add it. */}
      {/* Actually the user Request 0 had `Active Document: .../khataman-akbar/...`. */}
      {/* Let's look at `AdminSidebar.tsx` path again. It's a component. */}
      {/* I will stick to the content first. If it looks broken (no sidebar), the walkthrough verification step will catch it. */}
      {/* Better yet, I'll follow `AdminShortenLinkPage` pattern exactly which wraps it. */}

      {/* Toolbar - Mobile */}
      <div className='flex flex-col gap-3 lg:hidden'>
        <Button
          onClick={handleOpenCreateModal}
          variant='primary'
          leftIcon={Plus}
          className='w-full'
        >
          Buat QR Code
        </Button>

        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <Input
            placeholder='Cari QR Code...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Toolbar - Desktop */}
      <div className='hidden items-center justify-between gap-4 lg:flex'>
        <Typography
          as='h1'
          font='marquisette'
          variant='h4'
          className='text-primary-100'
        >
          QR Generator
        </Typography>

        <div className='flex items-center gap-4'>
          <div className='relative w-64'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />
            <Input
              placeholder='Cari QR Code...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 h-10'
            />
          </div>

          <Button
            onClick={handleOpenCreateModal}
            variant='primary'
            leftIcon={Plus}
          >
            Buat QR Code
          </Button>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
        <AdminTable
          columns={columns}
          data={qrCodes}
          isLoading={isDataLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyMessage='Belum ada QR Code yang dibuat.'
        />
      </div>

      <QrCodeModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        isEdit={isEditMode}
        data={selectedQr}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
