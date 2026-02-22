import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import { ApiError, ApiResponse } from '@/types/api';
import {
  FeedbackCreateRequest,
  FeedbackCreateResponse,
} from '@/types/feedback';

/**
 * Hook for feedback operations (public endpoints)
 *
 * Provides functionality for:
 * - Submitting feedback (POST /api/v1/feedback)
 * - No authentication required
 *
 * @example
 * ```tsx
 * const { loading, submitFeedback, error } = useFeedback();
 *
 * const handleSubmit = async (data) => {
 *   try {
 *     const response = await submitFeedback(data);
 *     console.log('Feedback submitted:', response.data);
 *   } catch (error) {
 *     console.error('Submission failed:', error);
 *   }
 * };
 * ```
 */
export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Submit new feedback
   *
   * @param data - Feedback data including name, rating, and message
   * @returns API response with feedback data
   * @throws {AxiosError<ApiError>} - Validation error or server error
   *
   * @example
   * ```tsx
   * const result = await submitFeedback({
   *   name: "Ahmad Fauzi",
   *   rating: "happy",
   *   message: "Website sangat membantu!"
   * });
   * console.log('Submitted with ID:', result.data.id);
   * console.log('Created at:', result.data.created_at);
   * ```
   */
  const submitFeedback = useCallback(
    async (
      data: FeedbackCreateRequest,
    ): Promise<ApiResponse<FeedbackCreateResponse>> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post<ApiResponse<FeedbackCreateResponse>>(
          '/feedback',
          data,
        );
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>;
        const errorData = axiosError.response?.data;
        setError(errorData || null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    submitFeedback,
  };
};
