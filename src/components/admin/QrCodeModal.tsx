import { Dialog, Transition } from '@headlessui/react';
import { Download, X } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';

import Button from '@/components/buttons/Button';

import { CreateQRCodeRequest, QRCode as QRCodeType } from '@/types/qrCode';

interface QrCodeModalProps {
  isOpen: boolean;
  closeModal: () => void;
  isEdit: boolean;
  data: QRCodeType | null;
  onSubmit: (data: CreateQRCodeRequest) => void;
}

export default function QrCodeModal({
  isOpen,
  closeModal,
  isEdit,
  data,
  onSubmit,
}: QrCodeModalProps) {
  const [size, setSize] = useState(200);
  const [previewText, setPreviewText] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateQRCodeRequest>({
    defaultValues: {
      title: '',
      content: '',
      settings: {
        bgColor: '#ffffff',
        fgColor: '#000000',
      },
    },
  });

  const watchedContent = watch('content');
  const watchedBgColor = watch('settings.bgColor');
  const watchedFgColor = watch('settings.fgColor');

  useEffect(() => {
    setPreviewText(watchedContent);
  }, [watchedContent]);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && data) {
        setValue('title', data.title);
        setValue('content', data.content);
        setValue('settings.bgColor', data.settings?.bgColor || '#ffffff');
        setValue('settings.fgColor', data.settings?.fgColor || '#000000');
        setPreviewText(data.content);
      } else {
        reset({
          title: '',
          content: '',
          settings: {
            bgColor: '#ffffff',
            fgColor: '#000000',
          },
        });
        setPreviewText('');
      }
    }
  }, [isOpen, isEdit, data, setValue, reset]);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        // Did user disable logo? For now we assume always show as per request.
        // Use current settings for background
        ctx.fillStyle = watchedBgColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR Code
        ctx.drawImage(img, 0, 0);

        // Draw Logo
        const logoUrl = '/images/qrcode/logo-rdk.png';
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous'; // Needed if image is from external, but local is fine usually

        logoImg.onload = () => {
          const logoSize = size * 0.2; // 20% of QR size
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Draw Logo
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `qr-code-${Date.now()}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };

        // If logo fails to load, still download basic QR
        logoImg.onerror = () => {
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `qr-code-${Date.now()}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };

        logoImg.src = logoUrl;
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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
              <Dialog.Panel className='w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    {isEdit ? 'Edit QR Code' : 'Tambah QR Code Baru'}
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className='rounded-full p-1 hover:bg-gray-100'
                  >
                    <X size={20} className='text-gray-500' />
                  </button>
                </div>

                <div className='mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2'>
                  {/* Form Section */}
                  <form
                    id='qr-form'
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-4'
                  >
                    <div className='flex flex-col gap-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Judul
                      </label>
                      <input
                        {...register('title', {
                          required: 'Judul wajib diisi',
                        })}
                        className='rounded-lg border border-gray-300 p-2.5 outline-none focus:border-primary-100 focus:ring-1 focus:ring-primary-100'
                        placeholder='Contoh: Website Utama'
                      />
                      {errors.title && (
                        <span className='text-xs text-red-500'>
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    <div className='flex flex-col gap-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Konten / URL
                      </label>
                      <textarea
                        {...register('content', {
                          required: 'Konten wajib diisi',
                        })}
                        rows={4}
                        className='rounded-lg border border-gray-300 p-2.5 outline-none focus:border-primary-100 focus:ring-1 focus:ring-primary-100'
                        placeholder='https://...'
                      />
                      {errors.content && (
                        <span className='text-xs text-red-500'>
                          {errors.content.message}
                        </span>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>
                          Background Color
                        </label>
                        <div className='flex items-center gap-2'>
                          <input
                            type='color'
                            {...register('settings.bgColor')}
                            className='h-10 w-10 cursor-pointer rounded border border-gray-300 p-1'
                          />
                          <span className='text-sm text-gray-500'>
                            {watchedBgColor}
                          </span>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>
                          Foreground Color
                        </label>
                        <div className='flex items-center gap-2'>
                          <input
                            type='color'
                            {...register('settings.fgColor')}
                            className='h-10 w-10 cursor-pointer rounded border border-gray-300 p-1'
                          />
                          <span className='text-sm text-gray-500'>
                            {watchedFgColor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Preview Section */}
                  <div className='flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-6'>
                    <h4 className='font-medium text-gray-900'>Live Preview</h4>

                    <div className='flex flex-col items-center justify-center gap-4 bg-white p-4 shadow-sm rounded-lg'>
                      <div ref={qrRef} className='bg-white p-2 relative'>
                        <QRCode
                          value={previewText || 'https://rdk.its.ac.id'}
                          size={size}
                          bgColor={watchedBgColor}
                          fgColor={watchedFgColor}
                          level='H'
                        />
                        {/* Logo Overlay */}
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src='/images/qrcode/logo-rdk.svg'
                            alt='RDK Logo'
                            style={{ width: size * 0.2, height: size * 0.2 }}
                            className='object-contain'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Ukuran Download (px): {size}
                      </label>
                      <input
                        type='range'
                        min='128'
                        max='1024'
                        step='32'
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary-100'
                      />
                    </div>

                    <Button
                      type='button'
                      onClick={handleDownload}
                      disabled={!previewText}
                      variant='outline'
                      leftIcon={Download}
                      className='w-full'
                    >
                      Download PNG
                    </Button>
                  </div>
                </div>

                <div className='mt-8 flex justify-end gap-3 border-t border-gray-200 pt-4'>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type='submit'
                    form='qr-form' // Connects to the form via ID
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    {isEdit ? 'Simpan Perubahan' : 'Buat QR Code'}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
