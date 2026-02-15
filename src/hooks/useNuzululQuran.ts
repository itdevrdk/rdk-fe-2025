import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import { ApiResponse, PaginatedApiResponse } from '@/types/api';
import {
  NuzululQuranAdminData,
  NuzululQuranCheckResponse,
  NuzululQuranQuery,
  NuzululQuranRegistration,
  NuzululQuranRegistrationResponse,
} from '@/types/nuzulul-quran';

export const useNuzululQuran = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Register a new participant for Nuzulul Quran event
   *
   * @param data - Registration data including nama_lengkap, email, jenis_kelamin, instansi
   * @returns API response with generated code and status
   * @throws {AxiosError} 409 - Duplicate registration (same email)
   * @throws {AxiosError} 422 - Validation error (missing required fields, invalid email)
   *
   * @example
   * ```tsx
   * const result = await registerParticipant({
   *   nama_lengkap: "Fatimah Zahra",
   *   email: "fatimah@example.com",
   *   jenis_kelamin: "Perempuan",
   *   instansi: "Engineering"
   * });
   * // result.data.code => "RDKB7X"
   * // result.data.status => "registered"
   * ```
   */
  const registerParticipant = useCallback(
    async (data: NuzululQuranRegistration) => {
      try {
        setLoading(true);
        const res = await api.post<
          ApiResponse<NuzululQuranRegistrationResponse>
        >('/rsvp/nuzulul-quran/register', data);
        return res.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Check Nuzulul Quran registration status by email or full name
   *
   * @param search - Email address OR full name (nama_lengkap) to search for
   * @returns Registration status and participant data if found
   * @throws {AxiosError} 400 - Missing search parameter
   * @throws {AxiosError} 404 - RSVP not found
   *
   * @example
   * ```tsx
   * // Search by email
   * const result = await checkRegistrationStatus('fatimah@example.com');
   *
   * // Search by full name
   * const result = await checkRegistrationStatus('Fatimah Zahra');
   *
   * if (result.data.is_registered) {
   *   console.log('Found:', result.data.data);
   * }
   * ```
   */
  const checkRegistrationStatus = useCallback(async (search: string) => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<NuzululQuranCheckResponse>>(
        '/rsvp/nuzulul-quran/check',
        {
          params: { search },
        },
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdminRegistrations = useCallback(
    async (params?: NuzululQuranQuery) => {
      try {
        setLoading(true);

        const res = await api.get<
          PaginatedApiResponse<NuzululQuranAdminData[]>
        >('/admin/rsvp', {
          params,
        });
        return res.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    registerParticipant,
    checkRegistrationStatus,
    getAdminRegistrations,
  };
};
