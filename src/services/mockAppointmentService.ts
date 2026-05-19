import type { Appointment, CreateAppointmentRequest, TimeSlot } from '../types/Appointment';
import { mockAppointments, mockTimeSlots, mockPatients } from './mockData';

export const mockAppointmentService = {
  getAppointments: async (doctorId?: number, date?: string): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...mockAppointments];
    if (doctorId) filtered = filtered.filter(a => a.doctorId === doctorId);
    if (date) filtered = filtered.filter(a => a.appointmentDate === date);
    return filtered;
  },
  
  getAppointmentById: async (id: number): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const appointment = mockAppointments.find(a => a.id === id);
    if (!appointment) throw new Error('Appointment not found');
    return { ...appointment };
  },
  
  createAppointment: async (appointment: CreateAppointmentRequest): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const patient = mockPatients.find(p => p.id === appointment.patientId);
    const newAppointment: Appointment = {
      id: mockAppointments.length + 1,
      ...appointment,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
      doctorName: appointment.doctorId === 2 ? 'Dr. Sarah Smith' : 'Dr. Michael Johnson',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };
    mockAppointments.push(newAppointment);
    return { ...newAppointment };
  },
  
  cancelAppointment: async (id: number, reason?: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const appointment = mockAppointments.find(a => a.id === id);
  if (appointment) {
    appointment.status = 'CANCELLED';
    // Store reason if needed
    (appointment as any).cancellationReason = reason;
  }
},
  getAvailableTimeSlots: async (doctorId: number, date: string): Promise<TimeSlot[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Get booked slots for this doctor on this date
  const bookedSlots = mockAppointments
    .filter(a => a.doctorId === doctorId && a.appointmentDate === date && a.status === 'SCHEDULED')
    .map(a => a.startTime);
  
  // Return available slots (all slots except booked ones)
  return mockTimeSlots.filter(slot => !bookedSlots.includes(slot.slotTime));
},

  
};