export interface RamadanEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO String
  end_date?: string | null; // ISO String
}

export interface CreateEventRequest {
  title: string;
  description: string;
  location: string;
  date: string;
  end_date?: string;
}

export interface UpdateEventRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  end_date?: string;
}

export interface EventQuery {
  year?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface MetaPagination {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface RamadanEventsResponse {
  data: {
    data: RamadanEvent[];
    meta: MetaPagination;
  };
  code: number;
  status: string;
}
