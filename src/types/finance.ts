export interface FinanceReport {
  id_report: string; // UUID
  income: number; // IDR
  expenses: number; // IDR
  balance: number; // Calculated server-side (Income - Expenses)
  target: number; // IDR
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
}

export interface CreateFinanceReportForm {
  income: number;
  expenses: number;
  target: number;
}

export interface UpdateFinanceReportForm {
  income?: number;
  expenses?: number;
  target?: number;
}

// Pagination types
export interface FinanceReportMeta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface FinanceReportQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FinanceReportListResponse {
  status: boolean;
  message: string;
  data: FinanceReport[];
  meta: FinanceReportMeta;
}
