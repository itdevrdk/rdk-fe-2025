export interface FinanceReport {
  id_report: string; // UUID
  income: number; // IDR
  expenses: number; // IDR
  balance: number; // Calculated server-side (Income - Expenses)
  target: number; // IDR
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
  date?: string;
}

export interface CreateFinanceReportForm {
  income: number;
  expenses: number;
  target: number;
  date: string;
}

export interface UpdateFinanceReportForm {
  income?: number;
  expenses?: number;
  target?: number;
  date?: string;
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

// Finance Report Summary (Aggregated data for landing page)
export interface FinanceReportSummary {
  total_income: number; // Sum of all income records
  total_expenses: number; // Sum of all expenses records
  balance: number; // total_income - total_expenses
  target: number; // Target from latest record
}

export interface FinanceReportSummaryResponse {
  status: boolean;
  message: string;
  data: FinanceReportSummary;
}

// Finance Report Details (For Report Page with Charts)
export interface FinanceChartData {
  name: string;
  value: number;
}

export interface FinanceCategoryDetails {
  total: number;
  last_updated: string;
  history: FinanceChartData[];
}

export interface FinanceReportDetails {
  total_balance: number;
  income: FinanceCategoryDetails;
  expense: FinanceCategoryDetails;
}

export interface FinanceReportDetailsResponse {
  code: number;
  status: boolean;
  message: string;
  data: FinanceReportDetails;
}
