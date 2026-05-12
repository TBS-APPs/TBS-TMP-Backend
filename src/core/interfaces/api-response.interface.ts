import { ApiResponseStatus } from '../enums/api-response-status.enum';

export interface ApiResponse<T> {
  data?: T | null;
  status?: ApiResponseStatus;
  message?: string;
  httpCode?: number;
}
