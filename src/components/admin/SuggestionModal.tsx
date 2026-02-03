'use client';

import { X } from 'lucide-react';
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

import { Suggestion, SuggestionStatus } from '@/types/entities/suggestion';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Suggestion | null;
  onUpdateStatus: (id: string, status: SuggestionStatus) => void;
  isLoading?: boolean;
}

const statusOptions: { value: SuggestionStatus; label: string }[] = [
  { value: SuggestionStatus.NEW, label: 'Baru' },
  { value: SuggestionStatus.READ, label: 'Dibaca' },
  { value: SuggestionStatus.SOLVED, label: 'Selesai' },
];

export default function SuggestionModal({
  isOpen,
  onClose,
  data,
  onUpdateStatus,
  isLoading = false,
}: SuggestionModalProps) {
  const [status, setStatus] = React.useState<SuggestionStatus>(
    SuggestionStatus.NEW,
  );

  React.useEffect(() => {
    if (isOpen && data) {
      setStatus(data.status);
    }
  }, [isOpen, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data) {
      onUpdateStatus(data.suggestion_id, status);
    }
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
              Detail Masukan
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className='px-6 pb-6 space-y-4'>
            {/* Sender Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nama Pengirim
                </label>
                <Input value={data.name} disabled className='bg-gray-50' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tanggal
                </label>
                <Input
                  value={new Date(data.timestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  disabled
                  className='bg-gray-50'
                />
              </div>
            </div>

            {/* Suggestion Content */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Isi Masukan
              </label>
              <textarea
                value={data.suggestion}
                disabled
                rows={8}
                className='w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-100'
              />
            </div>

            <hr className='my-4' />

            {/* Status Update Section */}
            <div className='bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200'>
              <Typography as='h4' variant='h6' className='text-gray-900'>
                Update Status
              </Typography>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Status Masukan
                </label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as SuggestionStatus)
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
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-3 mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isLoading}
              >
                Tutup
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
