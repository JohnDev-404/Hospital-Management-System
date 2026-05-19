import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Stethoscope,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  List,
  Grid
} from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import type { Appointment } from '../../types/Appointment';

export const DoctorSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const doctorId = user?.id;

  // All time slots for timeline view (9 AM to 5 PM)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAppointments(doctorId, selectedDate);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsCompleted = async (appointment: Appointment) => {
    setUpdating(true);
    try {
      // In real backend, you would update the appointment status
      // For mock, we'll just update local state
      const updatedAppointments = appointments.map(a => 
        a.id === appointment.id ? { ...a, status: 'COMPLETED' as const } : a
      );
      setAppointments(updatedAppointments);
      setSuccessMessage('Appointment marked as completed!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update appointment:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!selectedAppointment) return;
    
    setUpdating(true);
    try {
      const updatedAppointments = appointments.map(a => 
        a.id === selectedAppointment.id ? { ...a, medicalNotes } : a
      );
      setAppointments(updatedAppointments);
      setShowNotesModal(false);
      setSelectedAppointment(null);
      setMedicalNotes('');
      setSuccessMessage('Medical notes updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update notes:', error);
    } finally {
      setUpdating(false);
    }
  };

  const openNotesModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setMedicalNotes(appointment.medicalNotes || '');
    setShowNotesModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Scheduled</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const getAppointmentForTimeSlot = (timeSlot: string) => {
    return appointments.find(a => a.startTime === timeSlot && a.status !== 'CANCELLED');
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const isPastDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate < today;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600 mt-1">View and manage your daily appointments</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Date Navigation */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-semibold text-gray-900">{formatDate(selectedDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="card overflow-hidden">
          <div className="divide-y divide-gray-200">
            {timeSlots.map((timeSlot) => {
              const appointment = getAppointmentForTimeSlot(timeSlot);
              const isBooked = !!appointment;
              const isCompleted = appointment?.status === 'COMPLETED';
              const isScheduled = appointment?.status === 'SCHEDULED';
              
              return (
                <div key={timeSlot} className={`flex ${isBooked ? 'hover:bg-gray-50' : ''} transition-colors`}>
                  {/* Time Column */}
                  <div className="w-24 sm:w-32 p-4 bg-gray-50 border-r border-gray-200">
                    <div className="font-medium text-gray-900">{formatTime(timeSlot)}</div>
                    <div className="text-xs text-gray-500">30 min</div>
                  </div>
                  
                  {/* Appointment Column */}
                  <div className="flex-1 p-4">
                    {isBooked ? (
                      <div className={`rounded-lg p-3 ${isCompleted ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-200' : 'bg-blue-200'}`}>
                              <User className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {appointment.patientName || `Patient #${appointment.patientId}`}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {getStatusBadge(appointment.status)}
                                {appointment.medicalNotes && (
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <FileText className="w-3 h-3" />
                                    Has notes
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {isScheduled && !isPastDate() && (
                              <>
                                <button
                                  onClick={() => openNotesModal(appointment)}
                                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <FileText className="w-4 h-4 inline mr-1" />
                                  Notes
                                </button>
                                <button
                                  onClick={() => handleMarkAsCompleted(appointment)}
                                  disabled={updating}
                                  className="px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <CheckCircle className="w-4 h-4 inline mr-1" />
                                  Complete
                                </button>
                              </>
                            )}
                            {isCompleted && (
                              <span className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                        {appointment.medicalNotes && (
                          <div className="mt-3 pt-2 border-t border-gray-200 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {appointment.medicalNotes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm flex items-center h-full">
                        <Clock className="w-4 h-4 mr-2" />
                        Available
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No appointments</h3>
              <p className="text-gray-500 mt-1">No appointments scheduled for this day.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {appointments
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 text-center">
                          <div className="text-lg font-bold text-gray-900">{formatTime(appointment.startTime)}</div>
                          <div className="text-xs text-gray-500">- {formatTime(appointment.endTime)}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.patientName || `Patient #${appointment.patientId}`}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {getStatusBadge(appointment.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-16 sm:ml-0">
                        {appointment.status === 'SCHEDULED' && !isPastDate() && (
                          <>
                            <button
                              onClick={() => openNotesModal(appointment)}
                              className="btn-secondary text-sm flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              Notes
                            </button>
                            <button
                              onClick={() => handleMarkAsCompleted(appointment)}
                              disabled={updating}
                              className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Mark Complete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {appointment.medicalNotes && (
                      <div className="mt-3 ml-16 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <span className="font-medium">Medical Notes:</span> {appointment.medicalNotes}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Medical Notes</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Patient: <span className="font-medium">{selectedAppointment.patientName || `Patient #${selectedAppointment.patientId}`}</span>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Notes
                </label>
                <textarea
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter diagnosis, prescription, follow-up instructions, etc..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateNotes}
                  disabled={updating}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setSelectedAppointment(null);
                    setMedicalNotes('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};