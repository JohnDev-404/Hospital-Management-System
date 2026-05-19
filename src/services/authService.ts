// Change this line at the top:
// import { api } from './api';
import { mockAuthService } from './mockAuthService';

export const authService = mockAuthService;

// export const authService = {
//   login: async (credentials: LoginRequest): Promise<LoginResponse> => {
//     const response = await api.post('/auth/login', credentials);
//     const data = response.data;
    
//     // Store token and user in localStorage
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
    
//     return data;
//   },
  
//   logout: (): void => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   },
  
//   getCurrentUser: (): User | null => {
//     const userStr = localStorage.getItem('user');
//     if (!userStr) return null;
//     try {
//       return JSON.parse(userStr) as User;
//     } catch {
//       return null;
//     }
//   },
  
//   getToken: (): string | null => {
//     return localStorage.getItem('token');
//   },
  
//   isAuthenticated: (): boolean => {
//     return !!localStorage.getItem('token');
//   },
// };