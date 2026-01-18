import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import { ApiResponse } from '@/types/api';
import {
  CreateShortenLinkRequest,
  ShortenLink,
  ShortenLinkListResponse,
  ShortenLinkQuery,
  UpdateShortenLinkRequest,
} from '@/types/shortenLink';

export const useShortenLink = () => {
  const [loading, setLoading] = useState(false);

  const getShortenLinkBySlug = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<ShortenLink>>(
        `/public/shorten-link/${slug}`,
      );
      return res.data.data;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllShortenLinks = useCallback(async (params?: ShortenLinkQuery) => {
    try {
      setLoading(true);
      const res = await api.get<ShortenLinkListResponse>(
        '/admin/shorten-link',
        { params },
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createShortenLink = useCallback(
    async (data: CreateShortenLinkRequest) => {
      try {
        setLoading(true);
        const res = await api.post<ApiResponse<ShortenLink>>(
          '/admin/shorten-link',
          data,
        );
        return res.data.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateShortenLink = useCallback(
    async (id: string, data: UpdateShortenLinkRequest) => {
      try {
        setLoading(true);
        const res = await api.put<ApiResponse<ShortenLink>>(
          `/admin/shorten-link/${id}`,
          data,
        );
        return res.data.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteShortenLink = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await api.delete<ApiResponse<null>>(
        `/admin/shorten-link/${id}`,
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getShortenLinkBySlug,
    getAllShortenLinks,
    createShortenLink,
    updateShortenLink,
    deleteShortenLink,
  };
};
