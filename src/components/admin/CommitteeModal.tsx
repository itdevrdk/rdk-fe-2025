'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/buttons/Button';

import { Committee, CreateCommitteeForm } from '@/types/entities/presence';

interface CommitteeModalProps {
  isOpen: boolean;
  closeModal: () => void;
  isEdit?: boolean;
  isView?: boolean;
  data?: Committee | null;
  onSubmit: (data: CreateCommitteeForm) => Promise<void>;
  isLoading?: boolean;
}

export default function CommitteeModal({
  isOpen,
  closeModal,
  isEdit = false,
  isView = false,
  data,
  onSubmit,
  isLoading = false,
}: CommitteeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCommitteeForm>();

  // Set initial data for edit/view mode
  useEffect(() => {
    if ((isEdit || isView) && data) {
      setValue('fullname', data.fullname);
      setValue('major', data.major);
      setValue('nrp', data.nrp);
    } else {
      reset();
    }
  }, [isEdit, isView, data, setValue, reset]);

  const onFormSubmit = async (formData: CreateCommitteeForm) => {
    await onSubmit(formData);
    closeModal();
    reset();
  };

  const handleClose = () => {
    closeModal();
    reset();
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
                    ? 'Detail Panitia'
                    : isEdit
                      ? 'Edit Panitia'
                      : 'Tambah Panitia'}
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className='mt-4 space-y-4'
                >
                  {/* Fullname */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Nama Lengkap
                    </label>
                    <input
                      type='text'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-100'
                      placeholder='Masukkan nama lengkap'
                      disabled={isView}
                      {...register('fullname', {
                        required: 'Nama lengkap wajib diisi',
                      })}
                    />
                    {errors.fullname && (
                      <span className='text-xs text-red-500'>
                        {errors.fullname.message}
                      </span>
                    )}
                  </div>

                  {/* Major */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Jurusan
                    </label>
                    <input
                      type='text'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-100'
                      placeholder='Masukkan jurusan'
                      disabled={isView}
                      {...register('major', {
                        required: 'Jurusan wajib diisi',
                      })}
                    />
                    {errors.major && (
                      <span className='text-xs text-red-500'>
                        {errors.major.message}
                      </span>
                    )}
                  </div>

                  {/* NRP */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      NRP
                    </label>
                    <input
                      type='number'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-100'
                      placeholder='Masukkan NRP (10 digit)'
                      disabled={isView}
                      {...register('nrp', {
                        required: 'NRP wajib diisi',
                        valueAsNumber: true,
                        validate: (value) => {
                          if (!value || isNaN(value)) {
                            return 'NRP harus berupa angka';
                          }
                          const nrpStr = value.toString();
                          if (nrpStr.length !== 10) {
                            return 'NRP harus 10 digit';
                          }
                          return true;
                        },
                      })}
                    />
                    {errors.nrp && (
                      <span className='text-xs text-red-500'>
                        {errors.nrp.message}
                      </span>
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
