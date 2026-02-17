'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

import { useCreateRsvpManual } from '@/hooks/useRsvpAdmin';

import Button from '@/components/buttons/Button';
import Modal from '@/components/Modal';

import { RsvpAdminCreateRequest } from '@/types/rsvp';

// Validation schema
const rsvpAddSchema = z.object({
  fullname: z.string().min(1, 'Nama lengkap wajib diisi'),
  institution: z.string().min(1, 'Institusi wajib diisi'),
  event_name: z.string().min(1, 'Pilih event terlebih dahulu'),
});

type RsvpAddFormData = z.infer<typeof rsvpAddSchema>;

interface AdminRsvpAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEventName?: string;
}

export default function AdminRsvpAddModal({
  isOpen,
  onClose,
  selectedEventName,
}: AdminRsvpAddModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: createRsvp } = useCreateRsvpManual();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RsvpAddFormData>({
    resolver: zodResolver(rsvpAddSchema),
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        fullname: '',
        institution: '',
        event_name: selectedEventName,
      });
    }
  }, [isOpen, selectedEventName, reset]);

  const onFormSubmit = async (formData: RsvpAddFormData) => {
    setIsLoading(true);
    try {
      const payload: RsvpAdminCreateRequest = {
        fullname: formData.fullname,
        institution: formData.institution,
        event_name: formData.event_name,
      };

      const response = await createRsvp(payload);
      const generatedCode = response.data.code;

      toast.success(`Data RSVP berhasil ditambahkan. Kode: ${generatedCode}`, {
        duration: 5000,
      });
      reset();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Gagal menambahkan data RSVP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Tambah Data RSVP Manual'>
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
        {/* Nama Lengkap Field */}
        <div>
          <label
            htmlFor='fullname'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Nama Lengkap <span className='text-red-500'>*</span>
          </label>
          <input
            id='fullname'
            type='text'
            placeholder='Masukkan nama lengkap'
            className={`block w-full rounded-lg border ${
              errors.fullname ? 'border-red-500' : 'border-gray-300'
            } bg-white p-2.5 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100`}
            {...register('fullname')}
          />
          {errors.fullname && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.fullname.message}
            </p>
          )}
        </div>

        {/* Institusi Field */}
        <div>
          <label
            htmlFor='institution'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Institusi <span className='text-red-500'>*</span>
          </label>
          <input
            id='institution'
            type='text'
            placeholder='Masukkan nama institusi'
            className={`block w-full rounded-lg border ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            } bg-white p-2.5 text-sm text-gray-900 focus:border-primary-100 focus:ring-primary-100`}
            {...register('institution')}
          />
          {errors.institution && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.institution.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant='primary' type='submit' isLoading={isLoading}>
            Tambah
          </Button>
        </div>
      </form>
    </Modal>
  );
}
