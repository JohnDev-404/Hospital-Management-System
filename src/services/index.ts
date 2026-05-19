// Set this to false when backend is ready
export const USE_MOCK = true;

// Export all services
export { authService } from './authService';
export { patientService } from './patientService';
export { appointmentService } from './appointmentService';
export { queueService } from './queueService';

// Re-export types
export * from '../types/User';
export * from '../types/Patient';
export * from '../types/Appointment';
export * from '../types/QueueEntry';