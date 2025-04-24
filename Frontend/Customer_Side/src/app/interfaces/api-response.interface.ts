// src/app/interfaces/api-response.interface.ts
export interface ApiResponse {
    success: boolean;
    message?: string;
    token?: string;
    errors?: { 
      [key: string]: string[] 
    };
  }