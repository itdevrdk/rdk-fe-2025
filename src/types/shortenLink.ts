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
