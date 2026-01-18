import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Button from '@/components/buttons/Button';

import { CreateShortenLinkRequest, ShortenLink } from '@/types/shortenLink';

interface ShortenLinkModalProps {
  isOpen: boolean;
  closeModal: () => void;
  isEdit?: boolean;
  data?: ShortenLink | null;
  onSubmit: (data: CreateShortenLinkRequest) => Promise<void>;
}

export default function ShortenLinkModal({
  isOpen,
  closeModal,
  isEdit = false,
  data,
  onSubmit,
}: ShortenLinkModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateShortenLinkRequest>();

  // Set initial data for edit mode
  useEffect(() => {
    if (isEdit && data) {
      setValue('shorten_link', data.shorten_link);
      setValue('original_link', data.original_link);
    } else {
      reset();
    }
  }, [isEdit, data, setValue, reset]);

  const onFormSubmit = async (formData: CreateShortenLinkRequest) => {
    setIsLoading(true);
    try {
      await onSubmit(formData);
      closeModal();
      reset();
    } catch (error) {
      toast.error('Gagal menyimpan data shorten link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={closeModal}>
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
                  {isEdit ? 'Edit Shorten Link' : 'Tambah Shorten Link'}
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className='mt-4 space-y-4'
                >
                  {/* Shorten Link Suffix */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Custom Short Link (Suffix)
                    </label>
                    <div className='mt-1 flex rounded-md shadow-sm'>
                      <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500'>
                        rdk-its.com/s/
                      </span>
                      <input
                        type='text'
                        className='block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                        placeholder='my-link'
                        {...register('shorten_link', {
                          required: 'Short link wajib diisi',
                          pattern: {
                            value: /^[a-zA-Z0-9-_]+$/,
                            message:
                              'Hanya huruf, angka, strip, dan underscore',
                          },
                        })}
                      />
                    </div>
                    {errors.shorten_link && (
                      <span className='text-xs text-red-500'>
                        {errors.shorten_link.message}
                      </span>
                    )}
                  </div>

                  {/* Original Link */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Original Link
                    </label>
                    <input
                      type='url'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                      placeholder='https://example.com'
                      {...register('original_link', {
                        required: 'Original link wajib diisi',
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message:
                            'Format URL tidak valid (harus diawali http/https)',
                        },
                      })}
                    />
                    {errors.original_link && (
                      <span className='text-xs text-red-500'>
                        {errors.original_link.message}
                      </span>
                    )}
                  </div>

                  <div className='mt-6 flex justify-end gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={closeModal}
                      disabled={isLoading}
                    >
                      Batal
                    </Button>
                    <Button
                      type='submit'
                      variant='primary'
                      isLoading={isLoading}
                    >
                      {isEdit ? 'Simpan Perubahan' : 'Simpan Link'}
                    </Button>
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
