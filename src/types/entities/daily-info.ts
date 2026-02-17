export interface DailyInfo {
  id: string;
  date: string;
  sahur_menu: string;
  iftar_menu: string;
  kajian_title: string;
  kajian_speaker: string;
  special_event: string;
  program_title: string;
}

export interface DailyInfoQuery {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export interface CreateDailyInfoRequest {
  date: string;
  sahur_menu?: string;
  iftar_menu?: string;
  kajian_title?: string;
  kajian_speaker?: string;
  special_event?: string;
  program_title?: string;
}
