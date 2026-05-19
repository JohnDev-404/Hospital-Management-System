import { useState, useEffect, useCallback } from 'react';
import { queueService } from '../services/queueService';
import type { QueueEntry } from '../types/QueueEntry';

export const useQueuePolling = (doctorId?: number, intervalMs: number = 5000) => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      const data = await queueService.getQueue(doctorId);
      setQueue(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch queue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchQueue();
    
    // Poll at specified interval
    const intervalId = setInterval(fetchQueue, intervalMs);
    
    return () => clearInterval(intervalId);
  }, [fetchQueue, intervalMs]);

  const refreshQueue = fetchQueue;

  return { queue, loading, error, refreshQueue };
};