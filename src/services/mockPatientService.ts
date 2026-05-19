import type { Patient, CreatePatientRequest } from '../types/Patient';
import { mockPatients } from './mockData';

let nextId = mockPatients.length + 1;

export const mockPatientService = {
  getAllPatients: async (): Promise<Patient[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPatients];
  },
  
  getPatientById: async (id: number): Promise<Patient> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const patient = mockPatients.find(p => p.id === id);
    if (!patient) throw new Error('Patient not found');
    return { ...patient };
  },
  
  createPatient: async (patient: CreatePatientRequest): Promise<Patient> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPatient: Patient = {
      id: nextId++,
      ...patient,
      registrationDate: new Date().toISOString(),
    };
    mockPatients.push(newPatient);
    return { ...newPatient };
  },
  
  searchPatients: async (query: string): Promise<Patient[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lowerQuery = query.toLowerCase();
    return mockPatients.filter(p => 
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.phone.includes(query)
    );
  },
};