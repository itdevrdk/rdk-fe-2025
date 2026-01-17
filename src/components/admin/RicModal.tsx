'use client';

import { ExternalLink, FileCheck, FileX, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  RicRegistration,
  RicRegistrationFormData,
  RicRegistrationStatus,
} from '@/types/entities/ric-admin';

type ModalMode = 'create' | 'edit' | 'view';

interface RicModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  data?: RicRegistration | null;
  onSubmit?: (data: RicRegistrationFormData) => void;
  isLoading?: boolean;
}

const eventTypes = [
  { value: 'MHQ', label: 'Musabaqah Hifdzil Quran' },
  { value: 'MTQ', label: 'Musabaqah Tilawatil Quran' },
  { value: 'DAI', label: "Da'i Muda" },
  { value: 'KTIQ', label: 'Kaligrafi & Tashih Quran' },
  { value: 'POSTER', label: 'Lomba Poster' },
  { value: 'VIDEOGRAFI', label: 'Lomba Videografi' },
];

const statusOptions: { value: RicRegistrationStatus; label: string }[] = [
  { value: 'VERIFIED', label: 'Terverifikasi' },
  { value: 'UNVERIFIED', label: 'Belum Terverifikasi' },
];

export default function RicModal({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit,
  isLoading = false,
}: RicModalProps) {
  const [formData, setFormData] = React.useState<RicRegistrationFormData>({
    team_name: '',
    event_type: '',
    institution: '',
    status: 'UNVERIFIED',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    province: '',
    city: '',
    supervisor_name: '',
    supervisor_phone: '',
  });

  // Reset form when modal opens or data changes
  React.useEffect(() => {
    if (isOpen && data && (mode === 'edit' || mode === 'view')) {
      setFormData({
        team_name: data.team_name || '',
        event_type: data.event_type || '',
        institution: data.institution || '',
        status: (data.status as RicRegistrationStatus) || 'UNVERIFIED',
        leader_name: data.leader_name || '',
        leader_email: data.leader_email || '',
        leader_phone: data.leader_phone || '',
        province: data.province || '',
        city: data.city || '',
        supervisor_name: data.supervisor_name || '',
        supervisor_phone: data.supervisor_phone || '',
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        team_name: '',
        event_type: '',
        institution: '',
        status: 'UNVERIFIED',
        leader_name: '',
        leader_email: '',
        leader_phone: '',
        province: '',
        city: '',
        supervisor_name: '',
        supervisor_phone: '',
      });
    }
  }, [isOpen, data, mode]);

  const handleChange = (
    field: keyof RicRegistrationFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Tambah Pendaftaran';
      case 'edit':
        return 'Edit Pendaftaran';
      case 'view':
        return 'Detail Pendaftaran';
      default:
        return 'Pendaftaran';
    }
  };

  const isReadOnly = mode === 'view';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-50 bg-black/50'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className='px-6 pt-6'>
            <Typography
              as='h2'
              font='marquisette'
              variant='h5'
              className='text-primary-100'
            >
              {getTitle()}
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {/* Nama Tim */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Nama Tim
                </label>
                <Input
                  value={formData.team_name}
                  onChange={(e) => handleChange('team_name', e.target.value)}
                  placeholder='Nama Tim'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* Jenis Lomba */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Jenis Lomba
                </label>
                {isReadOnly ? (
                  <Input
                    value={
                      eventTypes.find((e) => e.value === formData.event_type)
                        ?.label || formData.event_type
                    }
                    disabled
                    className='w-full'
                  />
                ) : (
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) => handleChange('event_type', value)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pilih Jenis Lomba' />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Institusi */}
              <div className='sm:col-span-2'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Institusi
                </label>
                <Input
                  value={formData.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  placeholder='Institusi'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* Nama Ketua */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Nama Ketua
                </label>
                <Input
                  value={formData.leader_name}
                  onChange={(e) => handleChange('leader_name', e.target.value)}
                  placeholder='Nama Ketua'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* Email Ketua */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Email Ketua
                </label>
                <Input
                  type='email'
                  value={formData.leader_email}
                  onChange={(e) => handleChange('leader_email', e.target.value)}
                  placeholder='Email Ketua'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* No. Telepon Ketua */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  No. Telepon Ketua
                </label>
                <Input
                  value={formData.leader_phone}
                  onChange={(e) => handleChange('leader_phone', e.target.value)}
                  placeholder='No. Telepon Ketua'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* Provinsi */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Provinsi
                </label>
                <Input
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  placeholder='Provinsi'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* Kota */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Kota/Kabupaten
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder='Kota/Kabupaten'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* Status */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Status
                </label>
                {isReadOnly ? (
                  <Input
                    value={
                      statusOptions.find((s) => s.value === formData.status)
                        ?.label || formData.status
                    }
                    disabled
                    className='w-full'
                  />
                ) : (
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleChange('status', value as RicRegistrationStatus)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pilih Status' />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Nama Pembimbing */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Nama Pembimbing
                </label>
                <Input
                  value={formData.supervisor_name}
                  onChange={(e) =>
                    handleChange('supervisor_name', e.target.value)
                  }
                  placeholder='Nama Pembimbing'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>

              {/* No. Telepon Pembimbing */}
              <div>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  No. Telepon Pembimbing
                </label>
                <Input
                  value={formData.supervisor_phone}
                  onChange={(e) =>
                    handleChange('supervisor_phone', e.target.value)
                  }
                  placeholder='No. Telepon Pembimbing'
                  disabled={isReadOnly}
                  className='w-full'
                />
              </div>
            </div>

            {/* Participants Section (View Mode Only) */}
            {isReadOnly &&
              data?.participants &&
              data.participants.length > 0 && (
                <div className='mt-6'>
                  <Typography
                    as='h3'
                    variant='h6'
                    className='mb-3 text-gray-900'
                  >
                    Peserta ({data.participants.length})
                  </Typography>
                  <div className='overflow-x-auto rounded-lg border border-gray-200'>
                    <table className='w-full text-sm'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-4 py-2 text-left font-medium text-gray-600'>
                            Role
                          </th>
                          <th className='px-4 py-2 text-left font-medium text-gray-600'>
                            Nama
                          </th>
                          <th className='px-4 py-2 text-left font-medium text-gray-600'>
                            Email
                          </th>
                          <th className='px-4 py-2 text-left font-medium text-gray-600'>
                            Telepon
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.participants.map((participant) => (
                          <tr
                            key={participant.id}
                            className='border-t border-gray-100'
                          >
                            <td className='px-4 py-2'>
                              <span
                                className={cn(
                                  'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                  participant.role === 'Ketua'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700',
                                )}
                              >
                                {participant.role}
                              </span>
                            </td>
                            <td className='px-4 py-2 text-gray-900'>
                              {participant.fullname}
                            </td>
                            <td className='px-4 py-2 text-gray-600'>
                              {participant.email}
                            </td>
                            <td className='px-4 py-2 text-gray-600'>
                              {participant.phone}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Documents Section (View Mode Only) */}
            {isReadOnly && data?.documents && (
              <div className='mt-6'>
                <Typography as='h3' variant='h6' className='mb-3 text-gray-900'>
                  Dokumen
                </Typography>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {/* Identity Card */}
                  <div
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3',
                      data.documents.identity_card?.uploaded
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50',
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      {data.documents.identity_card?.uploaded ? (
                        <FileCheck size={18} className='text-green-600' />
                      ) : (
                        <FileX size={18} className='text-gray-400' />
                      )}
                      <span className='text-sm text-gray-700'>
                        Kartu Identitas
                      </span>
                    </div>
                    {data.documents.identity_card?.uploaded &&
                      data.documents.identity_card?.url && (
                        <a
                          href={data.documents.identity_card.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1 text-sm text-blue-600 hover:underline'
                        >
                          Lihat <ExternalLink size={14} />
                        </a>
                      )}
                  </div>

                  {/* Statement Letter */}
                  <div
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3',
                      data.documents.statement_letter?.uploaded
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50',
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      {data.documents.statement_letter?.uploaded ? (
                        <FileCheck size={18} className='text-green-600' />
                      ) : (
                        <FileX size={18} className='text-gray-400' />
                      )}
                      <span className='text-sm text-gray-700'>
                        Surat Pernyataan
                      </span>
                    </div>
                    {data.documents.statement_letter?.uploaded &&
                      data.documents.statement_letter?.url && (
                        <a
                          href={data.documents.statement_letter.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1 text-sm text-blue-600 hover:underline'
                        >
                          Lihat <ExternalLink size={14} />
                        </a>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Registration Info (View Mode Only) */}
            {isReadOnly && data && (
              <div className='mt-6 rounded-lg bg-gray-50 p-4'>
                <div className='grid grid-cols-1 gap-2 text-sm sm:grid-cols-2'>
                  <div>
                    <span className='text-gray-500'>Kode Pendaftaran:</span>{' '}
                    <span className='font-medium text-gray-900'>
                      {data.registration_id}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-500'>Tanggal Daftar:</span>{' '}
                    <span className='font-medium text-gray-900'>
                      {new Date(data.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {data.participants_count !== undefined && (
                    <div>
                      <span className='text-gray-500'>Jumlah Peserta:</span>{' '}
                      <span className='font-medium text-gray-900'>
                        {data.participants_count} orang
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='w-full sm:w-auto'
              >
                {isReadOnly ? 'Tutup' : 'Batal'}
              </Button>
              {!isReadOnly && (
                <Button
                  type='submit'
                  variant='primary'
                  isLoading={isLoading}
                  className='w-full sm:w-auto'
                >
                  {mode === 'create' ? 'Tambah' : 'Simpan'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
