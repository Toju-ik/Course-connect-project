import React from 'react';
import MobileLayout from '../components/layouts/MobileLayout';
import { useFocusTimer } from '../hooks/useFocusTimer';
import TimerControls from '../components/focus-timer/TimerControls';
import DurationSelector from '../components/focus-timer/DurationSelector';
import MotivationalTip from '../components/focus-timer/MotivationalTip';
import CoinsDisplay from '../components/focus-timer/CoinsDisplay';
import TimerIllustration from '../components/focus-timer/TimerIllustration';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <div className="py-6">
        <div className="max-w-2xl mx-auto space-y-6 px-3">
          <Card className="rounded-3xl shadow-lg bg-gradient-to-br from-indigo-50 via-white to-indigo-100 border border-indigo-100">
            <CardContent className="py-8 px-6 space-y-8 flex flex-col items-center text-center">
              <h1 className="text-3xl font-bold text-indigo-800">Focus Timer</h1>

              <div className="w-64 h-64 rounded-full bg-white border-8 border-indigo-300 shadow-inner flex items-center justify-center">
                <span className="text-5xl font-bold text-indigo-800">{formattedTime}</span>
              </div>

              <TimerControls
                status={status}
                onStart={startTimer}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onStop={stopTimer}
              />

              <MotivationalTip isVisible={status === 'paused'} />

              <TimerIllustration isVisible={status === 'idle' || status === 'completed'} />

              <DurationSelector
                disabled={status !== 'idle'}
                onSelectDuration={updateDuration}
              />

              <CoinsDisplay coins={coins} />
            </CardContent>
          </Card>

          {status === 'completed' && (
            <div className="text-center animate-fade-in">
              <Badge className="text-sm bg-green-100 text-green-800 px-4 py-1 rounded-full shadow">
                🎉 Well done! You completed your session.
              </Badge>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default FocusTimer;
