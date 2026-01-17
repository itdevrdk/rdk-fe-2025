export type RegistrationStatus =
  | 'UNVERIFIED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'REVISION_NEEDED';

export type EventKey = 'MHQ' | 'MTQ' | 'DAI' | 'KTIQ' | 'POSTER' | 'VIDEOGRAFI';

export interface Participant {
  role?: string; // 'Ketua' | 'Anggota'
  fullname: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  institution: string;
  identity_card_link?: string;
}

export interface Supervisor {
  name: string;
  phone: string;
}

export interface DocumentStatus {
  uploaded: boolean;
  verified?: boolean;
  url?: string;
  // For Team Identity Cards (aggregated)
  total?: number;
}

export interface TeamDocumentStatus {
  uploaded: number;
  total: number;
  verified: number;
}

export interface RegistrationData {
  registration_id: string; // e.g., RIC-MHQ-2026-001
  event_type: string;
  event_name: string;
  registration_type: 'individual' | 'team';
  status: RegistrationStatus;
  status_label: string; // e.g., "Terverifikasi", "Menunggu Verifikasi"
  registered_at: string; // ISO 8601

  // Team Fields
  team_name?: string;
  participants?: Participant[];
  supervisor?: Supervisor;

  // Individual Fields
  participant?: Participant;

  // Documents - flexible keys like 'identity_card', 'statement_link', 'identity_cards' (for team)
  documents: Record<string, DocumentStatus | TeamDocumentStatus>;

  rejection_reason?: string;
  notes?: string;
}

export interface CheckRegistrationResponse {
  success: boolean;
  message: string;
  data: RegistrationData | null;
  error?: string;
}

export interface CheckRegistrationParams {
  query: string;
  event_type: EventKey;
}
