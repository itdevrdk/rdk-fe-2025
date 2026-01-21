'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Button from '@/components/buttons/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Committee,
  CommitteeEvent,
  CreatePresenceForm,
  Presence,
  PresenceStatus,
} from '@/types/entities/presence';

interface PresenceModalProps {
  isOpen: boolean;
  closeModal: () => void;
  isEdit?: boolean;
  isView?: boolean;
  data?: Presence | null;
  onSubmit: (data: CreatePresenceForm) => Promise<void>;
  isLoading?: boolean;
  committees: Committee[];
  events: CommitteeEvent[];
}

export default function PresenceModal({
  isOpen,
  closeModal,
  isEdit = false,
  isView = false,
  data,
  onSubmit,
  isLoading = false,
  committees,
  events,
}: PresenceModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePresenceForm>();

  // Set initial data for edit/view mode
  useEffect(() => {
    if ((isEdit || isView) && data) {
      setValue('committee_id', data.committee_id);
      setValue('committee_event_id', data.committee_event_id);
      setValue('status', data.status);
    } else {
      reset();
    }
  }, [isEdit, isView, data, setValue, reset]);

  const onFormSubmit = async (formData: CreatePresenceForm) => {
    await onSubmit(formData);
    closeModal();
    reset();
  };

  const handleClose = () => {
    closeModal();
    reset();
  };

  const statusLabels: Record<PresenceStatus, string> = {
    attend: 'Hadir',
    permit: 'Izin',
    skip: 'Tidak Hadir',
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
                    ? 'Detail Presensi'
                    : isEdit
                      ? 'Edit Presensi'
                      : 'Tambah Presensi'}
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className='mt-4 space-y-4'
                >
                  {/* Committee Select */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Panitia
                    </label>
                    {isView ? (
                      <p className='mt-1 text-sm text-gray-900'>
                        {data?.committee?.fullname || '-'}
                      </p>
                    ) : (
                      <Controller
                        name='committee_id'
                        control={control}
                        rules={{ required: 'Panitia wajib dipilih' }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isEdit}
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Pilih panitia' />
                            </SelectTrigger>
                            <SelectContent>
                              {committees.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.fullname} ({c.nrp})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                    {errors.committee_id && (
                      <span className='text-xs text-red-500'>
                        {errors.committee_id.message}
                      </span>
                    )}
                  </div>

                  {/* Event Select */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Event
                    </label>
                    {isView ? (
                      <p className='mt-1 text-sm text-gray-900'>
                        {data?.committee_event?.name || '-'}
                      </p>
                    ) : (
                      <Controller
                        name='committee_event_id'
                        control={control}
                        rules={{ required: 'Event wajib dipilih' }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isEdit}
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Pilih event' />
                            </SelectTrigger>
                            <SelectContent>
                              {events.map((e) => (
                                <SelectItem key={e.id} value={e.id}>
                                  {e.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                    {errors.committee_event_id && (
                      <span className='text-xs text-red-500'>
                        {errors.committee_event_id.message}
                      </span>
                    )}
                  </div>

                  {/* Status Select */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Status
                    </label>
                    {isView ? (
                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          data?.status === 'attend'
                            ? 'bg-green-100 text-green-700'
                            : data?.status === 'permit'
                              ? 'bg-yellow-100 text-orange-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {data?.status ? statusLabels[data.status] : '-'}
                      </span>
                    ) : (
                      <Controller
                        name='status'
                        control={control}
                        rules={{ required: 'Status wajib dipilih' }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Pilih status' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='attend'>Hadir</SelectItem>
                              <SelectItem value='permit'>Izin</SelectItem>
                              <SelectItem value='skip'>Tidak Hadir</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                    {errors.status && (
                      <span className='text-xs text-red-500'>
                        {errors.status.message}
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
