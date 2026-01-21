import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Button from '@/components/buttons/Button';

import { formatIDR } from '@/utils/format';

import { CreateFinanceReportForm, FinanceReport } from '@/types/finance';

interface FinanceModalProps {
  isOpen: boolean;
  closeModal: () => void;
  isEdit?: boolean;
  data?: FinanceReport | null;
  onSubmit: (data: CreateFinanceReportForm) => Promise<void>;
}

export default function FinanceModal({
  isOpen,
  closeModal,
  isEdit = false,
  data,
  onSubmit,
}: FinanceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateFinanceReportForm>();

  const income = watch('income');
  const expenses = watch('expenses');

  // Set initial data for edit mode
  useEffect(() => {
    if (isEdit && data) {
      setValue('income', data.income);
      setValue('expenses', data.expenses);
      setValue('target', data.target);
    } else {
      reset();
    }
  }, [isEdit, data, setValue, reset]);

  const onFormSubmit = async (formData: CreateFinanceReportForm) => {
    setIsLoading(true);
    try {
      const payload: CreateFinanceReportForm = {
        income: Number(formData.income),
        expenses: Number(formData.expenses),
        target: Number(formData.target),
      };

      await onSubmit(payload);
      closeModal();
      reset();
    } catch (error) {
      toast.error('Gagal menyimpan data laporan keuangan');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBalance = () => {
    const inc = Number(income || 0);
    const exp = Number(expenses || 0);
    return inc - exp;
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
                  {isEdit
                    ? 'Edit Laporan Keuangan'
                    : 'Tambah Laporan Keuangan Harian'}
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className='mt-4 space-y-4'
                >
                  {/* Income */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Pemasukan Hari Ini
                    </label>
                    <p className='mt-1 text-xs text-gray-500'>
                      Masukkan pemasukan untuk hari ini (bukan total kumulatif)
                    </p>
                    <input
                      type='number'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                      placeholder='Contoh: 5000000'
                      {...register('income', {
                        required: 'Pemasukan wajib diisi',
                        min: 0,
                      })}
                    />
                    {errors.income && (
                      <span className='text-xs text-red-500'>
                        {errors.income.message}
                      </span>
                    )}
                  </div>

                  {/* Expenses */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Pengeluaran Hari Ini
                    </label>
                    <p className='mt-1 text-xs text-gray-500'>
                      Masukkan pengeluaran untuk hari ini (bukan total
                      kumulatif)
                    </p>
                    <input
                      type='number'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                      placeholder='Contoh: 2000000'
                      {...register('expenses', {
                        required: 'Pengeluaran wajib diisi',
                        min: 0,
                      })}
                    />
                    {errors.expenses && (
                      <span className='text-xs text-red-500'>
                        {errors.expenses.message}
                      </span>
                    )}
                  </div>

                  {/* Target */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Target Dana
                    </label>
                    <input
                      type='number'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                      placeholder='Contoh: 50000000'
                      {...register('target', {
                        required: 'Target wajib diisi',
                        min: 0,
                      })}
                    />
                    {errors.target && (
                      <span className='text-xs text-red-500'>
                        {errors.target.message}
                      </span>
                    )}
                  </div>

                  {/* READ ONLY PREVIEWS */}
                  <div className='rounded-md bg-gray-50 p-3'>
                    <p className='text-sm text-gray-600'>
                      Balance Hari Ini:{' '}
                      <span className='font-bold'>
                        {formatIDR(calculateBalance())}
                      </span>
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      Balance = Pemasukan - Pengeluaran untuk hari ini
                    </p>
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
                      {isEdit ? 'Simpan Perubahan' : 'Tambah Laporan'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        g
      </Dialog>
    </Transition>
  );
}
