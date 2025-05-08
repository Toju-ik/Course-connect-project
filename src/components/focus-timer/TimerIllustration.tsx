
import React from 'react';

interface TimerIllustrationProps {
  isVisible: boolean;
}

const TimerIllustration: React.FC<TimerIllustrationProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="flex flex-col items-center justify-center mt-6 mb-2">
      <img 
        src="/images/timer-placeholder.png" 
        alt="Time management illustration" 
        className="w-40 h-auto opacity-80"
      />
    </div>
  );
};

export default TimerIllustration;
