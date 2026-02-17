import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { ApiResponse, PaginatedApiResponse } from '@/types/api';
import {
  CreateDailyInfoRequest,
  DailyInfo,
  DailyInfoQuery,
} from '@/types/entities/daily-info';

async function getDailyInfos(params: DailyInfoQuery) {
  const { data } = await api.get<PaginatedApiResponse<DailyInfo[]>>(
    '/admin/daily-info',
    {
      params,
    },
  );
  return data;
}

export function useGetDailyInfos(params: DailyInfoQuery) {
  return useQuery({
    queryKey: ['admin', 'daily-info', params],
    queryFn: () => getDailyInfos(params),
  });
}

async function upsertDailyInfo(data: CreateDailyInfoRequest) {
  const res = await api.post<ApiResponse<null>>('/admin/daily-info', data);
  return res.data;
}

export function useUpsertDailyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertDailyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'daily-info'] });
      queryClient.invalidateQueries({ queryKey: ['daily-info', 'today'] });
    },
  });
}

async function deleteDailyInfo(date: string) {
  const res = await api.delete<ApiResponse<null>>(`/admin/daily-info/${date}`);
  return res.data;
}

export function useDeleteDailyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDailyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'daily-info'] });
      queryClient.invalidateQueries({ queryKey: ['daily-info', 'today'] });
    },
  });
}
