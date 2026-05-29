import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  User, 
  Phone, 
  Calendar,
  Loader2,
  AlertCircle,
  ChevronRight,
  Users,
  ArrowLeft
} from 'lucide-react';

interface QueueStatus {
  tokenNumber: string;
  patientName: string;
  position: number;
  estimatedWaitTime: number;
  peopleAhead: number;
  doctorName: string;
  appointmentTime: string;
  status: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED';
}

export const TrackQueue: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setQueueStatus(null);
    
    // Mock API call - replace with real backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response based on token number
    if (searchQuery === '123' || searchQuery === '456' || searchQuery === '789') {
      setQueueStatus({
        tokenNumber: searchQuery,
        patientName: searchQuery === '123' ? 'John Doe' : searchQuery === '456' ? 'Jane Smith' : 'Robert Johnson',
        position: searchQuery === '123' ? 3 : searchQuery === '456' ? 1 : 5,
        estimatedWaitTime: searchQuery === '123' ? 15 : searchQuery === '456' ? 5 : 25,
        peopleAhead: searchQuery === '123' ? 2 : searchQuery === '456' ? 0 : 4,
        doctorName: searchQuery === '123' ? 'Dr. Sarah Smith' : searchQuery === '456' ? 'Dr. Michael Johnson' : 'Dr. Sarah Smith',
        appointmentTime: '10:30 AM',
        status: searchQuery === '456' ? 'WITH_DOCTOR' : 'WAITING',
      });
    } else {
      setError('No appointment found with this token number or phone number.');
    }
    
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Waiting</span>;
      case 'WITH_DOCTOR':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">With Doctor</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Track Your Queue Status</h1>
          <p className="text-gray-600 mt-2">Enter your token number or phone number to check your position</p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Token Number (e.g., 123) or Phone Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 btn-primary flex items-center justify-center gap-2 py-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track Status
            </button>
          </form>

          {/* Demo Hint */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Demo tokens: 123, 456, 789
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Queue Status Display */}
        {queueStatus && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-white font-semibold text-lg">Queue Status</h2>
              <p className="text-blue-100 text-sm">Token #{queueStatus.tokenNumber}</p>
            </div>
            
            <div className="p-6">
              {/* Position & Wait Time */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Current Position</div>
                  <div className="text-4xl font-bold text-blue-600">#{queueStatus.position}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {queueStatus.peopleAhead} {queueStatus.peopleAhead === 1 ? 'person' : 'people'} ahead
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Est. Wait Time</div>
                  <div className="text-4xl font-bold text-orange-600">{queueStatus.estimatedWaitTime} min</div>
                  <div className="text-xs text-gray-500 mt-1">Approximate</div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 w-24">Patient Name:</span>
                  <span className="font-medium text-gray-900">{queueStatus.patientName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 w-24">Doctor:</span>
                  <span className="font-medium text-gray-900">{queueStatus.doctorName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 w-24">Appointment:</span>
                  <span className="font-medium text-gray-900">{queueStatus.appointmentTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 w-24">Status:</span>
                  {getStatusBadge(queueStatus.status)}
                </div>
              </div>

              {/* Queue Progress Bar */}
              {queueStatus.status === 'WAITING' && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Queue Progress</span>
                    <span>Your turn soon!</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(0, Math.min(100, ((queueStatus.position - 1) / (queueStatus.position + queueStatus.peopleAhead)) * 100))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* With Doctor Message */}
              {queueStatus.status === 'WITH_DOCTOR' && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-green-700 font-medium">It's your turn! Please proceed to the doctor's office.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Lost your token number? Contact the reception desk with your registered phone number.
          </p>
        </div>
      </div>
    </div>
  );
};