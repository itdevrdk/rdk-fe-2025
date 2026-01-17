'use client';

import { Label } from '@radix-ui/react-dropdown-menu';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useRegisterRIC } from './hook/mutation';
import {
  isEventKey,
  isTeamEvent,
  Participant,
  useRegistrationStore,
  validateForm,
  validateStep1,
  validateStep2,
} from './hook/store';
import { useQuota } from '../hook/useQuota';

// Event options data
const EVENT_OPTIONS = [
  { id: 'MHQ', label: 'MHQ (Individu)' },
  { id: 'MTQ', label: 'MTQ (Individu)' },
  { id: 'DAI', label: 'Dai (Individu)' },
  { id: 'KTIQ', label: 'KTIQ (Tim)' },
  { id: 'POSTER', label: 'Poster (Individu)' },
  { id: 'VIDEOGRAFI', label: 'Videografi (Tim)' },
] as const;

// Helper function to update participant file
const updateParticipantFile = (
  participants: Participant[],
  index: number,
  file: File | null,
): Participant[] => {
  const updated = [...participants];
  updated[index] = { ...updated[index], identity_card: file };
  return updated;
};

function RICPendaftaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand store
  const {
    form,
    step,
    errorMessage,
    setForm,
    setStep,
    setErrorMessage,
    updateParticipant,
  } = useRegistrationStore();

  // TanStack Query mutation
  const registerMutation = useRegisterRIC();
  const isTeam = isTeamEvent(form.event_type);

  // Fetch quota data
  const { getQuotaByEventId, isLoading: isQuotaLoading } = useQuota();

  // Filter available events (hide full quota)
  const availableEvents = EVENT_OPTIONS.filter((event) => {
    const quota = getQuotaByEventId(event.id);
    if (!quota) return true; // Show if quota data not available yet
    return quota.registered < quota.total;
  });

  // Handler untuk validasi dan pindah ke step berikutnya
  const handleNextStep = (nextStep: number) => {
    setErrorMessage(null);

    if (step === 1) {
      const error = validateStep1(form);
      if (error) {
        setErrorMessage(error);
        return;
      }
    } else if (step === 2) {
      const error = validateStep2(form, isTeam);
      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    setStep(nextStep);
  };

  // Handle URL query parameter for event selection
  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam && isEventKey(eventParam)) {
      setForm({ event_type: eventParam });
    }
  }, [searchParams, setForm]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    const validationError = validateForm(form, isTeam);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    registerMutation.mutate(form, {
      onSuccess: () => {
        router.push(`/ric/register/success?event=${form.event_type}`);
      },
    });
  };

  const stepTitle = [
    '',
    'Informasi Cabang Lomba',
    'Biodata Peserta',
    'Kelengkapan Berkas',
  ][step];

  return (
    <Layout withNavbar withFooter>
      <main className='relative min-h-screen bg-[#FFE3A3] overflow-hidden'>
        <Image
          src='/images/ric/ass1.png'
          alt=''
          width={100}
          height={100}
          className='absolute right-0 top-0'
        />
        <Image
          src='/images/ric/ass2.png'
          alt=''
          width={100}
          height={100}
          className='absolute right-0 bottom-0'
        />
        <Image
          src='/images/ric/ass3.png'
          alt=''
          width={400}
          height={400}
          className='absolute left-0 bottom-0'
        />

        <div className='relative z-10 mx-auto max-w-6xl px-6 py-20'>
          {/* ================= STEP INDICATOR ================= */}
          <div className='mb-8'>
            <div className='flex items-center justify-center'>
              {[1, 2, 3].map((s, index) => (
                <div key={s} className='flex items-center'>
                  {/* Step Circle */}
                  <div className='flex flex-col items-center'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        step === s
                          ? 'bg-[#7A1E1E] text-white ring-4 ring-[#7A1E1E]/30'
                          : step > s
                            ? 'bg-[#7A1E1E] text-white'
                            : 'bg-white border-2 border-[#7A1E1E]/30 text-[#7A1E1E]/50'
                      }`}
                    >
                      {step > s ? '✓' : s}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                        step >= s ? 'text-[#7A1E1E]' : 'text-[#7A1E1E]/50'
                      }`}
                    >
                      {s === 1
                        ? 'Cabang Lomba'
                        : s === 2
                          ? 'Biodata'
                          : 'Berkas'}
                    </span>
                  </div>
                  {/* Connector Line */}
                  {index < 2 && (
                    <div
                      className={`w-12 sm:w-20 h-1 mx-2 rounded transition-all duration-300 ${
                        step > s ? 'bg-[#7A1E1E]' : 'bg-[#7A1E1E]/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='grid gap-12 grid-cols-1 md:grid-cols-2'>
            {/* ================= LEFT ================= */}
            <div className='hidden md:flex flex-col justify-start'>
              <Typography
                variant='h1'
                font='marquisette'
                className='text-4xl bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'
              >
                {stepTitle}
              </Typography>
            </div>
            {/* ================= RIGHT ================= */}
            <div>
              <div>
                <div className='md:hidden mb-6'>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className='flex items-center gap-2 text-[#681819] hover:text-[#681819] transition-colors w-fit mb-4'
                    >
                      <span className='inline-flex items-center justify-center w-8 h-8 border-2 border-[#681819] rounded-md hover:bg-[#681819] hover:text-white transition-all duration-200'>
                        <ChevronLeft width={20} height={20} />
                      </span>
                      <span className='font-medium'>Kembali</span>
                    </button>
                  )}
                  <Typography
                    variant='h2'
                    font='marquisette'
                    className='text-2xl bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'
                  >
                    {stepTitle}
                  </Typography>
                </div>
                <div className='hidden md:flex justify-start mb-4'>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className='flex items-center gap-2 text-[#681819] hover:text-[#681819] transition-colors w-fit'
                    >
                      <span className='inline-flex items-center justify-center w-8 h-8 border-2 border-[#681819] rounded-md hover:bg-[#681819] hover:text-white transition-all duration-200'>
                        <ChevronLeft width={20} height={20} />
                      </span>
                      <span className='font-medium'>Kembali</span>
                    </button>
                  )}
                </div>

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                  <>
                    <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                      Pilih Cabang Lomba
                    </Label>
                    <Select
                      value={form.event_type}
                      onValueChange={(v) => {
                        if (!isEventKey(v)) return;
                        setErrorMessage(null);
                        setForm({ event_type: v });
                      }}
                      disabled={isQuotaLoading}
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue
                          placeholder={
                            isQuotaLoading
                              ? 'Memuat data kuota...'
                              : 'Pilih cabang lomba'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEvents.length === 0 ? (
                          <div className='px-2 py-4 text-center text-sm text-gray-500'>
                            Semua kuota lomba sudah penuh
                          </div>
                        ) : (
                          availableEvents.map((event) => {
                            const quota = getQuotaByEventId(event.id);
                            const remaining = quota
                              ? quota.total - quota.registered
                              : null;
                            return (
                              <SelectItem key={event.id} value={event.id}>
                                <div className='flex items-center justify-between w-full gap-2'>
                                  <span>{event.label}</span>
                                  {remaining !== null && (
                                    <span
                                      className={`text-xs ${remaining <= 5 ? 'text-orange-500' : 'text-green-600'}`}
                                    >
                                      (Sisa: {remaining})
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>

                    {/* Error message display */}
                    {errorMessage && (
                      <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      className='mt-6 w-full bg-[#7A1E1E]'
                      disabled={!form.event_type}
                      onClick={() => handleNextStep(2)}
                    >
                      Selanjutnya
                    </Button>
                  </>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && !isTeam && (
                  <>
                    {/* BIODATA INDIVIDU */}
                    <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                      Nama Lengkap
                    </Label>
                    <Input
                      className='bg-white'
                      placeholder='Nama Lengkap'
                      value={form.fullname}
                      onChange={(e) => setForm({ fullname: e.target.value })}
                    />
                    <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                      Email
                    </Label>
                    <Input
                      className='bg-white'
                      placeholder='Email'
                      value={form.email}
                      onChange={(e) => setForm({ email: e.target.value })}
                    />
                    <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                      No WhatsApp
                    </Label>
                    <Input
                      className='bg-white'
                      placeholder='No WhatsApp'
                      value={form.phone}
                      onChange={(e) => setForm({ phone: e.target.value })}
                    />
                    <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                      Provinsi
                    </Label>
                    <Input
                      className='bg-white'
                      placeholder='Provinsi'
                      value={form.province}
                      onChange={(e) => setForm({ province: e.target.value })}
                    />
                    <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                      Kabupaten / Kota
                    </Label>
                    <Input
                      className='bg-white'
                      placeholder='Kabupaten / Kota'
                      value={form.city}
                      onChange={(e) => setForm({ city: e.target.value })}
                    />
                    <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                      Asal Instansi
                    </Label>
                    <Input
                      className='bg-white'
                      placeholder='Asal Instansi'
                      value={form.institution}
                      onChange={(e) => setForm({ institution: e.target.value })}
                    />

                    {/* Informasi Pendamping */}
                    <div className='mt-6 p-4 bg-white/30 rounded-lg'>
                      <h3 className='text-lg font-bold text-[#7A1E1E] mb-4'>
                        Informasi Pendamping
                      </h3>
                      <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                        Nama Pendamping
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Nama Pendamping'
                        value={form.supervisor_name}
                        onChange={(e) =>
                          setForm({ supervisor_name: e.target.value })
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        No WhatsApp Pendamping
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='No WhatsApp Pendamping'
                        value={form.supervisor_phone}
                        onChange={(e) =>
                          setForm({ supervisor_phone: e.target.value })
                        }
                      />
                    </div>

                    {/* Error message display */}
                    {errorMessage && (
                      <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
                        {errorMessage}
                      </div>
                    )}

                    <div className='mt-6 flex gap-3'>
                      <Button
                        className='w-full bg-[#7A1E1E]'
                        onClick={() => handleNextStep(3)}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </>
                )}

                {/* ================= STEP 2 TIM ================= */}
                {step === 2 && isTeam && (
                  <>
                    {/* BIODATA TIM */}
                    <div className='mb-6 p-4 bg-white/30 rounded-lg'>
                      <h3 className='text-xl font-bold text-[#7A1E1E] mb-4'>
                        Informasi Tim
                      </h3>
                      <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                        Nama Tim
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Nama Tim'
                        value={form.team_name}
                        onChange={(e) => setForm({ team_name: e.target.value })}
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Nama Pendamping
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Nama Pendamping'
                        value={form.supervisor_name}
                        onChange={(e) =>
                          setForm({ supervisor_name: e.target.value })
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Kontak Pendamping
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Kontak Pendamping'
                        value={form.supervisor_phone}
                        onChange={(e) =>
                          setForm({ supervisor_phone: e.target.value })
                        }
                      />
                    </div>

                    {/* BIODATA KETUA */}
                    <div className='mb-6 p-4 bg-white/30 rounded-lg'>
                      <h3 className='text-xl font-bold text-[#7A1E1E] mb-4'>
                        Biodata Ketua Tim
                      </h3>
                      <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                        Nama Lengkap Ketua
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Nama Lengkap Ketua'
                        value={form.participants[0]?.fullname || ''}
                        onChange={(e) =>
                          updateParticipant(0, 'fullname', e.target.value)
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Email Ketua
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Email Ketua'
                        value={form.participants[0]?.email || ''}
                        onChange={(e) =>
                          updateParticipant(0, 'email', e.target.value)
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        No WhatsApp Ketua
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='No WhatsApp Ketua'
                        value={form.participants[0]?.phone || ''}
                        onChange={(e) =>
                          updateParticipant(0, 'phone', e.target.value)
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Provinsi
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Provinsi'
                        value={form.participants[0]?.province || ''}
                        onChange={(e) =>
                          updateParticipant(0, 'province', e.target.value)
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Kabupaten / Kota
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Kabupaten / Kota'
                        value={form.participants[0]?.city || ''}
                        onChange={(e) =>
                          updateParticipant(0, 'city', e.target.value)
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Asal Instansi
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Asal Instansi'
                        value={form.participants[0]?.institution || ''}
                        onChange={(e) =>
                          updateParticipant(0, 'institution', e.target.value)
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Kartu Identitas Ketua (KTM/Kartu Pelajar)
                      </Label>
                      <Input
                        type='file'
                        accept='.jpg,.jpeg,.png,.pdf'
                        className='bg-white'
                        onChange={(e) =>
                          setForm({
                            participants: updateParticipantFile(
                              form.participants,
                              0,
                              e.target.files?.[0] ?? null,
                            ),
                          })
                        }
                      />
                      {form.participants[0]?.identity_card && (
                        <p className='text-sm text-green-600 mt-1'>
                          File terpilih:{' '}
                          {form.participants[0].identity_card.name}
                        </p>
                      )}
                    </div>

                    {/* BIODATA ANGGOTA */}
                    <div className='p-4 bg-white/30 rounded-lg'>
                      <h3 className='text-xl font-bold text-[#7A1E1E] mb-4'>
                        Biodata Anggota Tim (2 Anggota)
                      </h3>

                      {form.participants
                        .slice(1)
                        .map((member: Participant, i: number) => (
                          <div
                            key={i}
                            className='mb-6 p-4 bg-white/50 rounded-lg relative'
                          >
                            <div className='flex justify-between items-center mb-3'>
                              <h4 className='font-bold text-[#7A1E1E]'>
                                Anggota {i + 1}
                              </h4>
                            </div>
                            <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                              Nama Lengkap
                            </Label>
                            <Input
                              className='bg-white'
                              placeholder='Nama Lengkap Anggota'
                              value={member.fullname}
                              onChange={(e) =>
                                updateParticipant(
                                  i + 1,
                                  'fullname',
                                  e.target.value,
                                )
                              }
                            />
                            <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                              Email
                            </Label>
                            <Input
                              className='bg-white'
                              placeholder='Email Anggota'
                              value={member.email}
                              onChange={(e) =>
                                updateParticipant(
                                  i + 1,
                                  'email',
                                  e.target.value,
                                )
                              }
                            />
                            <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                              No WhatsApp
                            </Label>
                            <Input
                              className='bg-white'
                              placeholder='No WhatsApp Anggota'
                              value={member.phone}
                              onChange={(e) =>
                                updateParticipant(
                                  i + 1,
                                  'phone',
                                  e.target.value,
                                )
                              }
                            />
                            <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                              Provinsi
                            </Label>
                            <Input
                              className='bg-white'
                              placeholder='Provinsi'
                              value={member.province}
                              onChange={(e) =>
                                updateParticipant(
                                  i + 1,
                                  'province',
                                  e.target.value,
                                )
                              }
                            />
                            <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                              Kabupaten / Kota
                            </Label>
                            <Input
                              className='bg-white'
                              placeholder='Kabupaten / Kota'
                              value={member.city}
                              onChange={(e) =>
                                updateParticipant(i + 1, 'city', e.target.value)
                              }
                            />
                            <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                              Asal Instansi
                            </Label>
                            <Input
                              className='bg-white'
                              placeholder='Asal Instansi'
                              value={member.institution}
                              onChange={(e) =>
                                updateParticipant(
                                  i + 1,
                                  'institution',
                                  e.target.value,
                                )
                              }
                            />
                            <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                              Kartu Identitas (KTM/Kartu Pelajar)
                            </Label>
                            <Input
                              type='file'
                              accept='.jpg,.jpeg,.png,.pdf'
                              className='bg-white'
                              onChange={(e) =>
                                setForm({
                                  participants: updateParticipantFile(
                                    form.participants,
                                    i + 1,
                                    e.target.files?.[0] ?? null,
                                  ),
                                })
                              }
                            />
                            {member.identity_card && (
                              <p className='text-sm text-green-600 mt-1'>
                                File terpilih: {member.identity_card.name}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Error message display */}
                    {errorMessage && (
                      <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
                        {errorMessage}
                      </div>
                    )}

                    <div className='mt-6 flex gap-3'>
                      <Button
                        className='w-full bg-[#7A1E1E]'
                        onClick={() => handleNextStep(3)}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </>
                )}

                {/* ================= STEP 3 ================= */}
                {step === 3 && (
                  <>
                    {/* Error message display */}
                    {errorMessage && (
                      <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
                        {errorMessage}
                      </div>
                    )}

                    {/* Identity card upload for individual */}
                    {!isTeam && (
                      <>
                        <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                          Kartu Identitas (KTM/Kartu Pelajar)
                        </Label>
                        <Input
                          type='file'
                          accept='.jpg,.jpeg,.png,.pdf'
                          className='bg-white'
                          onChange={(e) =>
                            setForm({
                              identity_card: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        {form.identity_card && (
                          <p className='text-sm text-green-600 mt-1'>
                            File terpilih: {form.identity_card.name}
                          </p>
                        )}
                      </>
                    )}

                    {/* Statement link for MHQ, MTQ, DAI (Individual) and KTIQ (Team) */}
                    {['MHQ', 'MTQ', 'DAI', 'KTIQ'].includes(
                      form.event_type,
                    ) && (
                      <>
                        <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                          Unggah Surat Pernyataan Komitmen (Format: PDF)
                        </Label>
                        <p className='text-xs text-gray-600 mb-2'>
                          Template dapat diunduh{' '}
                          <a
                            href='https://drive.google.com/drive/folders/1o4dOtE_uG3j1Oxh2reQ0D5_qyG_hqhoW'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 underline hover:text-blue-800'
                          >
                            di sini
                          </a>
                        </p>
                        <Input
                          type='file'
                          accept='.pdf'
                          className='bg-white'
                          onChange={(e) =>
                            setForm({
                              statement_link: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        {form.statement_link && (
                          <p className='text-sm text-green-600 mt-1'>
                            File terpilih: {form.statement_link.name}
                          </p>
                        )}
                      </>
                    )}

                    {/* Plagiarism statement for KTIQ */}
                    {form.event_type === 'KTIQ' && (
                      <>
                        <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                          Unggah Surat Pernyataan Tidak Plagiarisme (Format:
                          PDF)
                        </Label>
                        <p className='text-xs text-gray-600 mb-2'>
                          Template dapat diunduh{' '}
                          <a
                            href='https://drive.google.com/file/d/1G5oyxCMwBB0QoEwUNkHIG1xXCx7PFIyS/view?usp=sharing'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 underline hover:text-blue-800'
                          >
                            di sini
                          </a>
                        </p>
                        <Input
                          type='file'
                          accept='.pdf'
                          className='bg-white'
                          onChange={(e) =>
                            setForm({
                              plagiarism_statement: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        {form.plagiarism_statement && (
                          <p className='text-sm text-green-600 mt-1'>
                            File terpilih: {form.plagiarism_statement.name}
                          </p>
                        )}
                      </>
                    )}

                    {/* Poster link for POSTER (Individual) */}
                    {form.event_type === 'POSTER' && (
                      <>
                        <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                          Unggah File Poster (Format: JPG/PNG/PDF, Maks: 10MB)
                        </Label>
                        <Input
                          type='file'
                          accept='.jpg,.jpeg,.png,.pdf'
                          className='bg-white'
                          onChange={(e) =>
                            setForm({
                              poster_link: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        {form.poster_link && (
                          <p className='text-sm text-green-600 mt-1'>
                            File terpilih: {form.poster_link.name}
                          </p>
                        )}
                      </>
                    )}

                    {/* Result file for KTIQ (Team) */}
                    {form.event_type === 'KTIQ' && (
                      <>
                        <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                          Unggah File Karya (Format: PDF, Maks: 10MB)
                        </Label>
                        <Input
                          type='file'
                          accept='.pdf'
                          className='bg-white'
                          onChange={(e) =>
                            setForm({
                              result_file: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        {form.result_file && (
                          <p className='text-sm text-green-600 mt-1'>
                            File terpilih: {form.result_file.name}
                          </p>
                        )}
                      </>
                    )}

                    {/* Result link for VIDEOGRAFI (Team) */}
                    {form.event_type === 'VIDEOGRAFI' && (
                      <>
                        <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                          Link Unggah Karya (Google Drive/YouTube)
                        </Label>
                        <Input
                          className='bg-white'
                          placeholder='https://...'
                          value={form.result_link}
                          onChange={(e) =>
                            setForm({ result_link: e.target.value })
                          }
                        />
                      </>
                    )}

                    <div className='mt-6 space-y-3'>
                      <div className='flex items-start gap-2'>
                        <Checkbox
                          id='agree_guidebook'
                          checked={form.agree_guidebook}
                          onCheckedChange={(v) =>
                            setForm({ agree_guidebook: !!v })
                          }
                        />
                        <label
                          htmlFor='agree_guidebook'
                          className='text-sm cursor-pointer'
                        >
                          Saya bersedia mematuhi seluruh aturan yang berlaku
                          pada Buku Panduan, Petunjuk Teknis, dan Instruksi
                          Panitia (Baca Guidebook)
                        </label>
                      </div>

                      <div className='flex items-start gap-2'>
                        <Checkbox
                          id='agree_data_usage'
                          checked={form.agree_data_usage}
                          onCheckedChange={(v) =>
                            setForm({ agree_data_usage: !!v })
                          }
                        />
                        <label
                          htmlFor='agree_data_usage'
                          className='text-sm cursor-pointer'
                        >
                          Saya menyetujui penggunaan data untuk keperluan
                          pendaftaran dan segala bentuk kelalaian peserta bukan
                          tanggung jawab panitia kompetisi
                        </label>
                      </div>
                    </div>

                    <div className='mt-6 flex gap-3'>
                      <Button
                        className='w-full bg-[#7A1E1E]'
                        onClick={handleSubmit}
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending
                          ? 'Mengirim...'
                          : 'Konfirmasi'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default function RICPendaftaranPage() {
  return (
    <Suspense
      fallback={
        <Layout withNavbar withFooter>
          <div className='min-h-screen flex items-center justify-center'>
            Loading...
          </div>
        </Layout>
      }
    >
      <RICPendaftaranContent />
    </Suspense>
  );
}
