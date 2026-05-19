import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Stethoscope, User, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import type { Patient } from '../../types/Patient';
import type { TimeSlot } from '../../types/Appointment';

interface Doctor {
  id: number;
  username: string;
  fullName: string;
  specialization: string;
}

export const CreateAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch patients and doctors on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientsData, doctorsData] = await Promise.all([
          patientService.getAllPatients(),
          // Mock doctor fetch - replace with real API later
          new Promise<Doctor[]>((resolve) => {
            setTimeout(() => resolve([
              { id: 2, username: 'dr_smith', fullName: 'Dr. Sarah Smith', specialization: 'Cardiology' },
              { id: 3, username: 'dr_johnson', fullName: 'Dr. Michael Johnson', specialization: 'Neurology' },
            ]), 300);
          })
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch available time slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctorId, selectedDate]);

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    setSelectedTimeSlot('');
    try {
      const slots = await appointmentService.getAvailableTimeSlots(
        parseInt(selectedDoctorId),
        selectedDate
      );
      setAvailableTimeSlots(slots);
    } catch (err) {
      setError('Failed to load available time slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedPatientId || !selectedDoctorId || !selectedDate || !selectedTimeSlot) {
      setError('Please fill in all required fields');
      return;
    }

    // Parse time slot to start and end time (30-minute slots)
    const startTime = selectedTimeSlot;
    const [hours, minutes] = selectedTimeSlot.split(':');
    let endHour = parseInt(hours);
    let endMinute = parseInt(minutes) + 30;
    if (endMinute >= 60) {
      endHour++;
      endMinute -= 60;
    }
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    setLoading(true);
    try {
      await appointmentService.createAppointment({
        patientId: parseInt(selectedPatientId),
        doctorId: parseInt(selectedDoctorId),
        appointmentDate: selectedDate,
        startTime,
        endTime,
      });
      setSuccess('Appointment created successfully!');
      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        navigate('/receptionist/appointments');
      }, 1500);
    } catch (err) {
      setError('Failed to create appointment. The time slot may have been taken.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const selectedPatient = patients.find(p => p.id === parseInt(selectedPatientId));
  const selectedDoctor = doctors.find(d => d.id === parseInt(selectedDoctorId));

  if (loading && patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Appointment</h1>
        <p className="text-gray-600 mt-1">Schedule a new patient appointment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* Success/Error Messages */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Select Patient */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Patient *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!!patientId}
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {patient.phone}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedPatient && !patientId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {selectedPatient.firstName} {selectedPatient.lastName}
                  </p>
                )}
              </div>

              {/* Select Doctor */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor *
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.fullName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedDoctor && (
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedDoctor.specialization}
                  </p>
                )}
              </div>

              {/* Select Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Appointments available Monday-Friday, 9:00 AM - 5:00 PM
                </p>
              </div>

              {/* Select Time Slot */}
              {selectedDoctorId && selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot *
                  </label>
                  {loadingSlots ? (
                    <div className="text-center py-4 text-gray-500">Loading available slots...</div>
                  ) : availableTimeSlots.length === 0 ? (
                    <div className="text-center py-4 text-orange-600 bg-orange-50 rounded-lg">
                      No available time slots for this date. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.slotTime)}
                          className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                            selectedTimeSlot === slot.slotTime
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          <Clock className="w-3 h-3 inline mr-1" />
                          {slot.slotTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any symptoms, concerns, or special instructions..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading || !selectedTimeSlot || availableTimeSlots.length === 0}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Appointment...' : 'Create Appointment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Patient:</span>
                <span className="font-medium text-gray-900">
                  {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Doctor:</span>
                <span className="font-medium text-gray-900">
                  {selectedDoctor ? selectedDoctor.fullName : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium text-gray-900">
                  {selectedTimeSlot || 'Not selected'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-gray-500">
                <p>✓ 30-minute appointment slots</p>
                <p>✓ Free cancellation up to 1 hour before</p>
                <p>✓ Patient will receive confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};