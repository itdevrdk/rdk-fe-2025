import { useCallback, useEffect, useState } from 'react';

import api from '@/lib/api';

export interface QuotaData {
  eventId: string; // "MHQ", "MTQ", "DAI", "KTIQ", "POSTER", "VIDEOGRAFI"
  eventName: string;
  quota: {
    registered: number;
    total: number;
  };
}

export interface QuotaResponse {
  success: boolean;
  message: string;
  error?: string;
  data: QuotaData[];
}

export interface UseQuotaReturn {
  quotaData: QuotaData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getQuotaByEventId: (eventId: string) => QuotaData['quota'] | null;
}

export const useQuota = (): UseQuotaReturn => {
  const [quotaData, setQuotaData] = useState<QuotaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<QuotaResponse>('/ric/events/quota');

      if (response.data.success) {
        setQuotaData(response.data.data);
      } else {
        setError(response.data.message || 'Gagal mengambil data kuota');
      }
    } catch (err) {
      setError('Gagal mengambil data kuota. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const getQuotaByEventId = useCallback(
    (eventId: string): QuotaData['quota'] | null => {
      const event = quotaData.find((q) => q.eventId === eventId);
      return event ? event.quota : null;
    },
    [quotaData],
  );

  return {
    quotaData,
    isLoading,
    error,
    refetch: fetchQuota,
    getQuotaByEventId,
  };
};
