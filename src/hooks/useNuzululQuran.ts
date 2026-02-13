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

  const registerParticipant = useCallback(
    async (data: NuzululQuranRegistration) => {
      try {
        setLoading(true);
        // Assuming base URL handles /api/v1 prefix if configured, or relative path works.
        // If api base is .../api/v1, then this becomes .../api/v1/nuzulul-quran/register
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
