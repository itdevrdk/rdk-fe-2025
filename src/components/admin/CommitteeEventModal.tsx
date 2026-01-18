'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/buttons/Button';

import {
  CommitteeEvent,
  CreateCommitteeEventForm,
} from '@/types/entities/presence';

interface CommitteeEventModalProps {
  isOpen: boolean;
  closeModal: () => void;
  isEdit?: boolean;
  isView?: boolean;
  data?: CommitteeEvent | null;
  onSubmit: (data: CreateCommitteeEventForm) => Promise<void>;
  isLoading?: boolean;
}

export default function CommitteeEventModal({
  isOpen,
  closeModal,
  isEdit = false,
  isView = false,
  data,
  onSubmit,
  isLoading = false,
}: CommitteeEventModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCommitteeEventForm>();

  // Set initial data for edit/view mode
  useEffect(() => {
    if ((isEdit || isView) && data) {
      setValue('name', data.name);
      // Format timestamp for datetime-local input
      if (data.timestamp) {
        const date = new Date(data.timestamp);
        const formattedDate = date.toISOString().slice(0, 16);
        setValue('timestamp', formattedDate);
      }
    } else {
      reset();
    }
  }, [isEdit, isView, data, setValue, reset]);

  const onFormSubmit = async (formData: CreateCommitteeEventForm) => {
    // Convert datetime-local to ISO string
    if (formData.timestamp) {
      formData.timestamp = new Date(formData.timestamp).toISOString();
    }
    await onSubmit(formData);
    closeModal();
    reset();
  };

  const handleClose = () => {
    closeModal();
    reset();
  };

  // Format date for display in view mode
  const formatDateDisplay = (timestamp?: string) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  {isView
                    ? 'Detail Event'
                    : isEdit
                      ? 'Edit Event'
                      : 'Tambah Event'}
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className='mt-4 space-y-4'
                >
                  {/* Event Name */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Nama Event
                    </label>
                    <input
                      type='text'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-100'
                      placeholder='Masukkan nama event'
                      disabled={isView}
                      {...register('name', {
                        required: 'Nama event wajib diisi',
                      })}
                    />
                    {errors.name && (
                      <span className='text-xs text-red-500'>
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Waktu Event
                    </label>
                    {isView ? (
                      <p className='mt-1 text-sm text-gray-900'>
                        {formatDateDisplay(data?.timestamp)}
                      </p>
                    ) : (
                      <input
                        type='datetime-local'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-100'
                        disabled={isView}
                        {...register('timestamp')}
                      />
                    )}
                  </div>

                  <div className='mt-6 flex justify-end gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      {isView ? 'Tutup' : 'Batal'}
                    </Button>
                    {!isView && (
                      <Button
                        type='submit'
                        variant='primary'
                        isLoading={isLoading}
                      >
                        {isEdit ? 'Simpan Perubahan' : 'Simpan'}
                      </Button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
