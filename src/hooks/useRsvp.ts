import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import { ApiResponse } from '@/types/api';
import { RsvpCreateRequest, RsvpCreateResponse } from '@/types/rsvp';

/**
 * Hook for general RSVP operations (public endpoints)
 *
 * Provides functionality for:
 * - General RSVP registration (POST /api/v1/rsvp)
 *
 * @example
 * ```tsx
 * const { loading, registerRsvp } = useRsvp();
 *
 * const handleSubmit = async (data) => {
 *   try {
 *     const response = await registerRsvp(data);
 *     console.log('Registered with code:', response.data.code);
 *   } catch (error) {
 *     console.error('Registration failed:', error);
 *   }
 * };
 * ```
 */
export const useRsvp = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Register a new general RSVP participant
   *
   * @param data - Registration data including fullname, institution, province, city
   * @returns API response with generated code and status
   * @throws {AxiosError} 409 - Duplicate registration (same fullname)
   * @throws {AxiosError} 422 - Validation error (missing required fields)
   *
   * @example
   * ```tsx
   * const result = await registerRsvp({
   *   fullname: "Ahmad Fauzi",
   *   institution: "Institut Teknologi Sepuluh Nopember",
   *   province: "Jawa Timur",
   *   city: "Surabaya"
   * });
   * // result.data.code => "RDKA49"
   * // result.data.status => "registered"
   * ```
   */
  const registerRsvp = useCallback(async (data: RsvpCreateRequest) => {
    try {
      setLoading(true);
      const res = await api.post<ApiResponse<RsvpCreateResponse>>(
        '/rsvp',
        data,
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    registerRsvp,
  };
};
