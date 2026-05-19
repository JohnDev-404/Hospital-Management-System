import { api } from './api';
import type { Appointment, CreateAppointmentRequest, TimeSlot } from '../types/Appointment';

export const appointmentService = {
  getAppointments: async (doctorId?: number, date?: string): Promise<Appointment[]> => {
    let url = '/appointments';
    const params = new URLSearchParams();
    if (doctorId) params.append('doctorId', doctorId.toString());
    if (date) params.append('date', date);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  getAppointmentById: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  createAppointment: async (appointment: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post('/appointments', appointment);
    return response.data;
  },
  
  cancelAppointment: async (id: number, reason?: string): Promise<void> => {
    await api.put(`/appointments/${id}/cancel`, { reason });
  },
  
  getAvailableTimeSlots: async (doctorId: number, date: string): Promise<TimeSlot[]> => {
    const response = await api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`);
    return response.data;
  },
};