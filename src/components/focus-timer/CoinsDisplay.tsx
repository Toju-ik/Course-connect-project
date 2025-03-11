
import React from 'react';
import { Award } from 'lucide-react';

interface CoinsDisplayProps {
  coins: number;
}

const CoinsDisplay: React.FC<CoinsDisplayProps> = ({ coins }) => {
  return (
    <div className="flex items-center mt-8 justify-center bg-amber-50 py-3 px-6 rounded-full">
      <Award className="w-5 h-5 text-amber-500 mr-2" />
      <span className="text-amber-700 font-medium">{coins} coins earned</span>
    </div>
  );
};

export default CoinsDisplay;
