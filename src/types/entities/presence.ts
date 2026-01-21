// ============= COMMITTEE =============
export interface Committee {
  id: string; // UUID
  fullname: string;
  major: string;
  nrp: number; // BIGINT - changed from string to number
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface CreateCommitteeForm {
  fullname: string; // max 255 chars
  major: string; // max 100 chars
  nrp: number; // unique
}

export interface UpdateCommitteeForm {
  fullname: string;
  major: string;
  nrp: number;
}

// ============= COMMITTEE EVENT =============
export interface CommitteeEvent {
  id: string; // UUID
  name: string;
  timestamp: string; // ISO 8601
  created_at: string;
  updated_at: string;
}

export interface CreateCommitteeEventForm {
  name: string; // max 255 chars, required
  timestamp?: string; // ISO 8601, optional (default: now)
}

export interface UpdateCommitteeEventForm {
  name?: string;
  timestamp?: string;
}

// ============= PRESENCE =============
export type PresenceStatus = 'attend' | 'skip' | 'permit';

export interface PresenceInfo {
  id: string;
  fullname: string;
  major: string;
  nrp: number;
}

export interface EventInfo {
  id: string;
  name: string;
  timestamp: string;
}

export interface PresenceRecord {
  id: string;
  status: PresenceStatus;
  timestamp: string;
}

export interface Presence {
  id: string;
  committee_id: string;
  committee_event_id: string;
  status: PresenceStatus;
  timestamp: string;
  reason?: string; // Alasan ketidakhadiran (optional)
  committee: PresenceInfo;
  committee_event: EventInfo;
}

export interface CreatePresenceForm {
  committee_id: string;
  committee_event_id: string;
  status: PresenceStatus;
  reason?: string;
}

export interface UpdatePresenceForm {
  status?: PresenceStatus;
  reason?: string;
}

// Response for event-based presence summary
export interface PresenceSummary {
  event: EventInfo;
  total_present: number; // Jumlah yang hadir
  total_absent: number; // Jumlah yang tidak hadir
  presences: Presence[];
  meta: PaginationMeta;
}

export interface CheckPresenceRequest {
  identifier: string; // NRP (numeric) or fullname (text)
  event_id: string;
}

export interface CheckPresenceResponse {
  committee: PresenceInfo;
  committee_event: EventInfo;
  presence: PresenceRecord | null; // null if not present yet
}

export interface SetStatusRequest {
  committee_id: string;
  event_id: string;
  status: PresenceStatus;
}

// ============= PRESENCE SUMMARY =============
export interface PresenceSummary {
  event_id: string;
  total_present: number;
  total_absent: number;
  total_permit: number;
  total_records: number;
}

// ============= PAGINATION =============
export interface PaginationMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface PaginatedResponse<T> {
  code: number;
  status: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

// ============= STANDARD RESPONSE =============
export interface ApiResponse<T = unknown> {
  code: number;
  status: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ============= LIST PARAMS =============
export interface CommitteeListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CommitteeEventListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PresenceListParams {
  page?: number;
  limit?: number;
  search?: string;
  event_id?: string;
  status?: PresenceStatus | 'all';
}
