
import React from 'react';
import MobileLayout from '../components/layouts/MobileLayout';
import { useFocusTimer } from '../hooks/useFocusTimer';
import TimerControls from '../components/focus-timer/TimerControls';
import DurationSelector from '../components/focus-timer/DurationSelector';
import MotivationalTip from '../components/focus-timer/MotivationalTip';
import CoinsDisplay from '../components/focus-timer/CoinsDisplay';
import TimerIllustration from '../components/focus-timer/TimerIllustration';

const FocusTimer: React.FC = () => {
  const {
    formattedTime,
    status,
    coins,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateDuration,
  } = useFocusTimer();

  return (
    <MobileLayout title="Focus Timer">
      <div className="py-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-8">Focus Timer</h1>
            
            <div className="flex justify-center">
              <div className="w-64 h-64 flex items-center justify-center bg-primary/5 rounded-full">
                <span className="text-5xl font-bold text-gray-900">{formattedTime}</span>
              </div>
            </div>
            
            <TimerControls
              status={status}
              onStart={startTimer}
              onPause={pauseTimer}
              onResume={resumeTimer}
              onStop={stopTimer}
            />
            
            <MotivationalTip isVisible={status === 'paused'} />
            
            {/* Show illustration only when timer is idle or completed */}
            <TimerIllustration isVisible={status === 'idle' || status === 'completed'} />
            
            <DurationSelector 
              disabled={status !== 'idle'} 
              onSelectDuration={updateDuration} 
            />
            
            <CoinsDisplay coins={coins} />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default FocusTimer;
