import type { User, LoginRequest, LoginResponse } from '../types/User';

// Mock user data - make sure role matches the type
const mockUsers: User[] = [
  {
    id: 1,
    username: 'reception1',
    fullName: 'Alice Brown',
    role: 'RECEPTIONIST',  // Must match exactly 'RECEPTIONIST'
    isActive: true,
  },
  {
    id: 2,
    username: 'dr_smith',
    fullName: 'Dr. Sarah Smith',
    role: 'DOCTOR',  // Must match exactly 'DOCTOR'
    isActive: true,
  },
  {
    id: 3,
    username: 'dr_johnson',
    fullName: 'Dr. Michael Johnson',
    role: 'DOCTOR',  // Must match exactly 'DOCTOR'
    isActive: true,
  },
  {
    id: 4,
    username: 'admin1',
    fullName: 'System Administrator',
    role: 'ADMIN',  // Now this is valid because we added 'ADMIN' to the type
    isActive: true,
  },
];

// Mock tokens
const mockTokens: Record<string, string> = {
  reception1: 'mock-jwt-token-reception-12345',
  dr_smith: 'mock-jwt-token-doctor-smith-67890',
  dr_johnson: 'mock-jwt-token-doctor-johnson-11111',
  admin1: 'mock-jwt-token-admin-99999',
};

export const mockAuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user
    const user = mockUsers.find(u => u.username === credentials.username);
    
    // For demo, accept any password
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    const token = mockTokens[credentials.username];
    
    if (!token) {
      throw new Error('Invalid username or password');
    }
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};