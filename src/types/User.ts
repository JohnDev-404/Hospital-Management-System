export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR'; 
  isActive: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}