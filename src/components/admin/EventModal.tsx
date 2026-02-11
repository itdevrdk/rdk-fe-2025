import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { RamadanEvent } from '@/types/event';

const eventSchema = z.object({
  title: z.string().min(1, 'Nama kegiatan wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  location: z.string().min(1, 'Lokasi wajib diisi'),
  date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  isLoading: boolean;
  editData?: RamadanEvent | null;
};

export default function EventModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editData,
}: EventModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  // Reset form when modal opens/closes or editData changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setValue('title', editData.title);
        setValue('description', editData.description);
        setValue('location', editData.location);
        // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
        setValue('date', editData.date ? editData.date.slice(0, 16) : '');
        setValue(
          'end_date',
          editData.end_date ? editData.end_date.slice(0, 16) : '',
        );
      } else {
        reset({
          title: '',
          description: '',
          location: '',
          date: '',
          end_date: '',
        });
      }
    }
  }, [isOpen, editData, reset, setValue]);

  const handleFormSubmit = (data: EventFormData) => {
    // Transform date to ISO string format (append :00Z if missing)
    // datetime-local gives YYYY-MM-DDTHH:mm
    const formattedData = {
      ...data,
      date: new Date(data.date).toISOString(),
      end_date: data.end_date
        ? new Date(data.end_date).toISOString()
        : undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Nama Kegiatan</Label>
            <Input
              id='title'
              placeholder='Contoh: Buka Bersama'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-xs text-red-500'>{errors.title.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Deskripsi</Label>
            <Textarea
              id='description'
              placeholder='Deskripsi kegiatan...'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-xs text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='location'>Lokasi</Label>
            <Input
              id='location'
              placeholder='Contoh: Masjid Utama'
              {...register('location')}
            />
            {errors.location && (
              <p className='text-xs text-red-500'>{errors.location.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='date'>Waktu Mulai</Label>
              <Input id='date' type='datetime-local' {...register('date')} />
              {errors.date && (
                <p className='text-xs text-red-500'>{errors.date.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='end_date'>Waktu Selesai</Label>
              <Input
                id='end_date'
                type='datetime-local'
                {...register('end_date')}
              />
              {errors.end_date && (
                <p className='text-xs text-red-500'>
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
