'use client';

import { Label } from '@radix-ui/react-dropdown-menu';
import { ArrowLeft, Instagram, LinkedinIcon, YoutubeIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

type Participant = {
  fullname: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  institution: string;
  role: string;
};

type RegistrationForm = {
  event_type: EventKey | '';
  fullname: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  institution: string;
  supervisor_name: string;
  supervisor_phone: string;
  team_name: string;
  participants: Participant[];
  statement_link: File | null;
  result_link: {
    filename: string;
    header: Record<string, string[]>;
    size: number;
  } | null;
  agree_data_usage: boolean;
  agree_guidebook: boolean;
};

const EVENT_CONFIG = {
  MHQ: { type: 'individual', requirement: 'statement' },
  MTQ: { type: 'individual', requirement: 'statement' },
  DAI: { type: 'individual', requirement: 'statement' },
  KTIQ: { type: 'team', requirement: 'statement_and_file' },
  POSTER: { type: 'individual', requirement: 'link' },
  VIDEOGRAFI: { type: 'team', requirement: 'link' },
} as const;

type EventKey = keyof typeof EVENT_CONFIG;
const isEventKey = (value: string): value is EventKey => {
  return value in EVENT_CONFIG;
};

const WA_GROUP_LINK: Record<EventKey, string> = {
  MHQ: 'https://chat.whatsapp.com/MHQ_GROUP',
  MTQ: 'https://chat.whatsapp.com/MTQ_GROUP',
  DAI: 'https://chat.whatsapp.com/DAI_GROUP',
  KTIQ: 'https://chat.whatsapp.com/KTIQ_GROUP',
  POSTER: 'https://chat.whatsapp.com/POSTER_GROUP',
  VIDEOGRAFI: 'https://chat.whatsapp.com/VIDEOGRAFI_GROUP',
};

const CONTACT_PERSON: Record<EventKey, { name: string; phone: string }> = {
  MHQ: { name: 'CP MHQ', phone: '6281234567890' },
  MTQ: { name: 'CP MTQ', phone: '6281234567891' },
  DAI: { name: 'CP DAI', phone: '6281234567892' },
  KTIQ: { name: 'CP KTIQ', phone: '6281234567893' },
  POSTER: { name: 'CP POSTER', phone: '6281234567894' },
  VIDEOGRAFI: { name: 'CP VIDEOGRAFI', phone: '6281234567895' },
};

const STORAGE_KEY = 'rdk47-registration';

const saveDraft = (data: { form: RegistrationForm; step: number }) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const loadDraft = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

const clearDraft = () => localStorage.removeItem(STORAGE_KEY);

export default function PendaftaranPage() {
  const [step, setStep] = useState<number>(1);

  const [form, setForm] = useState<RegistrationForm>({
    event_type: '',
    fullname: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    institution: '',
    supervisor_name: '',
    supervisor_phone: '',
    team_name: '',
    participants: [],
    statement_link: null,
    result_link: null,
    agree_data_usage: false,
    agree_guidebook: false,
  });

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setForm(draft.form);
      setStep(draft.step);
    }
  }, []);

  useEffect(() => {
    saveDraft({ form, step });
  }, [form, step]);

  const eventConfig = EVENT_CONFIG[form.event_type as EventKey];
  const isTeam = eventConfig?.type === 'team';

  const addMember = () => {
    setForm({
      ...form,
      participants: [
        ...form.participants,
        {
          fullname: '',
          email: '',
          phone: '',
          province: '',
          city: '',
          institution: '',
          role: 'Anggota',
        },
      ],
    });
  };

  const updateMember = (i: number, field: keyof Participant, value: string) => {
    const updated = [...form.participants];
    updated[i][field] = value;
    setForm({ ...form, participants: updated });
  };

  const submitForm = () => {
    clearDraft();
    setStep(4);
  };

  const stepTitle = [
    '',
    'Informasi Cabang Lomba',
    'Biodata Peserta',
    'Kelengkapan Berkas',
    '',
  ][step];

  return (
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
        <div
          className={`grid gap-12 ${
            step === 4 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {/* ================= LEFT ================= */}
          {step !== 4 && (
            <div className='hidden md:flex flex-col justify-start'>
              <Typography
                variant='h1'
                font='marquisette'
                className='text-4xl bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'
              >
                {stepTitle}
              </Typography>
            </div>
          )}
          {/* ================= RIGHT ================= */}
          <div className={step === 4 ? 'flex justify-center items-center' : ''}>
            <div className={step === 4 ? 'w-full max-w-3xl text-center' : ''}>
              <div className='md:hidden mb-6'>
                {step > 1 && step < 4 && (
                  <button
                    type='button'
                    onClick={() => setStep(step - 1)}
                    className='flex items-center gap-4'
                  >
                    {/* ICON BOX */}
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#B7B7B7] bg-transparent'>
                      <ArrowLeft className='h-4 w-4 text-black' />
                    </div>

                    {/* TEXT */}
                    <span className='text-xs font-medium text-[#7A1E1E]'>
                      Kembali
                    </span>
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
                {step > 1 && step < 4 && (
                  <button
                    type='button'
                    onClick={() => setStep(step - 1)}
                    className='flex items-center gap-4'
                  >
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#B7B7B7] bg-transparent'>
                      <ArrowLeft className='h-4 w-4 text-black' />
                    </div>
                    <span className='text-xs font-medium text-[#7A1E1E]'>
                      Kembali
                    </span>
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

                      setForm({
                        ...form,
                        event_type: v,
                        participants: [],
                      });
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
                      <SelectItem value='POSTER'>Poster (Individu)</SelectItem>
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

              {/* ================= STEP 2 (UTUH) ================= */}
              {step === 2 && (
                <>
                  <Label className='text-black font-bold pb-0 mb-1 text-xs'>
                    Nama Lengkap
                  </Label>
                  <Input
                    className='bg-white'
                    placeholder='Nama Lengkap'
                    value={form.fullname}
                    onChange={(e) =>
                      setForm({ ...form, fullname: e.target.value })
                    }
                  />
                  <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                    Email
                  </Label>
                  <Input
                    className='bg-white'
                    placeholder='Email'
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                    No WhatsApp
                  </Label>
                  <Input
                    className='bg-white'
                    placeholder='No WhatsApp'
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                    Provinsi
                  </Label>
                  <Input
                    className='bg-white'
                    placeholder='Provinsi'
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value })
                    }
                  />
                  <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                    Kabupaten / Kota
                  </Label>
                  <Input
                    className='bg-white'
                    placeholder='Kabupaten / Kota'
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                    Asal Instansi
                  </Label>
                  <Input
                    className='bg-white'
                    placeholder='Asal Instansi'
                    value={form.institution}
                    onChange={(e) =>
                      setForm({ ...form, institution: e.target.value })
                    }
                  />

                  {isTeam && (
                    <>
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Nama Tim
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Nama Tim'
                        value={form.team_name}
                        onChange={(e) =>
                          setForm({ ...form, team_name: e.target.value })
                        }
                      />
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Nama Pendamping
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Nama Pendamping'
                        value={form.supervisor_name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            supervisor_name: e.target.value,
                          })
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
                          setForm({
                            ...form,
                            supervisor_phone: e.target.value,
                          })
                        }
                      />
                    </>
                  )}

                  {isTeam && (
                    <section className='mt-6'>
                      <h3 className='text-xl font-bold text-[#7A1E1E]'>
                        Anggota Tim
                      </h3>

                      {form.participants.map((p: Participant, i: number) => (
                        <div key={i} className='mt-3'>
                          <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                            Nama Anggota {i + 1}
                          </Label>
                          <Input
                            className='bg-white'
                            placeholder='Nama Anggota'
                            value={p.fullname}
                            onChange={(e) =>
                              updateMember(i, 'fullname', e.target.value)
                            }
                          />
                          <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                            Email
                          </Label>
                          <Input
                            className='bg-white'
                            placeholder='Email'
                            value={p.email}
                            onChange={(e) =>
                              updateMember(i, 'email', e.target.value)
                            }
                          />
                          <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                            No WhatsApp
                          </Label>
                          <Input
                            className='bg-white'
                            placeholder='No WhatsApp'
                            value={p.phone}
                            onChange={(e) =>
                              updateMember(i, 'phone', e.target.value)
                            }
                          />
                        </div>
                      ))}

                      <Button
                        type='button'
                        className='mt-3 bg-[#7A1E1E]'
                        onClick={addMember}
                      >
                        + Tambah Anggota
                      </Button>
                    </section>
                  )}

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
                  {(eventConfig?.requirement === 'statement' ||
                    eventConfig?.requirement === 'statement_and_file') && (
                    <>
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Unggah Surat Pernyataan Bersedia Hadir di Hari
                        Pelaksanaan
                      </Label>
                      <Input
                        type='file'
                        className='bg-white'
                        onChange={(e) =>
                          setForm({
                            ...form,
                            statement_link: e.target.files?.[0] ?? null,
                          })
                        }
                      />
                    </>
                  )}

                  {(eventConfig?.requirement === 'link' ||
                    eventConfig?.requirement === 'statement_and_file') && (
                    <>
                      <Label className='mt-4 text-black font-bold pb-0 mb-1 text-xs'>
                        Link Unggah Karya
                      </Label>
                      <Input
                        className='bg-white'
                        placeholder='Link Unggah Karya'
                        onChange={(e) =>
                          setForm({
                            ...form,
                            result_link: {
                              filename: e.target.value,
                              header: {},
                              size: 0,
                            },
                          })
                        }
                      />
                    </>
                  )}

                  <div className='mt-6 space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        checked={form.agree_guidebook}
                        onCheckedChange={(v) =>
                          setForm({
                            ...form,
                            agree_guidebook: !!v,
                          })
                        }
                      />
                      <span>
                        Saya bersedia mematuhi seluruh aturan yang berlaku pada
                        Buku Panduan, Petunjuk Teknis, dan Instruksi Panitia
                        (Baca Guidebook)
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Checkbox
                        checked={form.agree_data_usage}
                        onCheckedChange={(v) =>
                          setForm({
                            ...form,
                            agree_data_usage: !!v,
                          })
                        }
                      />
                      <span>
                        Segala bentuk kelalaian peserta, bukan tanggung jawab
                        panitia kompetisi
                      </span>
                    </div>
                  </div>

                  <div className='mt-6 flex gap-3'>
                    <Button
                      className='w-full bg-[#7A1E1E]'
                      onClick={submitForm}
                    >
                      Konfirmasi
                    </Button>
                  </div>
                </>
              )}

              {/* ================= STEP 4 ================= */}
              {step === 4 && (
                <section className='text-center w-full'>
                  <Typography
                    font='marquisette'
                    variant='h2'
                    className='text-3xl bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'
                  >
                    Terima Kasih Sudah Mendaftar!
                  </Typography>
                  <div className='p-4 bg-white/50 rounded-2xl my-4'>
                    <Typography variant='body' className='text-[#7A1E1E] mb-4'>
                      Selamat! Kamu resmi jadi bagian dari peserta Ramadan
                      Islamic Competition RDK 47 ITS✨{' '}
                    </Typography>
                    <Typography variant='body' className='text-[#7A1E1E]'>
                      INFO PENTING! Seluruh peserta dan pendamping WAJIB
                      bergabung ke grup sesuai cabang lomba yang dipilih, ya! Di
                      sana kamu bakal dapat info penting seputar teknis lomba,
                      jadwal, dan update terbaru langsung dari panitia.{' '}
                    </Typography>
                    <Button
                      onClick={() =>
                        window.open(
                          WA_GROUP_LINK[form.event_type as EventKey],
                          '_blank',
                        )
                      }
                      className='mt-4 w-full bg-[#7A1E1E]'
                    >
                      Masuk ke Grup WhatsApp
                    </Button>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 text-center'>
                    <div>
                      <h4 className='font-bold text-[#7A1E1E] mb-2 '>
                        Contact Person
                      </h4>
                      {form.event_type && (
                        <p className='text-[#7A1E1E]'>
                          <a
                            href={`https://wa.me/${CONTACT_PERSON[form.event_type as EventKey].phone}`}
                          >
                            +{CONTACT_PERSON[form.event_type as EventKey].phone}
                          </a>{' '}
                          ({CONTACT_PERSON[form.event_type as EventKey].name})
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className='font-bold text-[#7A1E1E] mb-2'>
                        Follow Us
                      </h4>
                      <div className='flex gap-6 text-center justify-center'>
                        <a href='#' className=' text-[#7A1E1E]'>
                          <Instagram className='mb-1' />
                        </a>
                        <a href='#' className=' text-[#7A1E1E]'>
                          <LinkedinIcon className='mb-1' />
                        </a>
                        <a href='#' className=' text-[#7A1E1E]'>
                          <YoutubeIcon className='mb-1' />
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
