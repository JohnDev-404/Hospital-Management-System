import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Activity,
  ArrowUp,
  ArrowDown,
  Download,
} from 'lucide-react';

interface AnalyticsData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageWaitTime: number;
  patientSatisfaction: number;
  doctorUtilization: number;
  weeklyTrend: { day: string; appointments: number }[];
  departmentStats: { department: string; count: number }[];
}

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setData({
      totalAppointments: 156,
      completedAppointments: 142,
      cancelledAppointments: 14,
      averageWaitTime: 12,
      patientSatisfaction: 94,
      doctorUtilization: 78,
      weeklyTrend: [
        { day: 'Mon', appointments: 28 },
        { day: 'Tue', appointments: 32 },
        { day: 'Wed', appointments: 35 },
        { day: 'Thu', appointments: 30 },
        { day: 'Fri', appointments: 31 },
        { day: 'Sat', appointments: 0 },
        { day: 'Sun', appointments: 0 },
      ],
      departmentStats: [
        { department: 'Cardiology', count: 45 },
        { department: 'Neurology', count: 38 },
        { department: 'Pediatrics', count: 42 },
        { department: 'Orthopedics', count: 31 },
      ],
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Hospital performance metrics and insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{data?.totalAppointments}</p>
              <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                <ArrowUp className="w-3 h-3" /> +12% from last period
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">
                {data && Math.round((data.completedAppointments / data.totalAppointments) * 100)}%
              </p>
              <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                <ArrowUp className="w-3 h-3" /> +5% improvement
              </p>
            </div>
            
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Avg. Wait Time</p>
              <p className="text-3xl font-bold text-orange-600">{data?.averageWaitTime} min</p>
              <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                <ArrowDown className="w-3 h-3" /> -3 min reduction
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Patient Satisfaction</p>
              <p className="text-3xl font-bold text-purple-600">{data?.patientSatisfaction}%</p>
              <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                <ArrowUp className="w-3 h-3" /> Excellent rating
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Appointment Trend</h3>
          <div className="space-y-3">
            {data?.weeklyTrend.map((item) => (
              <div key={item.day}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.day}</span>
                  <span>{item.appointments} appointments</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.appointments / 35) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <div className="space-y-3">
            {data?.departmentStats.map((dept) => (
              <div key={dept.department}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{dept.department}</span>
                  <span>{dept.count} patients</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(dept.count / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Utilization */}
      <div className="mt-6 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Utilization Rate</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-indigo-600 h-4 rounded-full"
                style={{ width: `${data?.doctorUtilization}%` }}
              ></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-indigo-600">{data?.doctorUtilization}%</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Overall doctor capacity utilization</p>
      </div>
    </div>
  );
};