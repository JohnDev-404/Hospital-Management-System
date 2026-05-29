import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
  
  Settings
} from 'lucide-react';

interface SystemStats {
  totalSuperAdmins: number;
  totalAdmins: number;
  totalDoctors: number;
  totalReceptionists: number;
  totalPatients: number;
  totalAppointments: number;
  activeSessions: number;
  systemUptime: string;
}

export const SuperAdminDashboard: React.FC = () => {
  const [stats, ] = useState<SystemStats>({
    totalSuperAdmins: 1,
    totalAdmins: 2,
    totalDoctors: 5,
    totalReceptionists: 3,
    totalPatients: 150,
    totalAppointments: 450,
    activeSessions: 8,
    systemUptime: '99.9%',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const statCards = [
    { title: 'Super Admins', value: stats.totalSuperAdmins, icon: Shield, color: 'bg-purple-500' },
    { title: 'Admins', value: stats.totalAdmins, icon: Shield, color: 'bg-indigo-500' },
    { title: 'Doctors', value: stats.totalDoctors, icon: Users, color: 'bg-blue-500' },
    { title: 'Receptionists', value: stats.totalReceptionists, icon: Users, color: 'bg-green-500' },
    { title: 'Total Patients', value: stats.totalPatients, icon: Activity, color: 'bg-orange-500' },
    { title: 'Appointments', value: stats.totalAppointments, icon: CheckCircle, color: 'bg-teal-500' },
    { title: 'Active Sessions', value: stats.activeSessions, icon: Clock, color: 'bg-pink-500' },
    { title: 'System Uptime', value: stats.systemUptime, icon: TrendingUp, color: 'bg-cyan-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System-wide overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent System Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New admin account created', user: 'superadmin', time: '5 minutes ago' },
              { action: 'System backup completed', user: 'system', time: '1 hour ago' },
              { action: 'New doctor registered', user: 'admin1', time: '3 hours ago' },
              { action: 'Database optimized', user: 'system', time: 'Yesterday' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">By: {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Database Health</span>
                <span className="text-green-600">98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>API Response Time</span>
                <span className="text-blue-600">124ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Storage Usage</span>
                <span className="text-orange-600">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};