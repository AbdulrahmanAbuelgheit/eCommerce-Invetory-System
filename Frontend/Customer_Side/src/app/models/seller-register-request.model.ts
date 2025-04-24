import { RegisterRequest } from './register-request.model';

export interface SellerRegisterRequest extends RegisterRequest {
  companyName: string;
  companyRegistrationNumber: string;
  SSN: string;
  userType: 'seller';
} 