
import React from 'react';
import { Play, Pause, Square, RefreshCw } from 'lucide-react';

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused' | 'completed';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  status,
  onStart,
  onPause,
  onResume,
  onStop
}) => {
  return (
    <div className="flex items-center justify-center space-x-6 mt-8">
      {status === 'idle' && (
        <button 
          onClick={onStart}
          className="flex items-center justify-center bg-primary text-white w-16 h-16 rounded-full hover:bg-primary-hover transition-colors"
          aria-label="Start timer"
        >
          <Play className="w-8 h-8" />
        </button>
      )}
      
      {status === 'running' && (
        <button 
          onClick={onPause}
          className="flex items-center justify-center bg-yellow-500 text-white w-16 h-16 rounded-full hover:bg-yellow-600 transition-colors"
          aria-label="Pause timer"
        >
          <Pause className="w-8 h-8" />
        </button>
      )}
      
      {status === 'paused' && (
        <button 
          onClick={onResume}
          className="flex items-center justify-center bg-green-500 text-white w-16 h-16 rounded-full hover:bg-green-600 transition-colors"
          aria-label="Resume timer"
        >
          <Play className="w-8 h-8" />
        </button>
      )}
      
      {(status === 'running' || status === 'paused') && (
        <button 
          onClick={onStop}
          className="flex items-center justify-center bg-red-500 text-white w-16 h-16 rounded-full hover:bg-red-600 transition-colors"
          aria-label="Stop timer"
        >
          <Square className="w-8 h-8" />
        </button>
      )}
      
      {status === 'completed' && (
        <button 
          onClick={onStart}
          className="flex items-center justify-center bg-primary text-white w-16 h-16 rounded-full hover:bg-primary-hover transition-colors"
          aria-label="Start new timer"
        >
          <RefreshCw className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default TimerControls;
