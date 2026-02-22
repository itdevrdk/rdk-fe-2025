/**
 * Feedback Utility Functions and Constants
 *
 * Provides helper functions for feedback operations including:
 * - Rating configuration and translation
 * - Form validation
 * - Feedback search and filtering
 * - Statistics calculations
 */

import {
  EMOJI_RATINGS,
  FeedbackRating,
  FeedbackSummary,
} from '@/types/feedback';

// ============================================
// Rating Configuration
// ============================================

/**
 * Detailed rating configuration with colors and scores
 * Useful for UI rendering and statistics
 */
export const RATING_CONFIG = {
  'very-angry': {
    label: 'Sangat Tidak Puas',
    emoji: '😡',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    score: 1,
    iconClass: 'icon-very-angry',
  },
  angry: {
    label: 'Tidak Puas',
    emoji: '😠',
    color: '#F97316',
    bgColor: '#FFEDD5',
    score: 2,
    iconClass: 'icon-angry',
  },
  neutral: {
    label: 'Netral',
    emoji: '😐',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    score: 3,
    iconClass: 'icon-neutral',
  },
  happy: {
    label: 'Puas',
    emoji: '😊',
    color: '#84CC16',
    bgColor: '#F2FDE8',
    score: 4,
    iconClass: 'icon-happy',
  },
  'very-happy': {
    label: 'Sangat Puas',
    emoji: '😄',
    color: '#22C55E',
    bgColor: '#DCFCE7',
    score: 5,
    iconClass: 'icon-very-happy',
  },
} as const;

// ============================================
// Rating Utilities
// ============================================

/**
 * Get rating configuration by rating value
 *
 * @param rating - Rating value
 * @returns Rating configuration with emoji, color, and score
 *
 * @example
 * ```ts
 * const config = getRatingConfig('very-happy');
 * console.log(config.emoji); // 😄
 * console.log(config.score); // 5
 * ```
 */
export function getRatingConfig(rating: FeedbackRating) {
  return RATING_CONFIG[rating];
}

/**
 * Get all rating options for select dropdown
 *
 * @returns Array of rating options with emoji and label
 *
 * @example
 * ```tsx
 * <select>
 *   {getRatingOptions().map(option => (
 *     <option key={option.value} value={option.value}>
 *       {option.emoji} {option.label}
 *     </option>
 *   ))}
 * </select>
 * ```
 */
export function getRatingOptions() {
  return EMOJI_RATINGS.map((rating) => {
    const config = RATING_CONFIG[rating.value];
    return {
      value: rating.value,
      label: rating.label,
      emoji: rating.emoji,
      color: config.color,
    };
  });
}

/**
 * Convert rating score to rating value
 *
 * @param score - Rating score (1-5)
 * @returns Rating value or null if invalid
 *
 * @example
 * ```ts
 * scoreToRating(5); // 'very-happy'
 * scoreToRating(3); // 'neutral'
 * ```
 */
export function scoreToRating(score: number): FeedbackRating | null {
  const entry = Object.entries(RATING_CONFIG).find(
    ([_, config]) => config.score === score,
  );
  return entry ? (entry[0] as FeedbackRating) : null;
}

/**
 * Convert rating value to score
 *
 * @param rating - Rating value
 * @returns Numeric score (1-5)
 *
 * @example
 * ```ts
 * ratingToScore('very-happy'); // 5
 * ```
 */
export function ratingToScore(rating: FeedbackRating): number {
  return RATING_CONFIG[rating].score;
}

// ============================================
// Form Validation
// ============================================

/**
 * Validation rules for feedback form
 */
export const FEEDBACK_VALIDATION = {
  name: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-._@ñáéíóúàèìòù]+$/i, // Allow common characters and accents
  },
  message: {
    minLength: 1,
    maxLength: 1000,
  },
  rating: {
    required: true,
    values: ['very-angry', 'angry', 'neutral', 'happy', 'very-happy'],
  },
  event: {
    required: true,
  },
} as const;

/**
 * Validate feedback form data
 *
 * @param data - Feedback form data
 * @returns Validation result with errors if any
 *
 * @example
 * ```ts
 * const result = validateFeedbackForm(formData);
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateFeedbackForm(data: {
  name?: string;
  rating?: FeedbackRating;
  message?: string;
  event?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Nama harus diisi';
  } else if (data.name.length > FEEDBACK_VALIDATION.name.maxLength) {
    errors.name = `Nama maksimal ${FEEDBACK_VALIDATION.name.maxLength} karakter`;
  } else if (!FEEDBACK_VALIDATION.name.pattern.test(data.name)) {
    errors.name = 'Nama mengandung karakter yang tidak diizinkan';
  }

  // Validate event
  if (!data.event || data.event.trim().length === 0) {
    errors.event = 'Kegiatan harus dipilih';
  }

  // Validate rating
  if (!data.rating) {
    errors.rating = 'Rating harus dipilih';
  } else if (!FEEDBACK_VALIDATION.rating.values.includes(data.rating)) {
    errors.rating = 'Rating tidak valid';
  }

  // Validate message
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Pesan harus diisi';
  } else if (data.message.length > FEEDBACK_VALIDATION.message.maxLength) {
    errors.message = `Pesan maksimal ${FEEDBACK_VALIDATION.message.maxLength} karakter`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize feedback text input
 * Removes leading/trailing whitespace and extra spaces
 *
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeFeedbackText(text: string): string {
  return text.trim().replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

// ============================================
// Statistics & Analysis
// ============================================

/**
 * Calculate rating percentage
 *
 * @param count - Count for specific rating
 * @param total - Total count
 * @returns Percentage (0-100)
 *
 * @example
 * ```ts
 * calculateRatingPercentage(25, 100); // 25
 * ```
 */
