import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { ApiResponse } from '@/types/api';
import { DailyInfo } from '@/types/entities/daily-info';

async function getDailyInfoToday() {
  const { data } = await api.get<ApiResponse<DailyInfo>>('/daily-info/today');
  return data;
}

export function useGetDailyInfoToday() {
  return useQuery({
    queryKey: ['daily-info', 'today'],
    queryFn: getDailyInfoToday,
  });
}
