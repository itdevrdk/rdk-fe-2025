import { ApiResponse, PaginatedApiResponse } from '@/types/api';

// ============================================
// Feedback Types
// ============================================

/**
 * Available emoji ratings for feedback
 */
export const EMOJI_RATINGS = [
  { value: 'very-angry', label: 'Marah Banget', emoji: '😡' },
  { value: 'angry', label: 'Kesal', emoji: '😠' },
  { value: 'neutral', label: 'Biasa Aja', emoji: '😐' },
  { value: 'happy', label: 'Seneng', emoji: '😊' },
  { value: 'very-happy', label: 'Seneng Banget', emoji: '😄' },
] as const;

export type EmojiRating = (typeof EMOJI_RATINGS)[number]['value'];

/**
 * Request payload for submitting feedback
 * POST /api/v1/feedback
 */
export interface FeedbackCreateRequest {
  name: string;
  rating: EmojiRating;
  message: string;
}

/**
 * Base feedback item shape
 */
export interface FeedbackItem {
  id: string;
  name: string;
  rating: EmojiRating;
  message: string;
  created_at: string;
}

/**
 * Response from feedback submission
 */
export type FeedbackCreateResponse = FeedbackItem;
export type FeedbackCreateApiResponse = ApiResponse<FeedbackCreateResponse>;

// ============================================
// Admin Feedback Types
// ============================================

/**
 * Single feedback item in admin list
 */
export interface FeedbackAdminListItem extends FeedbackItem {
  updated_at: string;
}

/**
 * Query parameters for fetching feedback list
 */
export interface FeedbackAdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  rating?: EmojiRating | '';
  sort?: 'newest' | 'oldest';
}

/**
 * Response structure for admin feedback list
 */
export type FeedbackAdminListResponse = PaginatedApiResponse<
  FeedbackAdminListItem[]
>;

export type FeedbackRatingBreakdown = Record<EmojiRating, number>;

/**
 * Feedback summary for admin dashboard
 */
export interface FeedbackSummary {
  total_count: number;
  rating_breakdown: FeedbackRatingBreakdown;
  average_rating_score: number;
  latest_feedback: FeedbackCreateResponse | null;
}

/**
 * Response for feedback summary
 */
export type FeedbackSummaryResponse = ApiResponse<FeedbackSummary>;

/**
 * Response for deleting a single feedback
 */
export type FeedbackDeleteResponse = ApiResponse<null>;

/**
 * Response data for bulk delete
 */
export interface FeedbackBulkDeleteData {
  deleted_count: number;
  failed_ids: string[];
}

/**
 * Response for bulk delete
 */
export type FeedbackBulkDeleteResponse = ApiResponse<FeedbackBulkDeleteData>;
