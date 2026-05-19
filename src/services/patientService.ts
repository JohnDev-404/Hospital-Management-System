import { mockPatientService } from './mockPatientService';
import type { Patient, CreatePatientRequest } from '../types/Patient';

const USE_MOCK = true;

const realPatientService = {
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await fetch('/api/patients');
    return response.json();
  },
  
  getPatientById: async (id: number): Promise<Patient> => {
    const response = await fetch(`/api/patients/${id}`);
    return response.json();
  },
  
  createPatient: async (patient: CreatePatientRequest): Promise<Patient> => {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    return response.json();
  },
  
  searchPatients: async (query: string): Promise<Patient[]> => {
    const response = await fetch(`/api/patients/search?q=${query}`);
    return response.json();
  },
};

export const patientService = USE_MOCK ? mockPatientService : realPatientService;