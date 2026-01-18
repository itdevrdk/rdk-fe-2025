import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { ApiError, ApiResponse } from '@/types/api';
import {
  CreateFinanceReportForm,
  FinanceReport,
  FinanceReportListResponse,
  FinanceReportQuery,
  UpdateFinanceReportForm,
} from '@/types/finance';

const FINANCE_BASE_URL = '/admin/finance-reports';

// Query keys
export const financeKeys = {
  all: ['admin-finance'] as const,
  lists: () => [...financeKeys.all, 'list'] as const,
  list: (params: FinanceReportQuery) =>
    [...financeKeys.lists(), params] as const,
  latest: () => [...financeKeys.all, 'latest'] as const,
};

/**
 * Hook to fetch Finance Reports list with pagination and search
 */
export const useGetFinanceReports = (params: FinanceReportQuery) => {
  return useQuery<FinanceReportListResponse, AxiosError<ApiError>>({
    queryKey: financeKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set('page', String(params.page));
      if (params.limit) queryParams.set('limit', String(params.limit));
      if (params.search) queryParams.set('search', params.search);

      const response = await api.get<FinanceReportListResponse>(
        `${FINANCE_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch the latest finance report (public)
 */
export const useGetLatestFinanceReport = () => {
  return useQuery<FinanceReport | null, AxiosError<ApiError>>({
    queryKey: financeKeys.latest(),
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<FinanceReport>>(
          '/finance-reports/latest',
        );
        return response.data.data;
      } catch {
        return null;
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to create a new Finance Report
 */
export const useCreateFinanceReport = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<FinanceReport>,
    AxiosError<ApiError>,
    CreateFinanceReportForm
  >({
    mutationFn: async (data: CreateFinanceReportForm) => {
      const response = await api.post<ApiResponse<FinanceReport>>(
        FINANCE_BASE_URL,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financeKeys.latest() });
    },
  });
};

/**
 * Hook to update an existing Finance Report
 */
export const useUpdateFinanceReport = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<FinanceReport>,
    AxiosError<ApiError>,
    { id: string; data: UpdateFinanceReportForm }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ApiResponse<FinanceReport>>(
        `${FINANCE_BASE_URL}/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financeKeys.latest() });
    },
  });
};

/**
 * Hook to delete a Finance Report
 */
export const useDeleteFinanceReport = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<null>>(
        `${FINANCE_BASE_URL}/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financeKeys.latest() });
    },
  });
};
