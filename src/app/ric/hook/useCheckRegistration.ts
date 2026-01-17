import { useCallback, useState } from 'react';

import api from '@/lib/api';

import {
  CheckRegistrationParams,
  CheckRegistrationResponse,
  RegistrationData,
} from '@/types/entities/ric';

export interface UseCheckRegistrationReturn {
  registrationData: RegistrationData | null;
  isLoading: boolean;
  error: string | null;
  isNotFound: boolean;
  checkRegistration: (params: CheckRegistrationParams) => Promise<void>;
  reset: () => void;
}

export const useCheckRegistration = (): UseCheckRegistrationReturn => {
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const checkRegistration = useCallback(
    async (params: CheckRegistrationParams) => {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);
      setRegistrationData(null);

      try {
        const response = await api.get<CheckRegistrationResponse>(
          '/v1/ric/registrations/check',
          {
            params: {
              query: params.query,
              event_type: params.event_type,
            },
          },
        );

        if (response.data.success && response.data.data) {
          setRegistrationData(response.data.data);
        } else {
          setIsNotFound(true);
        }
      } catch (err) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          'Gagal mengecek status pendaftaran. Silakan coba lagi.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setRegistrationData(null);
    setError(null);
    setIsNotFound(false);
  }, []);

  return {
    registrationData,
    isLoading,
    error,
    isNotFound,
    checkRegistration,
    reset,
  };
};
