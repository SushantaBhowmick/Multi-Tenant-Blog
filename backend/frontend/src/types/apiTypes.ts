export interface ApiError {
    success: false;
    message: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }