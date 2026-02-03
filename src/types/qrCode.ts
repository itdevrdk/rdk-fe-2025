export interface QRCodeSettings {
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeImage?: boolean; // Reserved for potential future use or if backend supports it
  imageSource?: string; // Reserved
}

export interface QRCode {
  id: string;
  title: string;
  content: string;
  settings: QRCodeSettings;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQRCodeRequest {
  title: string;
  content: string;
  settings?: QRCodeSettings;
}

export interface UpdateQRCodeRequest {
  title?: string;
  content?: string;
  settings?: QRCodeSettings;
}

export interface QRCodeListResponse {
  code: number;
  status: boolean;
  message: string;
  data: QRCode[];
  meta: {
    current_page: number;
    total_page: number;
    total_data: number;
  };
}

export interface QRCodeDetailResponse {
  code: number;
  status: boolean;
  message: string;
  data: QRCode;
}

// Common query params for listing
export interface QRCodeQuery {
  page?: number;
  limit?: number;
  search?: string;
}
