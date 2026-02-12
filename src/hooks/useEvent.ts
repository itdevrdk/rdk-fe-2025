import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import { ApiResponse } from '@/types/api';
import {
  CreateEventRequest,
  EventQuery,
  RamadanEvent,
  RamadanEventsResponse,
  UpdateEventRequest,
} from '@/types/event';

export const useEvent = () => {
  const [loading, setLoading] = useState(false);

  const getEvents = useCallback(async (params?: EventQuery) => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<RamadanEvent[]>>(
        '/ramadan-events',
        {
          params,
        },
      );
      return res.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdminEvents = useCallback(async (params?: EventQuery) => {
    try {
      setLoading(true);
      const res = await api.get<RamadanEventsResponse>(
        '/admin/ramadan-events',
        {
          params,
        },
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (data: CreateEventRequest) => {
    try {
      setLoading(true);
      const res = await api.post<ApiResponse<RamadanEvent>>(
        '/admin/ramadan-events',
        data,
      );
      return res.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(
    async (id: string, data: UpdateEventRequest) => {
      try {
        setLoading(true);
        const res = await api.put<ApiResponse<RamadanEvent>>(
          `/admin/ramadan-events/${id}`,
          data,
        );
        return res.data.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteEvent = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await api.delete<ApiResponse<null>>(
        `/admin/ramadan-events/${id}`,
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getEvents,
    getAdminEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
