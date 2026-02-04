import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  DashboardStats,
  DashboardStatsResponse,
  EventDistributionData,
  EventDistributionResponse,
  FundFlowData,
  FundFlowResponse,
  VisitorStatsData,
  VisitorStatsResponse,
} from '@/types/dashboard';

const DASHBOARD_BASE_URL = '/admin/dashboard';

export const dashboardKeys = {
  all: ['admin-dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  fundFlow: (range: string) =>
    [...dashboardKeys.all, 'fund-flow', range] as const,
  eventDistribution: () =>
    [...dashboardKeys.all, 'event-distribution'] as const,
  visitorStats: (range: string) =>
    [...dashboardKeys.all, 'visitor-stats', range] as const,
};

// 1. Dashboard Stats
export const useGetDashboardStats = () => {
  return useQuery<DashboardStats, AxiosError<ApiError>>({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await api.get<DashboardStatsResponse>(
        `${DASHBOARD_BASE_URL}/stats`,
      );
      return response.data.data;
    },
    staleTime: 60 * 1000,
  });
};

// 2. Fund Flow
export const useGetFundFlow = (range: '7_days' | '30_days' = '7_days') => {
  return useQuery<FundFlowData[], AxiosError<ApiError>>({
    queryKey: dashboardKeys.fundFlow(range),
    queryFn: async () => {
      const response = await api.get<FundFlowResponse>(
        `${DASHBOARD_BASE_URL}/fund-flow?range=${range}`,
      );
      return response.data.data;
    },
    staleTime: 60 * 1000,
  });
};

// 3. Event Distribution
export const useGetEventDistribution = () => {
  return useQuery<EventDistributionData[], AxiosError<ApiError>>({
    queryKey: dashboardKeys.eventDistribution(),
    queryFn: async () => {
      const response = await api.get<EventDistributionResponse>(
        `${DASHBOARD_BASE_URL}/event-distribution`,
      );
      // Ensure we always return an array
      return response.data.data || [];
    },
    staleTime: 60 * 1000,
  });
};

// 4. Visitor Stats
export const useGetVisitorStats = (range: '7_days' | '30_days' = '7_days') => {
  return useQuery<VisitorStatsData[], AxiosError<ApiError>>({
    queryKey: dashboardKeys.visitorStats(range),
    queryFn: async () => {
      const response = await api.get<VisitorStatsResponse>(
        `${DASHBOARD_BASE_URL}/visitors?range=${range}`,
      );
      return response.data.data;
    },
    staleTime: 60 * 1000,
  });
};

// 5. Track Visitor (Public Endpoint)
export const useTrackVisitor = () => {
  return useMutation({
    mutationFn: async () => {
      await api.post('/visitors/track');
    },
  });
};
