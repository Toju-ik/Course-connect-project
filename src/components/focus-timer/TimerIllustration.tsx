
import React from 'react';

interface TimerIllustrationProps {
  isVisible: boolean;
}

const TimerIllustration: React.FC<TimerIllustrationProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="flex flex-col items-center justify-center mt-6 mb-2">
      <img 
        src="/lovable-uploads/42c6098f-6448-4ac4-8c15-de3d53cc51c0.png" 
        alt="Time management illustration" 
        className="w-40 h-auto opacity-80"
      />
    </div>
  );
};

export default TimerIllustration;
