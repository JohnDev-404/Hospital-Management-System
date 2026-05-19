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
  notes?: string;
}

export interface UpdateQueuePositionRequest {
  newPosition: number;
}