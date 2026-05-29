export interface QueueEntry {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  priorityLevel: 'EMERGENCY' | 'URGENT' | 'NORMAL';
  status: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED';
  position: number;
  enteredAt: string;
  calledAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface UpdateQueuePositionRequest {
  newPosition: number;
}

export interface CreateQueueEntryRequest {
  patientId: number;
  doctorId: number;
  priorityLevel?: 'EMERGENCY' | 'URGENT' | 'NORMAL';
  notes?: string;
}

export interface CompleteQueueEntryRequest {
  notes?: string;
}

export interface QueueFilters {
  doctorId?: number;
  status?: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED';
}