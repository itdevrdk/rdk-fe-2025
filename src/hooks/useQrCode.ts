import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import {
  CreateQRCodeRequest,
  QRCodeDetailResponse,
  QRCodeListResponse,
  QRCodeQuery,
  UpdateQRCodeRequest,
} from '@/types/qrCode';

export const useQrCode = () => {
  const [loading, setLoading] = useState(false);

  const getAllQrCodes = useCallback(async (params?: QRCodeQuery) => {
    try {
      setLoading(true);
      const res = await api.get<QRCodeListResponse>('/admin/qr-codes', {
        params,
      });
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQrCodeById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await api.get<QRCodeDetailResponse>(`/admin/qr-codes/${id}`);
      return res.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQrCode = useCallback(async (data: CreateQRCodeRequest) => {
    try {
      setLoading(true);
      const res = await api.post<QRCodeDetailResponse>('/admin/qr-codes', data);
      return res.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQrCode = useCallback(
    async (id: string, data: UpdateQRCodeRequest) => {
      try {
        setLoading(true);
        const res = await api.put<QRCodeDetailResponse>(
          `/admin/qr-codes/${id}`,
          data,
        );
        return res.data.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteQrCode = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await api.delete<QRCodeDetailResponse>(
        `/admin/qr-codes/${id}`,
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getAllQrCodes,
    getQrCodeById,
    createQrCode,
    updateQrCode,
    deleteQrCode,
  };
};
