export enum SuggestionStatus {
  NEW = 'new',
  READ = 'read',
  SOLVED = 'solved',
}

export type Suggestion = {
  suggestion_id: string;
  name: string;
  suggestion: string;
  status: SuggestionStatus;
  timestamp: string;
};

export interface Meta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface GetSuggestionsResponse {
  data: Suggestion[];
  meta: Meta;
}

export interface CreateSuggestionRequest {
  name: string;
  suggestion: string;
}

export interface UpdateStatusRequest {
  status: SuggestionStatus;
}

export interface SuggestionQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: SuggestionStatus;
}

export interface SuggestionMutationResponse {
  code: number;
  status: string;
  message: string;
  data: null;
}
