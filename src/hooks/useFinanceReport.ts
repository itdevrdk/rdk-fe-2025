import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { api } from '@/lib/api';

import {
  CreateFinanceReportForm,
  FinanceReport,
  UpdateFinanceReportForm,
} from '@/types/finance';

export const useFinanceReport = () => {
  const [reports, setReports] = useState<FinanceReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/finance-reports');
      setReports(response.data.data || []);
    } catch (error) {
      toast.error('Gagal mengambil data laporan');
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestReport =
    useCallback(async (): Promise<FinanceReport | null> => {
      try {
        const response = await api.get('/finance-reports/latest');
        return response.data.data;
      } catch (error) {
        return null;
      }
    }, []);

  useEffect(() => {
    // Optional: fetch on mount if needed, or leave to consumer.
    // fetchReports();
  }, []);

  const createReport = useCallback(
    async (data: CreateFinanceReportForm) => {
      await api.post('/admin/finance-reports', data);
      await fetchReports(); // Refresh list
      return true;
    },
    [fetchReports],
  );

  const updateReport = useCallback(
    async (id: string, data: UpdateFinanceReportForm) => {
      await api.put(`/admin/finance-reports/${id}`, data);
      await fetchReports(); // Refresh list
      return true;
    },
    [fetchReports],
  );

  const deleteReport = useCallback(
    async (id: string) => {
      await api.delete(`/admin/finance-reports/${id}`);
      await fetchReports(); // Refresh list
      return true;
    },
    [fetchReports],
  );

  return {
    reports,
    loading,
    fetchReports,
    getLatestReport,
    createReport,
    updateReport,
    deleteReport,
  };
};
