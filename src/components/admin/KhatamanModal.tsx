'use client';

import { ExternalLink, X } from 'lucide-react';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  KhatamanParticipant,
  KhatamanRegistrationStatus,
  KhatamanStatusUpdatePayload,
} from '@/types/entities/khataman';

interface KhatamanModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KhatamanParticipant | null;
  onUpdateStatus: (payload: KhatamanStatusUpdatePayload) => void;
  isLoading?: boolean;
}

const statusOptions: { value: KhatamanRegistrationStatus; label: string }[] = [
  { value: 'REGISTERED', label: 'Terdaftar' },
  { value: 'SELECTED', label: 'Terpilih' },
  { value: 'REJECTED', label: 'Ditolak' },
];

export default function KhatamanModal({
  isOpen,
  onClose,
  data,
  onUpdateStatus,
  isLoading = false,
}: KhatamanModalProps) {
  const [status, setStatus] =
    React.useState<KhatamanRegistrationStatus>('REGISTERED');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (isOpen && data) {
      setStatus(data.registration_status);
      setNotes(data.notes || '');
    }
  }, [isOpen, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus({ registration_status: status, notes });
  };

  if (!isOpen || !data) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-50 bg-black/50'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className='px-6 pt-6 mb-4'>
            <Typography
              as='h2'
              font='marquisette'
              variant='h5'
              className='text-primary-100'
            >
              Detail Peserta Khataman
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className='px-6 pb-6 space-y-4'>
            {/* Personal Info Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nama Lengkap
                </label>
                <Input value={data.full_name} disabled className='bg-gray-50' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <Input value={data.email} disabled className='bg-gray-50' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  No. WhatsApp
                </label>
                <Input value={data.phone} disabled className='bg-gray-50' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tipe Peserta
                </label>
                <Input
                  value={data.participant_type}
                  disabled
                  className='bg-gray-50'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Komitmen
                </label>
                <Input
                  value={
                    data.commitment_level === 'SIAP'
                      ? 'Siap'
                      : data.commitment_level === 'DIUSAHAKAN'
                        ? 'Insya Allah Diusahkan'
                        : 'Tidak Siap'
                  }
                  disabled
                  className='bg-gray-50'
                />
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Motivasi
              </label>
              <textarea
                value={data.motivation || 'Tidak ada motivasi'}
                disabled
                rows={3}
                className='w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              />
            </div>

            {/* Proof of Follow */}
            {data.follow_proof_url ? (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Bukti Follow
                </label>
                <a
                  href={data.follow_proof_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 text-blue-600 hover:underline text-sm'
                >
                  <ExternalLink size={16} /> Lihat Bukti Follow
                </a>
              </div>
            ) : (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Bukti Follow
                </label>
                <span className='text-sm text-gray-500 italic'>
                  Tidak ada bukti upload
                </span>
              </div>
            )}

            <hr className='my-4' />

            {/* Status Update Section */}
            <div className='bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200'>
              <Typography as='h4' variant='h6' className='text-gray-900'>
                Update Status
              </Typography>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Status Pendaftaran
                </label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as KhatamanRegistrationStatus)
                  }
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder='Pilih Status' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Catatan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='Tambahkan catatan untuk peserta ini...'
                  rows={2}
                  className='w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-3 mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type='submit' variant='primary' isLoading={isLoading}>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
