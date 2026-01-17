'use client';

import { ChevronLeft, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaUser,
  FaUsers,
} from 'react-icons/fa';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useCheckRegistration } from '@/app/ric/hook/useCheckRegistration';

import {
  DocumentStatus,
  EventKey,
  Participant,
  RegistrationData,
  RegistrationStatus,
  TeamDocumentStatus,
} from '@/types/entities/ric';

const EVENT_OPTIONS: { value: EventKey; label: string }[] = [
  { value: 'MHQ', label: 'MHQ (Individu)' },
  { value: 'MTQ', label: 'MTQ (Individu)' },
  { value: 'DAI', label: 'Dai (Individu)' },
  { value: 'KTIQ', label: 'KTIQ (Tim)' },
  { value: 'POSTER', label: 'Poster (Individu)' },
  { value: 'VIDEOGRAFI', label: 'Videografi (Tim)' },
];

const STATUS_CONFIG: Record<
  RegistrationStatus,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  pending: {
    icon: <FaHourglassHalf className='text-xl' />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  verified: {
    icon: <FaCheckCircle className='text-xl' />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  rejected: {
    icon: <FaTimesCircle className='text-xl' />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  revision_needed: {
    icon: <FaExclamationCircle className='text-xl' />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
};

const DOCUMENT_LABELS: Record<string, string> = {
  identity_card: 'Kartu Identitas',
  identity_cards: 'Kartu Identitas Tim',
  statement_link: 'Surat Pernyataan',
  payment_proof: 'Bukti Pembayaran',
  portfolio: 'Portofolio',
};

const isTeamDocumentStatus = (
  doc: DocumentStatus | TeamDocumentStatus,
): doc is TeamDocumentStatus => {
  return (
    'total' in doc && 'uploaded' in doc && typeof doc.uploaded === 'number'
  );
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Component to display participant info
const ParticipantCard = ({ participant }: { participant: Participant }) => (
  <div className='bg-gray-50 rounded-lg p-4'>
    <div className='flex items-center gap-2 mb-3'>
      <FaUser className='text-[#681819]' />
      <span className='font-semibold text-[#681819]'>
        {participant.role ? `${participant.role} - ` : ''}
        {participant.fullname}
      </span>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700'>
      <p>
        <span className='font-medium'>Email:</span> {participant.email}
      </p>
      <p>
        <span className='font-medium'>Telepon:</span> {participant.phone}
      </p>
      <p>
        <span className='font-medium'>Institusi:</span>{' '}
        {participant.institution}
      </p>
      <p>
        <span className='font-medium'>Lokasi:</span> {participant.city},{' '}
        {participant.province}
      </p>
    </div>
  </div>
);

// Component to display registration result
const RegistrationResult = ({
  data,
  onReset,
}: {
  data: RegistrationData;
  onReset: () => void;
}) => {
  const statusConfig = STATUS_CONFIG[data.status];

  return (
    <div className='bg-white rounded-2xl p-6 md:p-8 shadow-lg w-full'>
      {/* Header with Status */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <Typography
            as='h2'
            variant='h3'
            weight='bold'
            className='text-[#681819] text-xl md:text-2xl'
          >
            {data.event_name}
          </Typography>
          <p className='text-gray-600 text-sm mt-1'>
            ID Registrasi:{' '}
            <span className='font-mono'>{data.registration_id}</span>
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}
        >
          {statusConfig.icon}
          <span className='font-semibold'>{data.status_label}</span>
        </div>
      </div>

      {/* Registration Type Badge */}
      <div className='flex items-center gap-2 mb-6'>
        {data.registration_type === 'team' ? (
          <FaUsers className='text-[#681819]' />
        ) : (
          <FaUser className='text-[#681819]' />
        )}
        <span className='text-sm font-medium text-[#681819]'>
          {data.registration_type === 'team'
            ? 'Pendaftaran Tim'
            : 'Pendaftaran Individu'}
        </span>
        <span className='text-sm text-gray-500'>
          • Terdaftar {formatDate(data.registered_at)}
        </span>
      </div>

      {/* Team Name (if team) */}
      {data.registration_type === 'team' && data.team_name && (
        <div className='mb-6'>
          <h3 className='font-semibold text-[#681819] mb-2'>Nama Tim</h3>
          <p className='text-gray-700 text-lg'>{data.team_name}</p>
        </div>
      )}

      {/* Participant(s) Section */}
      <div className='mb-6'>
        <h3 className='font-semibold text-[#681819] mb-3'>
          {data.registration_type === 'team' ? 'Anggota Tim' : 'Data Peserta'}
        </h3>
        <div className='space-y-3'>
          {data.registration_type === 'team' && data.participants ? (
            data.participants.map((participant, index) => (
              <ParticipantCard key={index} participant={participant} />
            ))
          ) : data.participant ? (
            <ParticipantCard participant={data.participant} />
          ) : null}
        </div>
      </div>

      {/* Supervisor (if exists) */}
      {data.supervisor && (
        <div className='mb-6'>
          <h3 className='font-semibold text-[#681819] mb-2'>Pendamping</h3>
          <div className='bg-gray-50 rounded-lg p-4'>
            <p className='text-gray-700'>
              <span className='font-medium'>Nama:</span> {data.supervisor.name}
            </p>
            <p className='text-gray-700'>
              <span className='font-medium'>Telepon:</span>{' '}
              {data.supervisor.phone}
            </p>
          </div>
        </div>
      )}

      {/* Documents Section */}
      {data.documents && Object.keys(data.documents).length > 0 && (
        <div className='mb-6'>
          <h3 className='font-semibold text-[#681819] mb-3'>Status Dokumen</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {Object.entries(data.documents).map(([key, doc]) => (
              <div
                key={key}
                className='bg-gray-50 rounded-lg p-3 flex items-center justify-between'
              >
                <span className='text-sm text-gray-700'>
                  {DOCUMENT_LABELS[key] || key}
                </span>
                {isTeamDocumentStatus(doc) ? (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      doc.verified === doc.total
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {doc.verified}/{doc.total} Terverifikasi
                  </span>
                ) : (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      doc.verified
                        ? 'bg-green-100 text-green-600'
                        : doc.uploaded
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {doc.verified
                      ? 'Terverifikasi'
                      : doc.uploaded
                        ? 'Menunggu Verifikasi'
                        : 'Belum Diunggah'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Reason or Notes */}
      {(data.rejection_reason || data.notes) && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            data.status === 'rejected' || data.status === 'revision_needed'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <h3
            className={`font-semibold mb-2 ${
              data.status === 'rejected' || data.status === 'revision_needed'
                ? 'text-red-700'
                : 'text-blue-700'
            }`}
          >
            {data.rejection_reason ? 'Alasan Penolakan' : 'Catatan'}
          </h3>
          <p
            className={`text-sm ${
              data.status === 'rejected' || data.status === 'revision_needed'
                ? 'text-red-600'
                : 'text-blue-600'
            }`}
          >
            {data.rejection_reason || data.notes}
          </p>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={onReset}
        className='w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors text-sm md:text-base'
      >
        Cek Pendaftaran Lainnya
      </button>
    </div>
  );
};

// Not Found Component
const NotFoundResult = ({ onReset }: { onReset: () => void }) => (
  <div className='bg-white rounded-2xl p-6 md:p-8 shadow-lg w-full text-center'>
    <FaExclamationCircle className='text-5xl text-yellow-500 mx-auto mb-4' />
    <Typography
      as='h2'
      variant='h3'
      weight='bold'
      className='text-[#681819] text-xl md:text-2xl mb-4'
    >
      Data Tidak Ditemukan
    </Typography>
    <p className='text-gray-600 mb-6'>
      Tidak ditemukan data pendaftaran dengan informasi yang Anda masukkan.
      Pastikan email, nama, atau nomor HP yang dimasukkan sesuai dengan yang
      digunakan saat mendaftar.
    </p>
    <button
      onClick={onReset}
      className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors text-sm md:text-base'
    >
      Coba Lagi
    </button>
  </div>
);

// Error Component
const ErrorResult = ({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) => (
  <div className='bg-white rounded-2xl p-6 md:p-8 shadow-lg w-full text-center'>
    <FaTimesCircle className='text-5xl text-red-500 mx-auto mb-4' />
    <Typography
      as='h2'
      variant='h3'
      weight='bold'
      className='text-[#681819] text-xl md:text-2xl mb-4'
    >
      Terjadi Kesalahan
    </Typography>
    <p className='text-gray-600 mb-6'>{message}</p>
    <button
      onClick={onReset}
      className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors text-sm md:text-base'
    >
      Coba Lagi
    </button>
  </div>
);

export default function RICCheckPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState<EventKey | ''>('');

  const {
    registrationData,
    isLoading,
    error,
    isNotFound,
    checkRegistration,
    reset,
  } = useCheckRegistration();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || !eventType) return;

    await checkRegistration({
      query: searchQuery,
      event_type: eventType as EventKey,
    });
  };

  const handleReset = () => {
    reset();
    setSearchQuery('');
    setEventType('');
  };

  // Determine if we should show results
  const showResults = registrationData || isNotFound || error;

  return (
    <Layout withNavbar withFooter>
      {/* RSVP FORM SECTION */}
      <section className='relative bg-[#FFE9B5] min-h-screen flex flex-col overflow-hidden pb-64 md:pb-80 lg:pb-0'>
        {/* Top Right Decoration - Lamps */}
        <NextImage
          src='/images/nuzulul-quran/register/top-right-decoration-lamp.png'
          alt='Top Right Decoration'
          width={147}
          height={243}
          className='absolute top-0 right-0 z-10 right-6 lg:right-32 w-18'
        />

        {/* Bottom Left Decoration */}
        <NextImage
          src='/images/nuzulul-quran/register/botom-left-deocartion.png'
          alt='Bottom Left Decoration'
          width={800}
          height={552}
          className='absolute bottom-0 left-0 z-5'
        />

        {/* Bottom Right Stars */}
        <NextImage
          src='/images/nuzulul-quran/register/bottom-right-stars.png'
          alt='Bottom Right Stars'
          width={280}
          height={260}
          className='absolute bottom-0 right-0 z-5'
        />

        {/* Mosque Decoration */}
        <NextImage
          src='/images/nuzulul-quran/register/mosque.png'
          alt='Masjid'
          width={636}
          height={532}
          className='absolute -bottom-32 left-0 z-5'
          priority
        />

        <div className='relative mx-auto max-w-6xl w-full px-4 md:px-6 py-8 md:py-16 flex-1 flex items-center z-20'>
          {/* Show Results View */}
          {showResults ? (
            <div className='w-full max-w-4xl mx-auto'>
              {/* Back Button */}
              <button
                onClick={handleReset}
                className='flex items-center gap-2 text-[#681819] hover:text-[#681819] transition-colors w-fit mb-6'
              >
                <span className='inline-flex items-center justify-center w-8 h-8 border-2 border-[#681819] rounded-md hover:bg-[#681819] hover:text-white transition-all duration-200'>
                  <ChevronLeft width={20} height={20} />
                </span>
                <span className='font-medium'>Kembali</span>
              </button>

              {/* Title */}
              <Typography
                as='h1'
                variant='h2'
                font='marquisette'
                weight='bold'
                className='text-[#681819] text-3xl md:text-4xl lg:text-5xl leading-tight mb-8'
              >
                Status Pendaftaran RIC
              </Typography>

              {/* Results */}
              {registrationData && (
                <RegistrationResult
                  data={registrationData}
                  onReset={handleReset}
                />
              )}
              {isNotFound && <NotFoundResult onReset={handleReset} />}
              {error && <ErrorResult message={error} onReset={handleReset} />}
            </div>
          ) : (
            /* Show Form View */
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full'>
              {/* LEFT SECTION - Title */}
              <div className='order-1 lg:order-1 flex'>
                <Typography
                  as='h1'
                  variant='h2'
                  font='marquisette'
                  weight='bold'
                  className='text-[#681819] text-3xl md:text-4xl lg:text-5xl leading-tight'
                >
                  Cek Status
                  <br />
                  Pendaftaran RIC
                </Typography>
              </div>

              {/* RIGHT SECTION - Form */}
              <div className='order-2 lg:order-2 flex flex-col gap-6 md:gap-10'>
                {/* Back Button */}
                <button
                  onClick={() => router.back()}
                  className='flex items-center gap-2 text-[#681819] hover:text-[#681819] transition-colors w-fit'
                >
                  <span className='inline-flex items-center justify-center w-8 h-8 border-2 border-[#681819] rounded-md hover:bg-[#681819] hover:text-white transition-all duration-200'>
                    <ChevronLeft width={20} height={20} />
                  </span>
                  <span className='font-medium'>Kembali</span>
                </button>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className='flex flex-col gap-5 w-full'
                >
                  {/* Search Input - Email/Name/Phone */}
                  <div className='flex flex-col gap-2'>
                    <label
                      htmlFor='search'
                      className='text-[#681819] font-bold text-sm md:text-base'
                    >
                      Email / Nama Lengkap / Nomor HP
                    </label>
                    <input
                      type='text'
                      id='search'
                      name='search'
                      placeholder='Masukkan Email, Nama Lengkap, atau Nomor HP'
                      value={searchQuery}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-300 border-2 border-transparent focus:outline-none focus:border-[#681819] transition-colors text-sm md:text-base disabled:opacity-50'
                    />
                    <p className='text-xs text-gray-600'>
                      Masukkan email, nama lengkap, atau nomor HP yang Anda
                      gunakan saat mendaftar
                    </p>
                  </div>

                  {/* Event Type Dropdown */}
                  <div className='flex flex-col gap-2'>
                    <label
                      htmlFor='eventType'
                      className='text-[#681819] font-bold text-sm md:text-base'
                    >
                      Cabang Lomba
                    </label>
                    <Select
                      value={eventType}
                      onValueChange={(value) => setEventType(value as EventKey)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className='w-full bg-white border-2 border-transparent focus:border-[#681819] text-sm md:text-base'>
                        <SelectValue placeholder='Pilih cabang lomba' />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-gray-600'>
                      Pilih cabang lomba yang Anda ikuti
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type='submit'
                    disabled={!searchQuery || !eventType || isLoading}
                    className='w-full bg-[#681819] hover:bg-[#5A1415] text-white font-bold py-3 rounded-lg transition-colors mt-4 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        Mengecek...
                      </>
                    ) : (
                      'Cek Status Pendaftaran'
                    )}
                  </button>
                </form>
              </div>

              {/* RIGHT SECTION - Mosque Image - Hidden on Mobile, Shown on Desktop */}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
