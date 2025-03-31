import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';
import { useStudySessions } from './useStudySessions';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface TimerState {
  startTime: number | null;
  duration: number;
  timeLeft: number;
  status: TimerStatus;
  activeModule: string | null;
}

export const useFocusTimer = () => {
  const DEFAULT_DURATION = 25 * 60;
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [coins, setCoins] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastSaveTimeRef = useRef<number>(0);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { logTimerSession } = useStudySessions();

  useEffect(() => {
    alarmSoundRef.current = new Audio('/notification.mp3');
    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current = null;
      }
    };
  }, []);