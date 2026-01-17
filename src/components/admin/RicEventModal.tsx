'use client';

import { AlertCircle, X } from 'lucide-react';
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

import { RicEvent, RicEventFormData } from '@/types/entities/ric-event';

type ModalMode = 'create' | 'edit' | 'view';

interface RicEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  data?: RicEvent | null;
  onSubmit?: (data: RicEventFormData) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const eventTypes = [
  { value: 'MHQ', label: 'Musabaqah Hifdzil Quran' },
  { value: 'MTQ', label: 'Musabaqah Tilawatil Quran' },
  { value: 'DAI', label: "Da'i Muda" },
  { value: 'KTIQ', label: 'Kaligrafi & Tashih Quran' },
  { value: 'POSTER', label: 'Lomba Poster' },
  { value: 'VIDEOGRAFI', label: 'Lomba Videografi' },
];

export default function RicEventModal({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit,
  isLoading = false,
  errorMessage = null,
}: RicEventModalProps) {
  const [formData, setFormData] = React.useState<RicEventFormData>({
    event_type: '',
    quota: 100,
  });

  // Reset form when modal opens or data changes
  React.useEffect(() => {
    if (isOpen && data && (mode === 'edit' || mode === 'view')) {
      setFormData({
        event_type: data.event_type || '',
        quota: data.quota || 100,
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        event_type: '',
        quota: 100,
      });
    }
  }, [isOpen, data, mode]);

  const handleChange = (
    field: keyof RicEventFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Tambah Event';
      case 'edit':
        return 'Edit Event';
      case 'view':
        return 'Detail Event';
      default:
        return 'Event';
    }
  };

  const isReadOnly = mode === 'view';

  if (!isOpen) return null;

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
        <div className='relative w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className='px-6 pt-6'>
            <Typography
              as='h2'
              font='marquisette'
              variant='h5'
              className='text-primary-100'
            >
              {getTitle()}
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-6'>
            <div className='flex flex-col gap-4'>
              {/* Jenis Lomba */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Jenis Lomba
                </label>
                {isReadOnly ? (
                  <Input
                    value={
                      eventTypes.find((e) => e.value === formData.event_type)
                        ?.label || formData.event_type
                    }
                    disabled
                    className='w-full'
                  />
                ) : (
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) => handleChange('event_type', value)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pilih Jenis Lomba' />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Kuota */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Kuota Peserta
                </label>
                <Input
                  type='number'
                  value={formData.quota}
                  onChange={(e) =>
                    handleChange('quota', parseInt(e.target.value) || 0)
                  }
                  placeholder='Kuota Peserta'
                  disabled={isReadOnly}
                  className='w-full'
                  min={1}
                  max={1000}
                />
                {mode === 'edit' && data && data.registration_count > 0 && (
                  <p className='mt-1 text-xs text-gray-500'>
                    Kuota minimal: {data.registration_count} (sesuai jumlah
                    pendaftar saat ini)
                  </p>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className='flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
                  <AlertCircle size={16} className='mt-0.5 flex-shrink-0' />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Event Info (View Mode Only) */}
            {isReadOnly && data && (
              <div className='mt-6 rounded-lg bg-gray-50 p-4'>
                <div className='flex flex-col gap-2 text-sm'>
                  <div>
                    <span className='text-gray-500'>ID Event:</span>{' '}
                    <span className='font-mono text-xs text-gray-900'>
                      {data.id}
                    </span>
                  </div>
                  {data.registration_count !== undefined && (
                    <div>
                      <span className='text-gray-500'>Peserta Terdaftar:</span>{' '}
                      <span className='font-medium text-gray-900'>
                        {data.registration_count} / {data.quota}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className='text-gray-500'>Dibuat:</span>{' '}
                    <span className='font-medium text-gray-900'>
                      {new Date(data.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='w-full sm:w-auto'
              >
                {isReadOnly ? 'Tutup' : 'Batal'}
              </Button>
              {!isReadOnly && (
                <Button
                  type='submit'
                  variant='primary'
                  isLoading={isLoading}
                  className='w-full sm:w-auto'
                >
                  {mode === 'create' ? 'Tambah' : 'Simpan'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
