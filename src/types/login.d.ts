import { ApiResponse } from '@/types/api';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = ApiResponse<{
  access_token: string;
  refresh_token: string;
  role: string;
}>;
