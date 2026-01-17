'use client';

import { AlertTriangle, X } from 'lucide-react';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Hapus Data',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
}: DeleteConfirmModalProps) {
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
        <div className='relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className='flex flex-col items-center text-center'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-6 w-6 text-red-600' />
            </div>
            <Typography
              as='h3'
              font='zabal'
              weight='bold'
              className='mb-2 text-lg text-gray-900'
            >
              {title}
            </Typography>
            <Typography
              as='p'
              font='zabal'
              className='mb-6 text-sm text-gray-600'
            >
              {message}
            </Typography>

            {/* Actions */}
            <div className='flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='w-full sm:w-auto'
              >
                Batal
              </Button>
              <Button
                type='button'
                variant='primary'
                onClick={onConfirm}
                isLoading={isLoading}
                className='w-full bg-red-600 hover:bg-red-700 sm:w-auto'
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
