import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';

interface Department {
  id: number;
  name: string;
  doctors: Doctor[];
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  availableSlots: string[];
}

interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

interface AppointmentConfirmation {
  tokenNumber: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  estimatedWaitTime: number;
}

export const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);
  
  // Form data
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [symptoms, setSymptoms] = useState('');
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Mock data
  useEffect(() => {
    // Mock departments and doctors
    setDepartments([
      {
        id: 1,
        name: 'Cardiology',
        doctors: [
          { id: 2, name: 'Dr. Sarah Smith', specialization: 'Cardiologist', availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        ],
      },
      {
        id: 2,
        name: 'Neurology',
        doctors: [
          { id: 3, name: 'Dr. Michael Johnson', specialization: 'Neurologist', availableSlots: ['09:30', '10:30', '13:00', '14:30', '16:00'] },
        ],
      },
      {
        id: 3,
        name: 'Pediatrics',
        doctors: [
          { id: 4, name: 'Dr. Emily Williams', specialization: 'Pediatrician', availableSlots: ['08:30', '09:30', '10:30', '13:30', '15:30'] },
        ],
      },
    ]);
  }, []);

  // Update available time slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const doctor = departments
        .flatMap(d => d.doctors)
        .find(d => d.id.toString() === selectedDoctor);
      
      if (doctor) {
        // Mock time slots
        const slots = doctor.availableSlots.map((time, index) => ({
          id: index,
          time,
          available: Math.random() > 0.3, // Mock availability
        }));
        setAvailableTimeSlots(slots);
      }
    }
  }, [selectedDoctor, selectedDate]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConfirmation({
      tokenNumber: Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      patientName,
      doctorName: departments.flatMap(d => d.doctors).find(d => d.id.toString() === selectedDoctor)?.name || '',
      date: selectedDate,
      time: selectedTime,
      estimatedWaitTime: Math.floor(Math.random() * 30) + 10,
    });
    setLoading(false);
    setStep(4);
  };

  const nextStep = () => {
    if (step === 1 && selectedDepartment && selectedDoctor && selectedDate && selectedTime) {
      setStep(2);
    } else if (step === 2 && patientName && patientPhone) {
      setStep(3);
    } else if (step === 3) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (confirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
            <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="text-sm text-gray-600 mb-1">Your Token Number</div>
              <div className="text-4xl font-bold text-blue-600 mb-4">{confirmation.tokenNumber}</div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-xs text-gray-500">Patient Name</div>
                  <div className="font-medium">{confirmation.patientName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Doctor</div>
                  <div className="font-medium">{confirmation.doctorName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="font-medium">{new Date(confirmation.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="font-medium">{confirmation.time}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">Estimated Wait Time</div>
                  <div className="font-medium text-orange-600">{confirmation.estimatedWaitTime} minutes</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/track-queue')}
                className="flex-1 btn-primary"
              >
                Track Queue Status
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 btn-secondary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to schedule your visit</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {['Select Doctor', 'Your Details', 'Confirm'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step > index + 1 ? 'bg-green-600 text-white' : step === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`ml-2 text-sm ${step === index + 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {label}
              </span>
              {index < 2 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedDoctor('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {selectedDepartment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor *</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Doctor</option>
                    {departments
                      .find(d => d.id.toString() === selectedDepartment)
                      ?.doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {selectedDoctor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date *</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Date</option>
                    {getAvailableDates().map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedDate && availableTimeSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : slot.available
                            ? 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Patient Details */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
                <textarea
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms / Reason for visit (Optional)</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please describe your symptoms..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Appointment Details</h2>
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">
                  {departments.flatMap(d => d.doctors).find(d => d.id.toString() === selectedDoctor)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">
                  {departments.find(d => d.id.toString() === selectedDepartment)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Patient:</span>
                <span className="font-medium">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{patientPhone}</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  Please arrive 15 minutes before your appointment time. Bring a valid ID and any relevant medical records.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          {step > 1 && step < 4 && (
            <button onClick={prevStep} className="btn-secondary flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {step < 3 && (
            <button
              onClick={nextStep}
              disabled={
                (step === 1 && (!selectedDoctor || !selectedDate || !selectedTime)) ||
                (step === 2 && (!patientName || !patientPhone))
              }
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === 3 && (
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Confirm Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};