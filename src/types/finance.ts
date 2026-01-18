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
