import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ListOrdered, 
  LogOut,
  Stethoscope,
  UserCog,
  UserPlus,
  Activity,
  Settings
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavItems = () => {

  
if (user?.role === 'SUPER_ADMIN') {
  return [
    { path: '/superadmin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/superadmin/users', icon: Users, label: 'User Management' },
    { path: '/superadmin/system', icon: Settings, label: 'System Settings' },
  ];
}


    if (user?.role === 'ADMIN') {
      return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
        { path: '/admin/receptionists', icon: Users, label: 'Receptionists' },
        { path: '/admin/appointments', icon: Calendar, label: 'All Appointments' },
        { path: '/admin/analytics', icon: Activity, label: 'Analytics' },
      ];
    }
    
    if (user?.role === 'DOCTOR') {
      return [
        { path: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/doctor/schedule', icon: Calendar, label: 'My Schedule' },
        { path: '/doctor/queue', icon: ListOrdered, label: 'Patient Queue' },
      ];
    }
    
    // RECEPTIONIST
    return [
      { path: '/receptionist/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/receptionist/patients', icon: Users, label: 'Patients' },
      { path: '/receptionist/patients/register', icon: UserPlus, label: 'Register Patient' },
      { path: '/receptionist/appointments', icon: Calendar, label: 'Appointments' },
      { path: '/receptionist/queue', icon: ListOrdered, label: 'Queue Manager' },
    ];
  };

  const navItems = getNavItems();
  
  // Get role-specific color
  const getRoleColor = () => {
    if (user?.role === 'ADMIN') return 'text-purple-600';
    if (user?.role === 'DOCTOR') return 'text-green-600';
    return 'text-blue-600';
  };

  const getRoleBadgeColor = () => {
    if (user?.role === 'ADMIN') return 'bg-purple-100 text-purple-700';
    if (user?.role === 'DOCTOR') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Stethoscope className={`w-8 h-8 ${getRoleColor()}`} />
              <h1 className="text-2xl font-bold text-gray-900">HospitalMS</h1>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getRoleBadgeColor()}`}>
                {user?.role} Portal
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user?.role === 'ADMIN' ? 'bg-purple-100' : user?.role === 'DOCTOR' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <UserCog className={`w-5 h-5 ${
                  user?.role === 'ADMIN' ? 'text-purple-600' : user?.role === 'DOCTOR' ? 'text-green-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 truncate">{user?.fullName}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};