export interface FinanceReport {
  id_report: string;
  income: number;
  expenses: number;
  balance: number;
  target: number;
  created_at: string;
  updated_at: string;
}

export type CreateFinanceReportRequest = Omit<
  FinanceReport,
  'id_report' | 'created_at' | 'updated_at' | 'balance'
>;
export type UpdateFinanceReportRequest = Partial<CreateFinanceReportRequest>;
