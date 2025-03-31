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
  useEffect(() => {
    const savedStateStr = localStorage.getItem('focusTimerState');
    if (savedStateStr) {
      try {
        const savedState: TimerState = JSON.parse(savedStateStr);
        console.log('Loading saved timer state:', savedState);

        if (savedState.status === 'running' && savedState.startTime) {
          const elapsed = Math.floor((Date.now() - savedState.startTime) / 1000);
          const remaining = savedState.duration - elapsed;

          console.log(`Timer was running. Elapsed: ${elapsed}s, Remaining: ${remaining}s`);

          if (remaining > 0) {
            setTimeLeft(remaining);
            setDuration(savedState.duration);
            setStartTime(savedState.startTime);
            startTimeRef.current = savedState.startTime;
            setStatus('running');
            setActiveModule(savedState.activeModule);
            console.log(`Resuming timer with ${remaining}s remaining. Active module:`, savedState.activeModule);
          } else {
            setTimeLeft(0);
            setStatus('completed');
            console.log('Timer completed while away');
          }
        } else if (savedState.status === 'paused') {
          console.log(`Loading paused timer with ${savedState.timeLeft}s remaining`);
          setTimeLeft(savedState.timeLeft);
          setDuration(savedState.duration);
          setStatus(savedState.status);
          setStartTime(savedState.startTime);
          startTimeRef.current = savedState.startTime;
          setActiveModule(savedState.activeModule);
        } else {
          console.log(`Loading timer in ${savedState.status} state`);
          setTimeLeft(savedState.timeLeft);
          setDuration(savedState.duration);
          setStatus(savedState.status);
          setStartTime(savedState.startTime);
          setActiveModule(savedState.activeModule);
        }
      } catch (error) {
        console.error('Error parsing focusTimerState from localStorage:', error);
      }
    } else {
      console.log('No saved timer state found, using defaults');
    }
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (now - lastSaveTimeRef.current >= 1000) {
      const timerState: TimerState = {
        startTime: startTimeRef.current,
        duration: duration,
        timeLeft: timeLeft,
        status: status,
        activeModule: activeModule,
      };

      localStorage.setItem('focusTimerState', JSON.stringify(timerState));
      lastSaveTimeRef.current = now;
    }
  }, [timeLeft, duration, status, activeModule]);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remaining = duration - elapsed;

          setTimeLeft((prev) => {
            if (remaining <= 0) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              handleTimerCompletion();
              return 0;
            }
            return remaining;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, duration]);

  const handleTimerCompletion = () => {
    console.log('Timer completed');
    setStatus('completed');

    if (alarmSoundRef.current) {
      console.log('Playing alarm sound');
      alarmSoundRef.current.play().catch(error => {
        console.error('Error playing alarm sound:', error);
      });
    }

    const earnedCoins = Math.floor(duration / 60);
    setCoins((prevCoins) => prevCoins + earnedCoins);

    toast({
      title: 'Study Session Completed!',
      description: `You earned ${earnedCoins} coins! Great job!`,
      variant: "default",
    });

    const timeInMinutes = Math.ceil(duration / 60);
    logTimerSession(timeInMinutes, activeModule)
      .then(result => {
        console.log('Study session automatically recorded:', result);
      })
      .catch(error => {
        console.error('Failed to record study session:', error);
      });
  };

  const startTimer = () => {
    if (status === 'idle' || status === 'paused') {
      const now = Date.now();

      if (status === 'idle') {
        setStartTime(now);
        startTimeRef.current = now;
        setTimeLeft(duration);
      } else if (status === 'paused') {
        const newStartTime = now - (duration - timeLeft) * 1000;
        setStartTime(newStartTime);
        startTimeRef.current = newStartTime;
      }

      setStatus('running');
      console.log(`Timer started with module: ${activeModule}, duration: ${duration}s`);
    }
  };

  const pauseTimer = () => {
    if (status === 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus('paused');
      console.log(`Timer paused with ${timeLeft}s remaining`);
      toast({
        title: 'Timer Paused',
        description: 'Taking a short break is okay. Remember, consistency beats intensity!',
      });
    }
  };

  const resumeTimer = () => {
    if (status === 'paused') {
      const now = Date.now();
      const newStartTime = now - (duration - timeLeft) * 1000;
      setStartTime(newStartTime);
      startTimeRef.current = newStartTime;
      setStatus('running');
      console.log(`Timer resumed with ${timeLeft}s remaining`);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus('idle');
    setTimeLeft(duration);
    setStartTime(null);
    startTimeRef.current = null;
    console.log('Timer stopped');
    localStorage.removeItem('focusTimerState');
  };

  const resetTimer = () => {
    stopTimer();
  };

  const updateDuration = (minutes: number) => {
    if (status === 'idle') {
      const newDuration = minutes * 60;
      setDuration(newDuration);
      setTimeLeft(newDuration);
      console.log(`Timer duration updated to ${minutes} minutes (${newDuration} seconds)`);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    status,
    coins,
    activeModule,
    setActiveModule,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    updateDuration,
  };
};
