import { format } from 'date-fns';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useUpsertDailyInfo } from '@/app/admin/daily-info/hook/useDailyInfo';

import { CreateDailyInfoRequest, DailyInfo } from '@/types/entities/daily-info';

type DailyInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: DailyInfo | null;
};

export default function DailyInfoModal({
  isOpen,
  onClose,
  data,
}: DailyInfoModalProps) {
  const { mutateAsync: upsertDailyInfo, isPending } = useUpsertDailyInfo();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateDailyInfoRequest>();

  React.useEffect(() => {
    if (data) {
      setValue('date', data.date);
      setValue('sahur_menu', data.sahur_menu);
      setValue('iftar_menu', data.iftar_menu);
      setValue('kajian_title', data.kajian_title);
      setValue('kajian_speaker', data.kajian_speaker);
      setValue('special_event', data.special_event);
      setValue('program_title', data.program_title);
    } else {
      reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        sahur_menu: '',
        iftar_menu: '',
        kajian_title: '',
        kajian_speaker: '',
        special_event: '',
        program_title: '',
      });
    }
  }, [data, reset, setValue, isOpen]);

  const onSubmit = async (formData: CreateDailyInfoRequest) => {
    try {
      await upsertDailyInfo(formData);
      toast.success('Berhasil menyimpan data Daily Info');
      onClose();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Gagal menyimpan data Daily Info');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>
            {data ? 'Edit Daily Info' : 'Tambah Daily Info'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='date'>Tanggal</Label>
            <Input
              id='date'
              type='date'
              {...register('date', { required: 'Tanggal wajib diisi' })}
              disabled={!!data}
              readOnly={!!data}
            />
            {errors.date && (
              <p className='text-xs text-red-500'>{errors.date.message}</p>
            )}
            {data && (
              <p className='text-xs text-gray-500'>
                Tanggal tidak dapat diubah pada mode edit
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='sahur_menu'>Menu Sahur</Label>
              <Input id='sahur_menu' {...register('sahur_menu')} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='iftar_menu'>Menu Berbuka</Label>
              <Input id='iftar_menu' {...register('iftar_menu')} />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='kajian_title'>Judul Kajian</Label>
              <Input id='kajian_title' {...register('kajian_title')} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='kajian_speaker'>Pemateri Kajian</Label>
              <Input id='kajian_speaker' {...register('kajian_speaker')} />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='special_event'>Event Spesial</Label>
              <Input id='special_event' {...register('special_event')} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='program_title'>Judul Program</Label>
              <Input id='program_title' {...register('program_title')} />
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={onClose} type='button'>
              Batal
            </Button>
            <Button type='submit' isLoading={isPending}>
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
