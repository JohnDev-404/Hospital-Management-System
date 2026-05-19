import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuthService as authService } from '../services/mockAuthService';
import { Stethoscope, LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ username, password });
      
      // Redirect based on role - now ADMIN is recognized
      if (response.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (response.user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (response.user.role === 'RECEPTIONIST') {
        navigate('/receptionist/dashboard');
      } else {
        // Fallback
        navigate('/receptionist/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = [
    { role: 'Admin', username: 'admin1', password: 'anything' },
    { role: 'Receptionist', username: 'reception1', password: 'anything' },
    { role: 'Doctor', username: 'dr_smith', password: 'anything' },
    { role: 'Doctor', username: 'dr_johnson', password: 'anything' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Management System</h1>
          <p className="text-gray-600 mt-2">Queue & Appointment System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center mb-3">Demo Credentials (any password works):</p>
            <div className="space-y-2">
              {demoCredentials.map((cred) => (
                <div 
                  key={cred.role + cred.username}
                  className="text-sm bg-gray-50 p-2 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setUsername(cred.username);
                    setPassword('anything');
                  }}
                >
                  <span className="font-medium text-gray-700">{cred.role}:</span>
                  <span className="text-gray-600">
                    {cred.username} / <span className="text-gray-400">any password</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Click on any credential to auto-fill
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};