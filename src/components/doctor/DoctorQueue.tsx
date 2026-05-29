import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Stethoscope,
  Bell,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { queueService } from '../../services/queueService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import { useQueuePolling } from '../../hooks/useQueuePolling';
import type { QueueEntry } from '../../types/QueueEntry';
import type { Appointment } from '../../types/Appointment';

export const DoctorQueue: React.FC = () => {
  const { user } = useAuth();
  const [callingPatient, setCallingPatient] = useState(false);
  const [completingPatient, setCompletingPatient] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<QueueEntry | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [lastCalledPatient, setLastCalledPatient] = useState<QueueEntry | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  
  const doctorId = user?.id;
  const today = new Date().toISOString().split('T')[0];

  // Use the queue polling hook for real-time updates
  const { queue, loading, error, refreshQueue } = useQueuePolling(doctorId, 5000);

  // Fetch today's appointments for context
  useEffect(() => {
    if (doctorId) {
      fetchTodayAppointments();
    }
  }, [doctorId]);

  const fetchTodayAppointments = async () => {
    try {
      const appointments = await appointmentService.getAppointments(doctorId, today);
      setTodayAppointments(appointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const handleCallNextPatient = async () => {
    if (!doctorId) return;
    
    setCallingPatient(true);
    try {
      const nextPatient = await queueService.callNextPatient(doctorId);
      if (nextPatient) {
        setLastCalledPatient(nextPatient);
        setShowNotification(true);
        
        // Play sound effect (optional - browser may block)
        // new Audio('/notification.mp3').play().catch(e => console.log('Audio not supported'));
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
        
        refreshQueue();
      } else {
        alert('No patients waiting in queue.');
      }
    } catch (error) {
      console.error('Failed to call next patient:', error);
      alert('Error calling next patient. Please try again.');
    } finally {
      setCallingPatient(false);
    }
  };

  const handleCompletePatient = async () => {
    if (!selectedPatient) return;
    
    setCompletingPatient(selectedPatient.id);
    try {
      await queueService.markAsCompleted(selectedPatient.id, completionNotes);
      setShowCompleteModal(false);
      setSelectedPatient(null);
      setCompletionNotes('');
      refreshQueue();
      fetchTodayAppointments();
    } catch (error) {
      console.error('Failed to complete patient:', error);
      alert('Error completing patient. Please try again.');
    } finally {
      setCompletingPatient(null);
    }
  };

  const handleEmergencyOverride = async (queueEntry: QueueEntry) => {
    if (!confirm(`Set ${queueEntry.patientName} as EMERGENCY? This will move them to the front of the queue.`)) {
      return;
    }
    
    try {
      await queueService.setEmergencyPriority(queueEntry.id);
      refreshQueue();
    } catch (error) {
      console.error('Failed to set emergency priority:', error);
      alert('Error updating priority. Please try again.');
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'EMERGENCY':
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Emergency
            </span>
          </div>
        );
      case 'URGENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Urgent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Normal
          </span>
        );
    }
  };

  const getWaitTime = (enteredAt: string) => {
    const entered = new Date(enteredAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - entered.getTime()) / 60000);
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    }
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const waitingQueue = queue.filter(q => q.status === 'WAITING').sort((a, b) => a.position - b.position);
  const inProgressQueue = queue.filter(q => q.status === 'WITH_DOCTOR');
  const completedToday = todayAppointments.filter(a => a.status === 'COMPLETED').length;
  const totalToday = todayAppointments.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading queue...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Notification for called patient */}
      {showNotification && lastCalledPatient && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Bell className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Patient Called</h3>
                <p className="text-sm text-green-700 mt-1">
                  {lastCalledPatient.patientName} has been called to your office.
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Position #{lastCalledPatient.position} • Wait time: {getWaitTime(lastCalledPatient.enteredAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Patient Queue
          </h1>
          <p className="text-gray-600 mt-1">Manage waiting patients and call next in line</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshQueue}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCallNextPatient}
            disabled={callingPatient || waitingQueue.length === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bell className="w-4 h-4" />
            {callingPatient ? 'Calling...' : 'Call Next Patient'}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Waiting</p>
              <p className="text-3xl font-bold text-orange-600">{waitingQueue.length}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{inProgressQueue.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-3xl font-bold text-green-600">{completedToday} / {totalToday}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Wait Time</p>
              <p className="text-3xl font-bold text-purple-600">12 min</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Queue Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waiting Queue */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Waiting Patients ({waitingQueue.length})
          </h2>
          
          {waitingQueue.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No patients waiting</p>
              <p className="text-sm text-gray-400 mt-1">The queue is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitingQueue.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-lg border transition-all ${
                    entry.priorityLevel === 'EMERGENCY'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        entry.priorityLevel === 'EMERGENCY'
                          ? 'bg-red-500'
                          : entry.priorityLevel === 'URGENT'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}>
                        {entry.position}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{entry.patientName}</h3>
                          {getPriorityBadge(entry.priorityLevel)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Waiting: {getWaitTime(entry.enteredAt)}
                          </span>
                          {entry.notes && (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {entry.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {entry.priorityLevel !== 'EMERGENCY' && (
                        <button
                          onClick={() => handleEmergencyOverride(entry)}
                          className="text-red-600 hover:text-red-700 text-sm px-2 py-1"
                          title="Set as Emergency"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedPatient(entry);
                          setShowCompleteModal(true);
                        }}
                        className="text-green-600 hover:text-green-700 text-sm px-2 py-1"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* In Progress & Recently Completed */}
        <div className="space-y-6">
          {/* In Progress */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              In Consultation ({inProgressQueue.length})
            </h2>
            
            {inProgressQueue.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No patients currently in consultation</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inProgressQueue.map((entry) => (
                  <div key={entry.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{entry.patientName}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Called at: {entry.calledAt ? new Date(entry.calledAt).toLocaleTimeString() : 'Just now'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPatient(entry);
                          setShowCompleteModal(true);
                        }}
                        className="btn-primary text-sm"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats & Tips */}
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Tips</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <strong>Call Next Patient</strong> - Notifies the next patient to come in
              </p>
              <p className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <strong>Emergency Override</strong> - Moves patient to front of queue
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <strong>Complete Visit</strong> - Moves patient to completed and updates records
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's completion rate:</span>
                <span className="font-bold text-lg text-green-600">
                  {totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Visit Modal */}
      {showCompleteModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Complete Visit</h2>
              </div>
              <p className="text-gray-600 mb-2">
                Patient: <span className="font-medium">{selectedPatient.patientName}</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Position #{selectedPatient.position} • Priority: {selectedPatient.priorityLevel}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Notes (Optional)
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter diagnosis, prescription, follow-up instructions..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCompletePatient}
                  disabled={completingPatient === selectedPatient.id}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {completingPatient === selectedPatient.id ? 'Completing...' : 'Complete Visit'}
                </button>
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setSelectedPatient(null);
                    setCompletionNotes('');
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