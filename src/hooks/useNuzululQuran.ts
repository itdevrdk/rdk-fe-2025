import { useCallback } from 'react';

import { useRsvp } from './useRsvp';

import { GenericRsvpRequest } from '@/types/rsvp';

export const useNuzululQuran = () => {
  const { registerEvent, checkEventStatus, loading: rsvpLoading } = useRsvp();

  /**
   * Register a new participant for Nuzulul Quran event
   * Delegates to generic RSVP system with slug 'nuzulul-quran'
   */
  const registerParticipant = useCallback(
    async (data: GenericRsvpRequest) => {
      // Field names in NuzululQuranRegistration match GenericRsvpRequest exactly
      return registerEvent('nuzulul-quran', data);
    },
    [registerEvent],
  );

  /**
   * Check Nuzulul Quran registration status
   * Delegates to generic RSVP system
   */
  const checkRegistrationStatus = useCallback(
    async (search: string) => {
      return checkEventStatus('nuzulul-quran', search);
    },
    [checkEventStatus],
  );

  return {
    loading: rsvpLoading,
    registerParticipant,
    checkRegistrationStatus,
  };
};
