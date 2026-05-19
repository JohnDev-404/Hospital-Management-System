import React, { useEffect, useState } from 'react';
import { Users, Stethoscope, Calendar, Clock, Activity, TrendingUp } from 'lucide-react';

interface Stats {
  totalDoctors: number;
  totalReceptionists: number;
  totalPatients: number;
  todayAppointments: number;
  waitingInQueue: number;
  avgWaitTime: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalDoctors: 0,
    totalReceptionists: 0,
    totalPatients: 0,
    todayAppointments: 0,
    waitingInQueue: 0,
    avgWaitTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call - replace with real API later
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats({
        totalDoctors: 2,
        totalReceptionists: 1,
        totalPatients: 5,
        todayAppointments: 3,
        waitingInQueue: 5,
        avgWaitTime: 12,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Receptionists',
      value: stats.totalReceptionists,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Activity,
      color: 'bg-purple-500',
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'bg-orange-500',
    },
    {
      title: 'Waiting in Queue',
      value: stats.waitingInQueue,
      icon: Clock,
      color: 'bg-red-500',
    },
    {
      title: 'Avg Wait Time (min)',
      value: stats.avgWaitTime,
      icon: TrendingUp,
      color: 'bg-indigo-500',
    },
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of hospital operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Appointments</h2>
          <div className="space-y-3">
            {[
              { patient: 'John Doe', doctor: 'Dr. Sarah Smith', time: '10:00 AM', status: 'Scheduled' },
              { patient: 'Jane Smith', doctor: 'Dr. Sarah Smith', time: '11:00 AM', status: 'Scheduled' },
              { patient: 'Robert Johnson', doctor: 'Dr. Michael Johnson', time: '2:00 PM', status: 'Scheduled' },
            ].map((apt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{apt.patient}</p>
                  <p className="text-sm text-gray-500">{apt.doctor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{apt.time}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Queue Status */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Queue Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Dr. Sarah Smith</span>
                <span>3 waiting</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Dr. Michael Johnson</span>
                <span>2 waiting</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average wait time today:</span>
              <span className="font-bold text-lg text-blue-600">12 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};