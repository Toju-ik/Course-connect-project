
import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export const useFocusTimer = () => {
  const [duration, setDuration] = useState<number>(25 * 60); // Default: 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [coins, setCoins] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Reset timer when duration changes
  useEffect(() => {
    if (status === 'idle') {
      setTimeLeft(duration);
    }
  }, [duration, status]);

  const startTimer = () => {
    if (status === 'idle' || status === 'paused') {
      setStatus('running');
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up a new interval
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(intervalRef.current!);
            setStatus('completed');
            const earnedCoins = Math.floor(duration / 60); // 1 coin per minute
            setCoins(prev => prev + earnedCoins);
            toast({
              title: "Study Session Completed!",
              description: `You earned ${earnedCoins} coins! Great job!`,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  const pauseTimer = () => {
    if (status === 'running') {
      clearInterval(intervalRef.current!);
      setStatus('paused');
      toast({
        title: "Timer Paused",
        description: "Taking a short break is okay. Remember, consistency beats intensity!",
      });
    }
  };
  
  const resumeTimer = () => {
    if (status === 'paused') {
      startTimer();
    }
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current!);
    setStatus('idle');
    setTimeLeft(duration);
  };
  
  const resetTimer = () => {
    stopTimer();
  };
  
  const updateDuration = (minutes: number) => {
    if (status === 'idle') {
      const newDuration = minutes * 60;
      setDuration(newDuration);
      setTimeLeft(newDuration);
    }
  };
  
  // Format seconds to MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
