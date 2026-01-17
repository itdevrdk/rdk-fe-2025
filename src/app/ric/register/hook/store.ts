import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Participant = {
  fullname: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  institution: string;
  role: 'Ketua' | 'Anggota';
  identity_card: File | null;
};

export const EVENT_CONFIG = {
  MHQ: { type: 'individual', requirement: 'statement' },
  MTQ: { type: 'individual', requirement: 'statement' },
  DAI: { type: 'individual', requirement: 'statement' },
  KTIQ: { type: 'team', requirement: 'statement_and_file' },
  POSTER: { type: 'individual', requirement: 'link' },
  VIDEOGRAFI: { type: 'team', requirement: 'link' },
} as const;

export type EventKey = keyof typeof EVENT_CONFIG;

export const isEventKey = (value: string): value is EventKey => {
  return value in EVENT_CONFIG;
};

export type RegistrationForm = {
  event_type: EventKey | '';
  // For individual
  fullname: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  institution: string;
  // For team
  supervisor_name: string;
  supervisor_phone: string;
  team_name: string;
  participants: Participant[];
  // Files (not persisted)
  statement_link: File | null;
  poster_link: File | null;
  identity_card: File | null;
  plagiarism_statement: File | null;
  result_link: string;
  agree_data_usage: boolean;
  agree_guidebook: boolean;
};

type RegistrationState = {
  form: RegistrationForm;
  step: number;
  errorMessage: string | null;

  // Actions
  setForm: (form: Partial<RegistrationForm>) => void;
  setStep: (step: number) => void;
  setErrorMessage: (message: string | null) => void;
  updateParticipant: (
    index: number,
    field: keyof Participant,
    value: string,
  ) => void;
  resetForm: () => void;
  clearDraft: () => void;
};

const initialParticipants: Participant[] = [
  {
    fullname: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    institution: '',
    role: 'Ketua',
    identity_card: null,
  },
  {
    fullname: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    institution: '',
    role: 'Anggota',
    identity_card: null,
  },
  {
    fullname: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    institution: '',
    role: 'Anggota',
    identity_card: null,
  },
];

const initialForm: RegistrationForm = {
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
  participants: initialParticipants,
  statement_link: null,
  poster_link: null,
  identity_card: null,
  plagiarism_statement: null,
  result_link: '',
  agree_data_usage: false,
  agree_guidebook: false,
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, _get) => ({
      form: initialForm,
      step: 1,
      errorMessage: null,

      setForm: (newForm) =>
        set((state) => ({
          form: { ...state.form, ...newForm },
        })),

      setStep: (step) => set({ step }),

      setErrorMessage: (errorMessage) => set({ errorMessage }),

      updateParticipant: (index, field, value) =>
        set((state) => {
          const updated = [...state.form.participants];
          updated[index] = { ...updated[index], [field]: value };
          return {
            form: { ...state.form, participants: updated },
          };
        }),

      resetForm: () =>
        set({
          form: initialForm,
          step: 1,
          errorMessage: null,
        }),

      clearDraft: () => {
        set({
          form: initialForm,
          step: 1,
          errorMessage: null,
        });
        // Also clear from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ric-registration-storage');
        }
      },
    }),
    {
      name: 'ric-registration-storage',
      // Don't persist File objects
      partialize: (state) => ({
        form: {
          ...state.form,
          statement_link: null,
          poster_link: null,
          identity_card: null,
          plagiarism_statement: null,
          // Clear identity_card from participants as well
          participants: state.form.participants.map((p) => ({
            ...p,
            identity_card: null,
          })),
        },
        step: state.step,
      }),
    },
  ),
);

// Helper to check if event is team type
export const isTeamEvent = (eventType: EventKey | ''): boolean => {
  if (!eventType) return false;
  return EVENT_CONFIG[eventType as EventKey]?.type === 'team';
};

// Validation function for Step 1
export const validateStep1 = (form: RegistrationForm): string | null => {
  if (!form.event_type) return 'Pilih cabang lomba terlebih dahulu.';
  return null;
};

