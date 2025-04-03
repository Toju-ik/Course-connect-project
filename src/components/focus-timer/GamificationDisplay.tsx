
import React from 'react';
import { Award, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface GamificationDisplayProps {
  coins: number;
  streak: number;
}

const GamificationDisplay: React.FC<GamificationDisplayProps> = ({ coins, streak }) => {
  return (
    <div className="flex justify-between items-center space-x-4 bg-gray-50 p-3 rounded-xl shadow-sm">
      <motion.div 
        className="flex items-center text-amber-700 bg-amber-50 px-4 py-2 rounded-lg"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Award className="w-5 h-5 text-amber-500 mr-2" />
        <div>
          <div className="font-semibold text-lg">{coins}</div>
          <div className="text-xs">Coins</div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex items-center text-orange-700 bg-orange-50 px-4 py-2 rounded-lg"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Flame className="w-5 h-5 text-orange-500 mr-2" />
        <div>
          <div className="font-semibold text-lg">{streak}</div>
          <div className="text-xs">{streak === 1 ? 'Day' : 'Days'}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamificationDisplay;
