import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  CreateFinanceReportRequest,
  FinanceReport,
  UpdateFinanceReportRequest,
} from '@/types/finance';

// Initial Mock Data
const MOCK_REPORTS: FinanceReport[] = [
  {
    id_report: '550e8400-e29b-41d4-a716-446655440000',
    income: 15000000,
    expenses: 5000000,
    balance: 10000000,
    target: 50000000,
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:00:00Z',
  },
  {
    id_report: '550e8400-e29b-41d4-a716-446655440001',
    income: 20000000,
    expenses: 8000000,
    balance: 12000000,
    target: 50000000,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
];

export const useFinanceReport = () => {
  const [reports, setReports] = useState<FinanceReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setReports(MOCK_REPORTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getLatestReport = () => {
    // Since mock data is static for now, we just return the first one assuming sorted desc
    // In a real app we might fetch specifically /latest
    if (reports.length > 0) {
      return reports[0];
    }
    return null;
  };

  const createReport = async (data: CreateFinanceReportRequest) => {
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newReport: FinanceReport = {
          id_report: uuidv4(),
          income: data.income,
          expenses: data.expenses,
          target: data.target,
          balance: data.income - data.expenses,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setReports((prev) => [newReport, ...prev]);
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  const updateReport = async (id: string, data: UpdateFinanceReportRequest) => {
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setReports((prev) => {
          const index = prev.findIndex((r) => r.id_report === id);
          if (index === -1) {
            reject('Report not found');
            return prev;
          }

          const existing = prev[index];
          const updatedIncome =
            data.income !== undefined ? data.income : existing.income;
          const updatedExpenses =
            data.expenses !== undefined ? data.expenses : existing.expenses;
          const updatedTarget =
            data.target !== undefined ? data.target : existing.target;

          const updatedReport: FinanceReport = {
            ...existing,
            ...data,
            income: updatedIncome,
            expenses: updatedExpenses,
            target: updatedTarget,
            balance: updatedIncome - updatedExpenses,
            updated_at: new Date().toISOString(),
          };

          const newReports = [...prev];
          newReports[index] = updatedReport;
          return newReports;
        });
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  const deleteReport = async (id: string) => {
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setReports((prev) => prev.filter((r) => r.id_report !== id));
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  return {
    reports,
    loading,
    getLatestReport,
    createReport,
    updateReport,
    deleteReport,
  };
};
