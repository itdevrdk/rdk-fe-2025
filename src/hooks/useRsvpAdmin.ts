import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import { ApiResponse } from '@/types/api';
import {
  RsvpAdminListItem,
  RsvpAdminMeta,
  RsvpAdminQuery,
  RsvpByCodeData,
  RsvpDetailsData,
  RsvpStatusUpdateRequest,
  RsvpStatusUpdateResponse,
} from '@/types/rsvp';

/**
 * Response structure for admin RSVP list endpoint
 */
interface RsvpAdminListResponse {
  code: number;
  status: boolean;
  message: string;
  data: RsvpAdminListItem[];
  meta: RsvpAdminMeta;
}

/**
 * Hook for admin RSVP operations (authenticated endpoints)
 *
 * Provides functionality for:
 * - Get all RSVPs with pagination and filters
 * - Get RSVP by code (for check-in)
 * - Get complete RSVP details
 * - Update RSVP status (check-in)
 *
 * All methods require authentication (JWT Bearer token)
 *
 * @example
 * ```tsx
 * const { loading, getAllRsvps, getRsvpByCode, updateRsvpStatus } = useRsvpAdmin();
 *
 * // Get paginated list
 * const list = await getAllRsvps({ page: 1, limit: 10, status: 'registered' });
 *
 * // Check-in a participant
 * const participant = await getRsvpByCode('RDKA49');
 * await updateRsvpStatus('RDKA49', { status: 'joined' });
 * ```
 */
export const useRsvpAdmin = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Get all RSVPs with pagination and optional filters
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of RSVPs with metadata
   * @throws {AxiosError} 401 - Unauthorized (missing or invalid token)
   * @throws {AxiosError} 422 - Invalid status value
   *
   * @example
   * ```tsx
   * const result = await getAllRsvps({
   *   event_name: "Peringatan Nuzulul Qur'an RDK 47 ITS",
   *   page: 1,
   *   limit: 10,
   *   status: 'registered',
   *   search: 'Ahmad'
   * });
   * // result.data => [{ fullname: "Ahmad Fauzi", code: "RDKA49" }, ...]
   * // result.meta => { page: 1, limit: 10, total_data: 25, total_page: 3 }
   * ```
   */
  const getAllRsvps = useCallback(async (params?: RsvpAdminQuery) => {
    try {
      setLoading(true);
      const res = await api.get<RsvpAdminListResponse>('/admin/rsvp', {
        params,
      });
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get RSVP by code (used for check-in verification)
   *
   * @param code - RSVP code (e.g., "RDKA49")
   * @returns RSVP data with event info, fullname, code, and status
   * @throws {AxiosError} 401 - Unauthorized
   * @throws {AxiosError} 404 - RSVP not found
   *
   * @example
   * ```tsx
   * const result = await getRsvpByCode('RDKA49');
   * // result.data => {
   * //   event_name: "Peringatan Nuzulul Qur'an RDK 47 ITS",
   * //   fullname: "Ahmad Fauzi",
   * //   code: "RDKA49",
   * //   status: "registered"
   * // }
   * ```
   */
  const getRsvpByCode = useCallback(async (code: string) => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<RsvpByCodeData>>(
        `/admin/rsvp/${code}`,
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get complete RSVP details including all registration information
   *
   * @param code - RSVP code (e.g., "RDKA49")
   * @returns Complete RSVP details including institution, province, city
   * @throws {AxiosError} 401 - Unauthorized
   * @throws {AxiosError} 404 - RSVP not found
   *
   * @example
   * ```tsx
   * const result = await getRsvpDetails('RDKA49');
   * // result.data => {
   * //   rsvp_id: "550e8400-e29b-41d4-a716-446655440000",
   * //   event_name: "Peringatan Nuzulul Qur'an RDK 47 ITS",
   * //   fullname: "Ahmad Fauzi",
   * //   institution: "Institut Teknologi Sepuluh Nopember",
   * //   province: "Jawa Timur",
   * //   city: "Surabaya",
   * //   code: "RDKA49",
   * //   status: "registered"
   * // }
   * ```
   */
  const getRsvpDetails = useCallback(async (code: string) => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<RsvpDetailsData>>(
        `/admin/rsvp/${code}/details`,
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update RSVP status (check-in a participant)
   *
   * @param code - RSVP code (e.g., "RDKA49")
   * @param data - Status update payload (must be { status: "joined" })
   * @returns Updated RSVP confirmation with event name and fullname
   * @throws {AxiosError} 401 - Unauthorized
   * @throws {AxiosError} 404 - RSVP not found
   * @throws {AxiosError} 409 - Already checked in (status already "joined")
   * @throws {AxiosError} 422 - Invalid status value
   *
   * @example
   * ```tsx
   * const result = await updateRsvpStatus('RDKA49', { status: 'joined' });
   * // result.data => {
   * //   event_name: "Peringatan Nuzulul Qur'an RDK 47 ITS",
   * //   fullname: "Ahmad Fauzi",
   * //   code: "RDKA49"
   * // }
   * ```
   */
  const updateRsvpStatus = useCallback(
    async (code: string, data: RsvpStatusUpdateRequest) => {
      try {
        setLoading(true);
        const res = await api.patch<ApiResponse<RsvpStatusUpdateResponse>>(
          `/admin/rsvp/${code}/status`,
          data,
        );
        return res.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    getAllRsvps,
    getRsvpByCode,
    getRsvpDetails,
    updateRsvpStatus,
  };
};
