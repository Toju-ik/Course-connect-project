import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { addStudySession } from '@/utils/studyTracker';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export const useFocusTimer = () => {
  const [duration, setDuration] = useState<number>(25 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [coins, setCoins] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('coins');
      return stored ? parseInt(stored) : 0;
    }
    return 0;
  });

  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (status === 'idle') setTimeLeft(duration);
  }, [duration, status]);

  const startTimer = () => {
    if (status !== 'idle' && status !== 'paused') return;

    setStatus('running');

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          setStatus('completed');
          const earnedCoins = Math.max(1, Math.floor(duration / 60));

          setCoins((prevCoins) => {
            const updated = prevCoins + earnedCoins;
            localStorage.setItem('coins', updated.toString());
            return updated;
          });

          if (user) {
            addStudySession(user.id, duration, earnedCoins);
          }

          toast({
            title: 'Study Session Completed!',
            description: `You earned ${earnedCoins} coins! Great job!`,
          });

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('paused');
    toast({
      title: 'Timer Paused',
      description: 'Taking a short break is okay. Remember, consistency beats intensity!',
    });
  };

  const resumeTimer = () => {
    if (status === 'paused') startTimer();
  };

  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('idle');
    setTimeLeft(duration);
  };

  const resetTimer = () => stopTimer();

  const updateDuration = (minutes: number) => {
    if (status === 'idle') {
      const newDuration = minutes * 60;
      setDuration(newDuration);
      setTimeLeft(newDuration);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    status,
    coins,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    updateDuration,
  };
};
