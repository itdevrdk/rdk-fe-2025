// Admin RIC Event Types
// Sesuai dengan backend entity RicEvent

export type RicEventType =
  | 'MHQ'
  | 'MTQ'
  | 'DAI'
  | 'KTIQ'
  | 'POSTER'
  | 'VIDEOGRAFI';

export interface RicEvent {
  id: string;
  event_type: RicEventType;
  quota: number;
  registration_count: number; // Read-only, computed from registrations
  created_at: string;
  updated_at: string;
}

export interface RicEventFormData {
  event_type: RicEventType | string;
  quota: number;
}

// Query params for GET /api/v1/admin/ric-event
export interface RicEventQuery {
  page?: number;
  limit?: number;
  search?: string; // Search by event_type
  event_type?: RicEventType;
  sort_by?: 'event_type' | 'quota' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Request body for POST /api/v1/admin/ric-event
export interface CreateRicEventRequest {
  event_type: RicEventType;
  quota: number;
}

// Request body for PUT /api/v1/admin/ric-event/:id
export interface UpdateRicEventRequest {
  event_type: RicEventType;
  quota: number;
}

// Response meta for paginated list
export interface RicEventMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

// Response for GET /api/v1/admin/ric-event (list)
export interface RicEventListResponse {
  status: boolean;
  message: string;
  data: RicEvent[];
  meta: RicEventMeta;
}

// Response for GET /api/v1/admin/ric-event/:id (detail)
export interface RicEventDetailResponse {
  status: boolean;
  message: string;
  data: RicEvent;
}

// Response for POST/PUT /api/v1/admin/ric-event
export interface RicEventMutationResponse {
  status: boolean;
  message: string;
  data: RicEvent;
}
