import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Activity,
  ArrowRight,
  UserCheck,
  Timer,
  Stethoscope
} from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { queueService } from '../../services/queueService';
import type { Appointment } from '../../types/Appointment';
import type { QueueEntry } from '../../types/QueueEntry';
import { useAuth } from '../../hooks/useAuth';

interface DashboardStats {
  todayAppointments: number;
  completedToday: number;
  waitingInQueue: number;
  averageWaitTime: number;
}

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    completedToday: 0,
    waitingInQueue: 0,
    averageWaitTime: 12,
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];
  const doctorId = user?.id;

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchDashboardData();
    }
  }, [doctorId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch today's appointments
      const appointmentsData = await appointmentService.getAppointments(doctorId, today);
      setAppointments(appointmentsData);
      
      // Fetch queue
      const queueData = await queueService.getQueue(doctorId);
      setQueue(queueData.filter(q => q.status === 'WAITING'));
      
      // Calculate stats
      const completed = appointmentsData.filter(a => a.status === 'COMPLETED').length;
      const waiting = queueData.filter(q => q.status === 'WAITING').length;
      
      setStats({
        todayAppointments: appointmentsData.length,
        completedToday: completed,
        waitingInQueue: waiting,
        averageWaitTime: 12, // Mock - calculate from actual data in real backend
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const statCards = [
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: stats.completedToday,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Waiting in Queue',
      value: stats.waitingInQueue,
      icon: Users,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Avg Wait Time',
      value: `${stats.averageWaitTime} min`,
      icon: Timer,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const upcomingAppointments = appointments
    .filter(a => a.status === 'SCHEDULED')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 5);

  const queueList = queue.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Doctor'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your schedule today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="text-lg font-semibold text-gray-700">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today's Schedule
            </h2>
            <button
              onClick={() => navigate('/doctor/schedule')}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/doctor/schedule`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <div className="text-lg font-bold text-gray-900">{formatTime(appointment.startTime)}</div>
                      <div className="text-xs text-gray-500">- {formatTime(appointment.endTime)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.patientName || `Patient #${appointment.patientId}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.medicalNotes ? `Note: ${appointment.medicalNotes.substring(0, 30)}...` : 'No notes'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Queue */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Patient Queue
            </h2>
            <button
              onClick={() => navigate('/doctor/queue')}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              Manage Queue
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {queueList.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No patients waiting in queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queueList.map((entry
              ) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      entry.priorityLevel === 'EMERGENCY' ? 'bg-red-500' :
                      entry.priorityLevel === 'URGENT' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {entry.position}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {entry.patientName || `Patient #${entry.patientId}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.priorityLevel === 'EMERGENCY' ? '🚨 Emergency' :
                         entry.priorityLevel === 'URGENT' ? '⚠️ Urgent' : 'Normal'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/doctor/queue')}
                    className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                  >
                    <UserCheck className="w-3 h-3" />
                    Call Next
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Action Buttons */}
          {queueList.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => navigate('/doctor/queue')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                Go to Queue Management
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Today's Summary Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            Today's Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Completed Appointments</p>
              <p className="text-2xl font-bold text-green-700">{stats.completedToday} / {stats.todayAppointments}</p>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.todayAppointments ? (stats.completedToday / stats.todayAppointments) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600">Queue Status</p>
              <p className="text-2xl font-bold text-orange-700">{stats.waitingInQueue} waiting</p>
              <p className="text-xs text-orange-600 mt-1">Estimated wait: ~{stats.averageWaitTime * stats.waitingInQueue} min</p>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Tip</h2>
          <p className="text-gray-600 text-sm">
            Use the Queue Management page to call next patient, mark visits as complete, and manage your patient flow efficiently.
          </p>
          <button
            onClick={() => navigate('/doctor/queue')}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            Go to Queue
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};