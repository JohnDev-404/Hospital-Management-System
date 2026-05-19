import { mockQueueService } from './mockQueueService';
import type { QueueEntry, UpdateQueuePositionRequest } from '../types/QueueEntry';

// Set this to false when backend is ready
const USE_MOCK = true;

// Real API implementation (for when backend is ready)
const realQueueService = {
  getQueue: async (doctorId?: number): Promise<QueueEntry[]> => {
    const response = await fetch(`/api/queue${doctorId ? `?doctorId=${doctorId}` : ''}`);
    return response.json();
  },
  
  addToQueue: async (patientId: number, doctorId: number, priority?: string, notes?: string): Promise<QueueEntry> => {
    const response = await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, doctorId, priority, notes }),
    });
    return response.json();
  },
  
  updateQueuePosition: async (queueId: number, newPosition: number): Promise<QueueEntry> => {
    const response = await fetch(`/api/queue/${queueId}/position`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPosition }),
    });
    return response.json();
  },
  
  callNextPatient: async (doctorId: number): Promise<QueueEntry | null> => {
    const response = await fetch(`/api/queue/doctor/${doctorId}/call-next`, {
      method: 'POST',
    });
    if (response.status === 204) return null;
    return response.json();
  },
  
  markAsCompleted: async (queueId: number, notes?: string): Promise<void> => {
    await fetch(`/api/queue/${queueId}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
  },
  
  setEmergencyPriority: async (queueId: number): Promise<QueueEntry> => {
    const response = await fetch(`/api/queue/${queueId}/emergency`, {
      method: 'PUT',
    });
    return response.json();
  },
};

// Export the appropriate service
export const queueService = USE_MOCK ? mockQueueService : realQueueService;