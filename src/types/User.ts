export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR';
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR';
  email?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR';
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email: string;
  phone: string;
  role?: 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR';
}