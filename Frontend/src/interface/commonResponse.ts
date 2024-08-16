export interface APIResponse<T> {
  statusCode: number;
  errorCode: number;
  message: string;
  result: T;
  timestamp: Date;
}
