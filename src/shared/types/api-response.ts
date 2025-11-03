export interface ApiResponse<T> {
  rescode: string;
  message: string;
  body: T;
}
