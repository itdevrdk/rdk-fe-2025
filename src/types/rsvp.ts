// ============================================
// General RSVP Types
// ============================================

/**
 * Request payload for general RSVP registration
 * POST /api/v1/rsvp
 */
export interface RsvpCreateRequest {
  fullname: string;
  institution: string;
  province: string;
  city: string;
}

/**
 * Response from general RSVP registration
 */
export interface RsvpCreateResponse {
  fullname: string;
  code: string;
  status: 'registered' | 'joined';
}

// ============================================
// Admin Manual RSVP Creation Types
// ============================================

/**
 * Valid event names for RSVP registration
 * Must match exactly (case-sensitive) with backend validation
 */
export const VALID_EVENT_NAMES = [
  'Nuzulul Quran',
  'Ngabuburits #1',
  'Ngabuburits #2',
  'Ngabuburits #3',
  'Ngabuburits #4',
  'Simposium Ramadan #1',
  'Simposium Ramadan #2',
  'Lailatul Hikmah',
  'HOMe (Heart Of Muslimah)',
] as const;

export type EventName = (typeof VALID_EVENT_NAMES)[number];

/**
 * Request payload for admin to manually add RSVP data
 * POST /api/v1/admin/rsvp (or /api/v1/admin/rsvp/manual)
 */
export interface RsvpAdminCreateRequest {
  fullname: string;
  institution: string;
  event_name: string; // Required
}

/**
 * Response from admin manual RSVP creation
 */
export interface RsvpAdminCreateResponse {
  rsvp_id?: string;
  fullname: string;
  institution: string;
  code: string;
  status: 'registered' | 'joined';
  event_name?: string;
}

// ============================================
// Admin RSVP Types (for both General & Nuzulul Quran)
// ============================================

/**
 * Query parameters for admin RSVP list
 * GET /api/v1/admin/rsvp
 */
export interface RsvpAdminQuery {
  event_name?: string;
  page?: number;
  limit?: number;
  status?: 'registered' | 'joined';
  search?: string;
}

/**
 * Individual RSVP item in admin list
 */
export interface RsvpAdminListItem {
  fullname: string;
  code: string;
  status: 'registered' | 'joined';
  event_name?: string;
}

/**
 * Metadata for paginated RSVP list
 */
export interface RsvpAdminMeta {
  event_name: string;
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

/**
 * RSVP data returned by GET /admin/rsvp/:code (for check-in)
 */
export interface RsvpByCodeData {
  event_name: string;
  fullname: string;
  code: string;
  status: 'registered' | 'joined';
}

/**
 * Complete RSVP details returned by GET /admin/rsvp/:code/details
 */
export interface RsvpDetailsData {
  rsvp_id: string;
  event_name: string;
  fullname: string;
  institution: string;
  province: string;
  city: string;
  code: string;
  status: 'registered' | 'joined';
}

/**
 * Request payload for updating RSVP status (check-in)
 * PATCH /admin/rsvp/:code/status
 */
export interface RsvpStatusUpdateRequest {
  status: 'joined';
}

/**
 * Response from RSVP status update
 */
export interface RsvpStatusUpdateResponse {
  event_name: string;
  fullname: string;
  code: string;
}

// ============================================
// Database Entity (for reference only)
// ============================================

/**
 * Complete RSVP entity structure (database model)
 * This is for reference and may not be directly used in API responses
 */
export interface RsvpEntity {
  id: string; // UUID
  fullname: string;
  institution: string;
  province: string;
  city: string;
  code: string; // Unique, 6 characters (e.g., "RDKA49")
  status: 'registered' | 'joined';
  event_type: 'General' | "Peringatan Nuzulul Qur'an RDK 47 ITS";
  email?: string; // Optional (used by Nuzulul Quran)
  gender?: string; // Optional (used by Nuzulul Quran)
  created_at: string;
  updated_at: string;
}

// ============================================
// Generic RSVP Types (New System)
// ============================================

export interface GenericRsvpRequest {
  nama_lengkap: string;
  email: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  instansi: string;
}

export interface GenericRsvpResponse {
  code: number;
  status: boolean;
  message: string;
  data: {
    fullname: string;
    code: string;
    status: string;
  };
}

export interface GenericRsvpCheckData {
  id: string;
  nama_lengkap: string;
  email: string;
  registered_at: string;
  status: string;
}

export interface GenericRsvpCheckResponse {
  code: number;
  status: boolean;
  message: string;
  data: {
    is_registered: boolean;
    data: GenericRsvpCheckData | null;
  } | null;
}

// ============================================
// RSVP Summary Types
// ============================================

/**
 * RSVP summary statistics for an event or all events
 * GET /api/v1/admin/rsvp/summary
 */
export interface RsvpSummary {
  event_name: string | null; // null jika tidak ada filter
  total_count: number; // Total semua pendaftar
  total_joined: number; // Total yang sudah hadir
  total_registered: number; // Total yang masih terdaftar
}

/**
 * Response from RSVP summary endpoint
 */
export interface RsvpSummaryResponse {
  code: number;
  status: boolean;
  message: string;
  data: RsvpSummary;
}
