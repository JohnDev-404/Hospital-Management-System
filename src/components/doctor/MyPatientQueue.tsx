import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { queueService } from '../../services/queueService';
import type { QueueEntry } from '../../types/QueueEntry';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  UserCheck,
  AlertCircle,
  RefreshCw,
  Loader2,
  Activity
} from 'lucide-react';

export const MyPatientQueue: React.FC = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchQueue = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await queueService.getQueue(user.id);
      setQueue(data.filter(q => q.status !== 'COMPLETED'));
      setError('');
    } catch (err) {
      setError('Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Poll every 10 seconds for updates
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleCompleteConsultation = async (entry: QueueEntry) => {
    setCompletingId(entry.id);
    try {
      await queueService.markAsCompleted(entry.id, 'Consultation completed');
      await fetchQueue();
    } catch (err) {
      setError('Failed to complete consultation');
    } finally {
      setCompletingId(null);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'EMERGENCY':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Emergency</span>;
      case 'URGENT':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Urgent</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Normal</span>;
    }
  };

  const getWaitTime = (enteredAt: string) => {
    const entered = new Date(enteredAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - entered.getTime()) / 60000);
    if (diffMinutes < 60) return `${diffMinutes} min`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const waitingQueue = queue.filter(q => q.status === 'WAITING').sort((a, b) => a.position - b.position);
  const currentPatient = queue.find(q => q.status === 'WITH_DOCTOR');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Patient Queue</h1>
          <p className="text-gray-600 mt-1">Manage your patient consultations</p>
        </div>
        <button
          onClick={fetchQueue}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Current Patient Section */}
      {currentPatient && (
        <div className="card mb-6 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Current Patient</h2>
                <p className="text-2xl font-semibold text-gray-800">{currentPatient.patientName}</p>
                <div className="flex gap-2 mt-1">
                  {getPriorityBadge(currentPatient.priorityLevel)}
                  <span className="text-sm text-gray-500">Token #{currentPatient.position}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleCompleteConsultation(currentPatient)}
              disabled={completingId === currentPatient.id}
              className="btn-primary flex items-center gap-2"
            >
              {completingId === currentPatient.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Complete Consultation
            </button>
          </div>
        </div>
      )}

      {/* Waiting Queue Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Waiting Queue ({waitingQueue.length} patients)
        </h2>

        {waitingQueue.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No patients waiting</p>
            <p className="text-sm text-gray-400">The queue is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {waitingQueue.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg border transition-all ${
                  entry.priorityLevel === 'EMERGENCY'
                    ? 'bg-red-50 border-red-200'
                    : entry.priorityLevel === 'URGENT'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      entry.priorityLevel === 'EMERGENCY' ? 'bg-red-500' :
                      entry.priorityLevel === 'URGENT' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {entry.position}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{entry.patientName}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {getPriorityBadge(entry.priorityLevel)}
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Waiting: {getWaitTime(entry.enteredAt)}
                        </span>
                        {entry.notes && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {entry.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteConsultation(entry)}
                    disabled={completingId === entry.id}
                    className="btn-primary text-sm flex items-center gap-1"
                  >
                    {completingId === entry.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <UserCheck className="w-3 h-3" />
                    )}
                    Start Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Queue Statistics */}
        {waitingQueue.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Average wait time:</span>
              <span className="font-medium">
                {Math.round(waitingQueue.reduce((acc, q) => acc + parseInt(getWaitTime(q.enteredAt)), 0) / waitingQueue.length)} minutes
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};