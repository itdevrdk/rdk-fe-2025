export type KhatamanParticipantType = 'ITS' | 'UMUM';
export type KhatamanRegistrationStatus = 'REGISTERED' | 'SELECTED' | 'REJECTED';
export type KhatamanCommitmentLevel = 'SIAP' | 'DIUSAHAKAN' | 'TIDAK_SIAP';

export interface KhatamanParticipant {
  id: string;
  event_code: string;
  full_name: string;
  email: string;
  phone: string;
  participant_type: KhatamanParticipantType;
  commitment_level: KhatamanCommitmentLevel;
  registration_status: KhatamanRegistrationStatus;
  motivation?: string;
  follow_proof_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface KhatamanPagination {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface KhatamanListResponse {
  code: number;
  status: boolean;
  message: string;
  data: {
    items: KhatamanParticipant[];
    pagination: KhatamanPagination;
  };
}

export interface KhatamanDetailResponse {
  code: number;
  status: boolean;
  message: string;
  data: KhatamanParticipant;
}

export interface KhatamanStatusUpdatePayload {
  registration_status: KhatamanRegistrationStatus;
  notes?: string;
}

export interface KhatamanMutationResponse {
  code: number;
  status: boolean;
  message: string;
  data: KhatamanParticipant;
}

export interface KhatamanListParams {
  event_code: string;
  page: number;
  per_page: number;
  search?: string;
  registration_status?: 'all' | KhatamanRegistrationStatus;
  participant_type?: 'all' | KhatamanParticipantType;
}
