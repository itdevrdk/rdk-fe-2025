export interface ShortenLink {
  link_id: string; // uuid
  shorten_link: string; // The suffix part (e.g. "my-link")
  original_link: string; // The full original URL
  visit_count: number;
  created_at: string; // Date string
}

export type CreateShortenLinkRequest = {
  shorten_link: string;
  original_link: string;
};

export type UpdateShortenLinkRequest = {
  shorten_link: string;
  original_link: string;
};

// Pagination types
export interface ShortenLinkMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface ShortenLinkQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ShortenLinkListResponse {
  status: boolean;
  message: string;
  data: ShortenLink[];
  meta: ShortenLinkMeta;
}
