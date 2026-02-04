export interface DashboardStats {
  fund_target_percentage: number;
  fund_target_value: number;
  total_participants: number;
  total_visitors_weekly: number;
  visitors_trend: 'up' | 'down' | 'neutral';
  visitors_trend_value: number;
}

export interface FundFlowData {
  date: string;
  total_income: number;
  total_expenses: number;
}

export interface EventDistributionData {
  event_type: string;
  count: number;
}

export interface VisitorStatsData {
  date: string;
  visitors: number;
}

// Responses
export interface DashboardStatsResponse {
  status: boolean;
  message: string;
  data: DashboardStats;
}

export interface FundFlowResponse {
  status: boolean;
  message: string;
  data: FundFlowData[];
}

export interface EventDistributionResponse {
  status: boolean;
  message: string;
  data: EventDistributionData[];
}

export interface VisitorStatsResponse {
  status: boolean;
  message: string;
  data: VisitorStatsData[];
}
