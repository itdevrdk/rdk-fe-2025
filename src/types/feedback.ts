import { ApiResponse } from '@/types/api';

// ============================================
// Feedback Types
// ============================================

/**
 * Available emoji ratings for feedback
 * Rating values align with API specification
 */
export const EMOJI_RATINGS = [
  {
    value: 'very-angry',
    label: 'Sangat Tidak Puas',
    emoji: '😡',
    color: '#DC2626',
    score: 1,
  },
  {
    value: 'angry',
    label: 'Tidak Puas',
    emoji: '😠',
    color: '#F97316',
    score: 2,
  },
  {
    value: 'neutral',
    label: 'Netral',
    emoji: '😐',
    color: '#F59E0B',
    score: 3,
  },
  { value: 'happy', label: 'Puas', emoji: '😊', color: '#84CC16', score: 4 },
  {
    value: 'very-happy',
    label: 'Sangat Puas',
    emoji: '😄',
    color: '#22C55E',
    score: 5,
  },
] as const;

export type FeedbackRating = (typeof EMOJI_RATINGS)[number]['value'];

/**
 * @deprecated Use FeedbackRating instead
 */
export type EmojiRating = FeedbackRating;

/**
 * Request payload for submitting feedback
 * POST /api/v1/feedback
 *
 * @param name - max 100 characters
 * @param rating - one of: very-angry, angry, neutral, happy, very-happy
 * @param message - max 1000 characters
 * @param event - required single event name from RSVP
 */
export interface FeedbackCreateRequest {
  name: string; // max 100 chars
  rating: FeedbackRating;
  message: string; // max 1000 chars
  event: string; // required: single event participated
}

/**
 * Base feedback item shape
 */
export interface FeedbackResponse {
  id: string;
  name: string;
  rating: FeedbackRating;
  message: string;
  event: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Response for feedback detail
 * GET /api/v1/admin/feedback/:id
 */
export type FeedbackDetailResponse = ApiResponse<FeedbackResponse>;

/**
 * Response from feedback submission
 */
export type FeedbackCreateResponse = FeedbackResponse;
export type FeedbackCreateApiResponse = ApiResponse<FeedbackCreateResponse>;

/**
 * @deprecated Use FeedbackResponse instead
 */
export type FeedbackItem = FeedbackResponse;

// ============================================
// Admin Feedback Types
// ============================================

/**
 * Single feedback item in admin list
 */
export type FeedbackAdminListItem = FeedbackResponse;

/**
 * Pagination metadata
 */
export interface MetaPagination {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

/**
 * Query parameters for fetching feedback list
 * GET /api/v1/admin/feedback
 */
export interface FeedbackAdminQuery {
  page?: number; // default: 1
  limit?: number; // default: 10
  search?: string; // search by name or message
  rating?: FeedbackRating | '';
  event?: string; // filter by event name
  sort?: 'newest' | 'oldest'; // default: 'newest'
}

/**
 * Response structure for admin feedback list
 */
export interface FeedbackAdminListData {
  data: FeedbackAdminListItem[];
  meta: MetaPagination;
}

export type FeedbackAdminListResponse = ApiResponse<FeedbackAdminListData>;

/**
 * Rating breakdown statistics
 */
export type FeedbackRatingBreakdown = Record<FeedbackRating, number>;

/**
 * Feedback summary for admin dashboard
 * GET /api/v1/admin/feedback/summary
 */
export interface FeedbackSummary {
  total_count: number;
  rating_breakdown: FeedbackRatingBreakdown;
  average_rating_score: number;
  latest_feedback?: FeedbackResponse;
}

/**
 * Response for feedback summary
 */
export type FeedbackSummaryResponse = ApiResponse<FeedbackSummary>;

/**
 * Response for deleting a single feedback
 * DELETE /api/v1/admin/feedback/:id
 */
export type FeedbackDeleteResponse = ApiResponse<null>;

/**
 * Request payload for bulk delete
 * POST /api/v1/admin/feedback/bulk-delete
 */
export interface FeedbackBulkDeleteRequest {
  ids: string[]; // array of UUIDs, min 1
}

/**
 * Response data for bulk delete
 */
export interface FeedbackBulkDeleteData {
  deleted_count: number;
  failed_ids: string[];
}

/**
 * Response for bulk delete
 * Status code can be 200 (all deleted) or 207 (partial success)
 */
export interface FeedbackBulkDeleteResponse extends ApiResponse<FeedbackBulkDeleteData> {
  code: 200 | 207;
}
