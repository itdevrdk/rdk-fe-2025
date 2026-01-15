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
} from './hook/store';

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
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder='Pilih cabang lomba' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='MHQ'>MHQ (Individu)</SelectItem>
                        <SelectItem value='MTQ'>MTQ (Individu)</SelectItem>
                        <SelectItem value='DAI'>Dai (Individu)</SelectItem>
                        <SelectItem value='KTIQ'>KTIQ (Tim)</SelectItem>
                        <SelectItem value='POSTER'>
                          Poster (Individu)
                        </SelectItem>
                        <SelectItem value='VIDEOGRAFI'>
                          Videografi (Tim)
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      className='mt-6 w-full bg-[#7A1E1E]'
                      disabled={!form.event_type}
                      onClick={() => setStep(2)}
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

                    <div className='mt-6 flex gap-3'>
                      <Button
                        className='w-full bg-[#7A1E1E]'
                        onClick={() => setStep(3)}
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
                          </div>
                        ))}
                    </div>

                    <div className='mt-6 flex gap-3'>
                      <Button
                        className='w-full bg-[#7A1E1E]'
                        onClick={() => setStep(3)}
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

                    {/* Statement link for MHQ, MTQ, DAI (Individual) and KTIQ (Team) */}
                    {['MHQ', 'MTQ', 'DAI', 'KTIQ'].includes(
                      form.event_type,
                    ) && (
                      <>
                        <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                          Unggah Surat Pernyataan (Format: PDF)
                        </Label>
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

                    {/* Result link for KTIQ and VIDEOGRAFI (Team) */}
                    {['KTIQ', 'VIDEOGRAFI'].includes(form.event_type) && (
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
