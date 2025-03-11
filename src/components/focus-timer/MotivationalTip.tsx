
import React from 'react';

interface MotivationalTipProps {
  isVisible: boolean;
}

const MotivationalTip: React.FC<MotivationalTipProps> = ({ isVisible }) => {
  const tips = [
    "Small progress is still progress. Ready to continue?",
    "Consistency is more powerful than occasional intensity.",
    "You're closer to your goal than you were a minute ago.",
    "Every study session adds up to build your knowledge.",
    "Your future self will thank you for getting back to work now.",
    "Remember why you started - your goals are worth it!",
    "It's not about perfect timing, it's about making time.",
    "Take a deep breath, refocus, and dive back in. You've got this!",
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded-md slide-up-enter">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {randomTip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationalTip;