// Validation function for Step 2 (Biodata)
export const validateStep2 = (
  form: RegistrationForm,
  isTeam: boolean,
): string | null => {
  if (isTeam) {
    // Validate team fields
    if (!form.team_name.trim()) return 'Nama tim wajib diisi.';
    if (!form.supervisor_name.trim()) return 'Nama pendamping wajib diisi.';
    if (!form.supervisor_phone.trim()) return 'Kontak pendamping wajib diisi.';

    // Validate participants
    for (let i = 0; i < form.participants.length; i++) {
      const p = form.participants[i];
      const label = i === 0 ? 'Ketua' : `Anggota ${i}`;
      if (!p.fullname.trim()) return `Nama lengkap ${label} wajib diisi.`;
      if (!p.email.trim()) return `Email ${label} wajib diisi.`;
      if (!p.phone.trim()) return `No WhatsApp ${label} wajib diisi.`;
      if (!p.province.trim()) return `Provinsi ${label} wajib diisi.`;
      if (!p.city.trim()) return `Kota ${label} wajib diisi.`;
      if (!p.institution.trim()) return `Asal instansi ${label} wajib diisi.`;
      if (!p.identity_card) return `Kartu identitas ${label} wajib diunggah.`;
    }
  } else {
    // Validate individual fields
    if (!form.fullname.trim()) return 'Nama lengkap wajib diisi.';
    if (!form.email.trim()) return 'Email wajib diisi.';
    if (!form.phone.trim()) return 'No WhatsApp wajib diisi.';
    if (!form.province.trim()) return 'Provinsi wajib diisi.';
    if (!form.city.trim()) return 'Kota wajib diisi.';
    if (!form.institution.trim()) return 'Asal instansi wajib diisi.';
    if (!form.supervisor_name.trim()) return 'Nama pendamping wajib diisi.';
    if (!form.supervisor_phone.trim()) return 'Kontak pendamping wajib diisi.';
  }
  return null;
};

// Validation function (for final submit)
export const validateForm = (
  form: RegistrationForm,
  isTeam: boolean,
): string | null => {
  // Validate agreements
  if (!form.agree_data_usage || !form.agree_guidebook) {
    return 'Anda harus menyetujui semua persetujuan sebelum mendaftar.';
  }

  if (isTeam) {
    // Validate team fields
    if (!form.team_name.trim()) return 'Nama tim wajib diisi.';
    if (!form.supervisor_name.trim()) return 'Nama pendamping wajib diisi.';
    if (!form.supervisor_phone.trim()) return 'Kontak pendamping wajib diisi.';

    // Validate participants
    for (let i = 0; i < form.participants.length; i++) {
      const p = form.participants[i];
      if (!p.fullname.trim()) return `Nama lengkap ${p.role} wajib diisi.`;
      if (!p.email.trim()) return `Email ${p.role} wajib diisi.`;
      if (!p.phone.trim()) return `No WhatsApp ${p.role} wajib diisi.`;
      if (!p.province.trim()) return `Provinsi ${p.role} wajib diisi.`;
      if (!p.city.trim()) return `Kota ${p.role} wajib diisi.`;
      if (!p.institution.trim()) return `Asal instansi ${p.role} wajib diisi.`;
      if (!p.identity_card) return `Kartu identitas ${p.role} wajib diunggah.`;
    }

    // Validate result_link for KTIQ and VIDEOGRAFI
    if (!form.result_link.trim()) return 'Link unggah karya wajib diisi.';

    // Validate statement_link for KTIQ
    if (form.event_type === 'KTIQ' && !form.statement_link) {
      return 'Surat pernyataan wajib diunggah.';
    }

    // Validate plagiarism_statement for KTIQ
    if (form.event_type === 'KTIQ' && !form.plagiarism_statement) {
      return 'Surat pernyataan tidak plagiarisme wajib diunggah.';
    }
  } else {
    // Validate individual fields
    if (!form.fullname.trim()) return 'Nama lengkap wajib diisi.';
    if (!form.email.trim()) return 'Email wajib diisi.';
    if (!form.phone.trim()) return 'No WhatsApp wajib diisi.';
    if (!form.province.trim()) return 'Provinsi wajib diisi.';
    if (!form.city.trim()) return 'Kota wajib diisi.';
    if (!form.institution.trim()) return 'Asal instansi wajib diisi.';
    if (!form.supervisor_name.trim()) return 'Nama pendamping wajib diisi.';
    if (!form.supervisor_phone.trim()) return 'Kontak pendamping wajib diisi.';

    // Validate identity_card for individual
    if (!form.identity_card) {
      return 'Kartu identitas wajib diunggah.';
    }

    // Validate files based on event type
    if (
      ['MHQ', 'MTQ', 'DAI'].includes(form.event_type) &&
      !form.statement_link
    ) {
      return 'Surat pernyataan wajib diunggah.';
    }
    if (form.event_type === 'POSTER' && !form.poster_link) {
      return 'File poster wajib diunggah.';
    }
  }

  return null;
};
