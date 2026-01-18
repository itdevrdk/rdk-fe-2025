import { useState } from 'react';

import { api } from '@/lib/api';

import { ApiResponse, PaginatedApiResponse } from '@/types/api';
import {
  CreateShortenLinkRequest,
  ShortenLink,
  UpdateShortenLinkRequest,
} from '@/types/shortenLink';

export const useShortenLink = () => {
  const [loading, setLoading] = useState(false);

  const getShortenLinkBySlug = async (slug: string) => {
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
  };

  const getAllShortenLinks = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      setLoading(true);
      const res = await api.get<PaginatedApiResponse<ShortenLink[]>>(
        '/api/v1/admin/shorten-link',
        { params },
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const createShortenLink = async (data: CreateShortenLinkRequest) => {
    try {
      setLoading(true);
      const res = await api.post<ApiResponse<ShortenLink>>(
        '/api/v1/admin/shorten-link',
        data,
      );
      return res.data.data;
    } finally {
      setLoading(false);
    }
  };

  const updateShortenLink = async (
    id: string,
    data: UpdateShortenLinkRequest,
  ) => {
    try {
      setLoading(true);
      const res = await api.put<ApiResponse<ShortenLink>>(
        `/api/v1/admin/shorten-link/${id}`,
        data,
      );
      return res.data.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteShortenLink = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.delete<ApiResponse<null>>(
        `/api/v1/admin/shorten-link/${id}`,
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getShortenLinkBySlug,
    getAllShortenLinks,
    createShortenLink,
    updateShortenLink,
    deleteShortenLink,
  };
};