export function calculateRatingPercentage(
  count: number,
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

/**
 * Calculate sentiment based on average rating
 * Returns a descriptive sentiment label
 *
 * @param averageScore - Average rating score (1-5)
 * @returns Sentiment label
 *
 * @example
 * ```ts
 * getSentimentLabel(4.2); // 'Positif'
 * getSentimentLabel(2.5); // 'Negatif'
 * ```
 */
export function getSentimentLabel(averageScore: number): string {
  if (averageScore >= 4.0) return 'Sangat Positif';
  if (averageScore >= 3.5) return 'Positif';
  if (averageScore >= 2.5) return 'Netral';
  if (averageScore >= 1.5) return 'Negatif';
  return 'Sangat Negatif';
}

/**
 * Get sentiment color based on average rating
 *
 * @param averageScore - Average rating score (1-5)
 * @returns Hex color code
 *
 * @example
 * ```ts
 * const color = getSentimentColor(4.5); // '#22C55E'
 * ```
 */
export function getSentimentColor(averageScore: number): string {
  if (averageScore >= 4.0) return '#22C55E'; // Green
  if (averageScore >= 3.5) return '#84CC16'; // Lime
  if (averageScore >= 2.5) return '#F59E0B'; // Amber
  if (averageScore >= 1.5) return '#F97316'; // Orange
  return '#DC2626'; // Red
}

/**
 * Calculate summary statistics from feedback data
 *
 * @param summary - Feedback summary data
 * @returns Statistics object with percentages and labels
 */
export function calculateFeedbackStatistics(summary: FeedbackSummary) {
  const total = summary.total_count;
  const breakdown = summary.rating_breakdown;

  return {
    total: total,
    average: summary.average_rating_score,
    sentiment: getSentimentLabel(summary.average_rating_score),
    sentimentColor: getSentimentColor(summary.average_rating_score),
    percentages: {
      'very-angry': calculateRatingPercentage(breakdown['very-angry'], total),
      angry: calculateRatingPercentage(breakdown['angry'], total),
      neutral: calculateRatingPercentage(breakdown['neutral'], total),
      happy: calculateRatingPercentage(breakdown['happy'], total),
      'very-happy': calculateRatingPercentage(breakdown['very-happy'], total),
    },
    positiveCount: breakdown['happy'] + breakdown['very-happy'],
    negativeCount: breakdown['very-angry'] + breakdown['angry'],
    neutralCount: breakdown['neutral'],
    positivePercentage: calculateRatingPercentage(
      breakdown['happy'] + breakdown['very-happy'],
      total,
    ),
    negativePercentage: calculateRatingPercentage(
      breakdown['very-angry'] + breakdown['angry'],
      total,
    ),
  };
}

// ============================================
// Search & Filter
// ============================================

/**
 * Check if feedback matches search query
 * Searches in name and message fields
 *
 * @param feedback - Feedback object
 * @param query - Search query
 * @returns True if feedback matches
 *
 * @example
 * ```ts
 * const matches = matchesFeedbackSearch(feedback, 'bagus');
 * ```
 */
export function matchesFeedbackSearch(
  feedback: { name: string; message: string },
  query: string,
): boolean {
  const lowercaseQuery = query.toLowerCase();
  return (
    feedback.name.toLowerCase().includes(lowercaseQuery) ||
    feedback.message.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Filter feedbacks by rating
 *
 * @param feedbacks - Array of feedbacks
 * @param rating - Rating to filter by
 * @returns Filtered feedbacks
 *
 * @example
 * ```ts
 * const positiveFeedback = filterByRating(feedbacks, 'very-happy');
 * ```
 */
export function filterByRating(
  feedbacks: Array<{ rating: FeedbackRating }>,
  rating: FeedbackRating,
) {
  return feedbacks.filter((fb) => fb.rating === rating);
}

/**
 * Sort feedbacks by date
 *
 * @param feedbacks - Array of feedbacks
 * @param order - 'newest' or 'oldest'
 * @returns Sorted feedbacks
 *
 * @example
 * ```ts
 * const sorted = sortFeedbacksByDate(feedbacks, 'newest');
 * ```
 */
export function sortFeedbacksByDate(
  feedbacks: Array<{ created_at: string }>,
  order: 'newest' | 'oldest' = 'newest',
) {
  const sorted = [...feedbacks].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
}

// ============================================
// Formatting
// ============================================

/**
 * Format feedback date to readable string
 *
 * @param date - ISO date string or Date object
 * @param locale - Locale for formatting (default: 'id-ID')
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatFeedbackDate('2026-02-22T10:30:00Z');
 * // '22/02/2026 10:30'
 * ```
 */
export function formatFeedbackDate(
  date: string | Date,
  locale = 'id-ID',
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate feedback message for display
 *
 * @param message - Message to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated message with ellipsis
 *
 * @example
 * ```ts
 * truncateFeedbackMessage('Long message...', 20);
 * // 'Long message...(tru...'
 * ```
 */
export function truncateFeedbackMessage(
  message: string,
  maxLength = 100,
): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
}
