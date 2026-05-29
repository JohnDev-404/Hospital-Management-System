import type { QueueEntry, } from '../types/QueueEntry.ts';
import { mockQueueEntries } from './mockData';

// Make a copy of mock data that we can modify
let queueEntries = [...mockQueueEntries];

// Helper to reorder positions after changes
const reorderPositions = (doctorId: number) => {
  const doctorQueue = queueEntries
    .filter(q => q.doctorId === doctorId && q.status === 'WAITING')
    .sort((a, b) => a.position - b.position);
  
  doctorQueue.forEach((entry, idx) => {
    entry.position = idx + 1;
  });
};

export const mockQueueService = {
  // Get queue for a specific doctor (or all if no doctorId)
  getQueue: async (doctorId?: number): Promise<QueueEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...queueEntries];
    if (doctorId) {
      filtered = filtered.filter(q => q.doctorId === doctorId);
    }
    
    // Sort by status (WAITING first, then WITH_DOCTOR, then COMPLETED)
    // and by position within WAITING
    return filtered.sort((a, b) => {
      const statusOrder = { WAITING: 0, WITH_DOCTOR: 1, COMPLETED: 2 };
      if (a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (a.status === 'WAITING') {
        return a.position - b.position;
      }
      return new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime();
    });
  },

  // Add patient to queue
  addToQueue: async (patientId: number, doctorId: number, priority?: string, notes?: string): Promise<QueueEntry> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the highest position for this doctor
    const doctorQueue = queueEntries.filter(q => q.doctorId === doctorId && q.status === 'WAITING');
    const maxPosition = doctorQueue.length > 0 ? Math.max(...doctorQueue.map(q => q.position)) : 0;
    
    const newEntry: QueueEntry = {
      id: queueEntries.length + 1,
      patientId,
      doctorId,
      patientName: `Patient #${patientId}`, // Will be updated by caller if needed
      doctorName: doctorId === 2 ? 'Dr. Sarah Smith' : 'Dr. Michael Johnson',
      priorityLevel: (priority?.toUpperCase() as 'EMERGENCY' | 'URGENT' | 'NORMAL') || 'NORMAL',
      status: 'WAITING',
      position: maxPosition + 1,
      enteredAt: new Date().toISOString(),
      notes: notes || '',
    };
    
    queueEntries.push(newEntry);
    return { ...newEntry };
  },

  // Update queue position (reorder)
  updateQueuePosition: async (queueId: number, newPosition: number): Promise<QueueEntry> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const entry = queueEntries.find(q => q.id === queueId);
    if (!entry) throw new Error('Queue entry not found');
    
    const oldPosition = entry.position;
    const doctorQueue = queueEntries
      .filter(q => q.doctorId === entry.doctorId && q.status === 'WAITING')
      .sort((a, b) => a.position - b.position);
    
    if (newPosition < 1) newPosition = 1;
    if (newPosition > doctorQueue.length) newPosition = doctorQueue.length;
    
    // Shift positions
    if (newPosition < oldPosition) {
      // Moving up - shift others down
      doctorQueue.forEach(q => {
        if (q.position >= newPosition && q.position < oldPosition) {
          q.position++;
        }
      });
    } else if (newPosition > oldPosition) {
      // Moving down - shift others up
      doctorQueue.forEach(q => {
        if (q.position <= newPosition && q.position > oldPosition) {
          q.position--;
        }
      });
    }
    
    entry.position = newPosition;
    reorderPositions(entry.doctorId);
    
    return { ...entry };
  },

  // Call next patient (move from WAITING to WITH_DOCTOR)
  callNextPatient: async (doctorId: number): Promise<QueueEntry | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nextPatient = queueEntries.find(
      q => q.doctorId === doctorId && q.status === 'WAITING'
    );
    
    if (nextPatient) {
      nextPatient.status = 'WITH_DOCTOR';
      nextPatient.calledAt = new Date().toISOString();
      return { ...nextPatient };
    }
    return null;
  },

  // Mark patient as completed
  markAsCompleted: async (queueId: number, notes?: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const entry = queueEntries.find(q => q.id === queueId);
    if (entry) {
      entry.status = 'COMPLETED';
      entry.completedAt = new Date().toISOString();
      if (notes) entry.notes = notes;
      reorderPositions(entry.doctorId);
    }
  },

  // Set emergency priority (moves to front of queue)
  setEmergencyPriority: async (queueId: number): Promise<QueueEntry> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const entry = queueEntries.find(q => q.id === queueId);
    if (!entry) throw new Error('Queue entry not found');
    
    entry.priorityLevel = 'EMERGENCY';
    
    // Reorder - move to position 1
    const doctorQueue = queueEntries
      .filter(q => q.doctorId === entry.doctorId && q.status === 'WAITING')
      .sort((a, b) => a.position - b.position);
    
    const currentPosition = entry.position;
    
    // Shift all patients from 1 to currentPosition down by 1
    doctorQueue.forEach(q => {
      if (q.position < currentPosition) {
        q.position++;
      }
    });
    
    entry.position = 1;
    reorderPositions(entry.doctorId);
    
    return { ...entry };
  },

  // Reset mock data (useful for testing)
  resetMockData: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    queueEntries = JSON.parse(JSON.stringify(mockQueueEntries));
  },
};