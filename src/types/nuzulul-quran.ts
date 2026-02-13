export interface NuzululQuranRegistration {
  nama_lengkap: string;
  email: string;
  whatsapp: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  instansi: string;
  mentoring_2026: 'Ya' | 'Bukan';
}

export interface NuzululQuranRegistrationResponse {
  fullname: string;
  code: string;
  status: string;
}

export interface NuzululQuranCheckData {
  id: string;
  nama_lengkap: string;
  email: string;
  registered_at: string;
  status: string;
}

export interface NuzululQuranCheckResponse {
  is_registered: boolean;
  data: NuzululQuranCheckData | null;
}

export interface NuzululQuranAdminData {
  id: string;
  nama_lengkap: string;
  email: string;
  whatsapp: string;
  jenis_kelamin: string;
  instansi: string;
  mentoring_2026: string;
  code: string;
  created_at: string;
}

export interface NuzululQuranQuery {
  page?: number;
  limit?: number;
  search?: string;
  event_name?: string;
  status?: string;
}

export interface MetaData {
  event_name: string;
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface NuzululQuranAdminListResponse {
  code: number;
  status: boolean;
  message: string;
  data: {
    fullname: string;
    code: string;
  }[];
  meta: MetaData;
}

export interface NuzululQuranDetailData {
  rsvp_id: string;
  event_name: string;
  fullname: string;
  telephone: string;
  institution: string;
  province: string;
  city: string;
  code: string;
  status: 'registered' | 'joined';
}

export interface NuzululQuranDetailResponse {
  code: number;
  status: boolean;
  message: string;
  data: NuzululQuranDetailData;
}

export interface NuzululQuranStatusUpdateResponse {
  code: number;
  status: boolean;
  message: string;
  data: {
    event_name: string;
    fullname: string;
    code: string;
  };
}
