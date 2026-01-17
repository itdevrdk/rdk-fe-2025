// Admin RIC Registration Types
export type RicRegistrationStatus = 'VERIFIED' | 'UNVERIFIED';

export type RicEventType =
  | 'MHQ'
  | 'MTQ'
  | 'DAI'
  | 'KTIQ'
  | 'POSTER'
  | 'VIDEOGRAFI';

export interface RicParticipant {
  id: string;
  role: string;
  fullname: string;
  email: string;
  phone: string;
}

export interface RicDocument {
  uploaded: boolean;
  url: string;
}

export interface RicDocuments {
  identity_card: RicDocument;
  statement_letter: RicDocument;
}

export interface RicRegistration {
  id: string;
  no?: number;
  registration_id: string;
  team_name: string;
  event_type: RicEventType | string;
  institution: string;
  status: RicRegistrationStatus | string;
  created_at: string;
  updated_at?: string;
  // Leader/participant fields
  leader_name: string;
  leader_email: string;
  leader_phone?: string;
  province?: string;
  city?: string;
  supervisor_name?: string;
  supervisor_phone?: string;
  participants_count?: number;
  // Detail view fields
  participants?: RicParticipant[];
  documents?: RicDocuments;
}

export interface RicRegistrationFormData {
  team_name: string;
  event_type: string;
  institution: string;
  status: RicRegistrationStatus;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  province: string;
  city: string;
  supervisor_name: string;
  supervisor_phone: string;
}

export interface RicRegistrationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RicRegistrationStatus | 'all';
}

export interface RicRegistrationMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

export interface RicRegistrationListResponse {
  success: boolean;
  message: string;
  data: RicRegistration[];
  meta: RicRegistrationMeta;
}

export interface RicRegistrationDetailResponse {
  success: boolean;
  data: RicRegistration;
}

export interface RicRegistrationMutationResponse {
  success: boolean;
  message: string;
  data?: RicRegistration;
}
