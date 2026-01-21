import { X } from 'lucide-react';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

import { Presence } from '@/types/entities/presence';

interface EditReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  presence: Presence | null;
  onSubmit: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function EditReasonModal({
  isOpen,
  onClose,
  presence,
  onSubmit,
  isLoading = false,
}: EditReasonModalProps) {
  const [reason, setReason] = React.useState('');

  // Initialize reason when modal opens
  React.useEffect(() => {
    if (isOpen && presence) {
      setReason(presence.reason || '');
    }
  }, [isOpen, presence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(reason);
    onClose();
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  if (!isOpen || !presence) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-gray-200 p-6 bg-gradient-to-r from-primary-100 to-primary-200'>
          <div>
            <Typography
              as='h3'
              variant='h5'
              font='marquisette'
              className='text-white mb-1'
            >
              Edit Alasan Ketidakhadiran
            </Typography>
            <Typography variant='body' className='text-white/90 text-sm'>
              {presence.committee.fullname} - {presence.committee.nrp}
            </Typography>
          </div>
          <button
            onClick={handleClose}
            className='text-white hover:bg-white/20 rounded-full p-2 transition-colors'
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className='p-6'>
          {/* Event Info */}
          <div className='mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
            <Typography variant='body' className='text-gray-500 mb-1 text-xs'>
              Event
            </Typography>
            <Typography variant='body' className='font-medium'>
              {presence.committee_event.name}
            </Typography>
            <Typography variant='body' className='text-gray-600 mt-1 text-xs'>
              {new Date(presence.committee_event.timestamp).toLocaleString(
                'id-ID',
                {
                  dateStyle: 'full',
                  timeStyle: 'short',
                },
              )}
            </Typography>
          </div>

          {/* Reason Textarea */}
          <div className='mb-6'>
            <label htmlFor='reason' className='block mb-2'>
              <Typography variant='body' className='font-medium text-gray-700'>
                Alasan <span className='text-gray-400'>(Opsional)</span>
              </Typography>
            </label>
            <textarea
              id='reason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='Masukkan alasan ketidakhadiran...'
              rows={4}
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-100 transition-all resize-none'
              disabled={isLoading}
            />
            <Typography variant='body' className='text-gray-500 mt-1 text-xs'>
              {reason.length} karakter
            </Typography>
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1'
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type='submit'
              variant='primary'
              className='flex-1'
              isLoading={isLoading}
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
