import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import studyAnimation from '../../assets/study-animation.json';

interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinished,
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinished, duration]);

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-5xl font-extrabold text-white drop-shadow-lg"
      >
        Course <span className="text-yellow-300">Connect</span>
      </motion.h1>

      {/* Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-56 h-56 mt-6"
      >
        <Lottie 
          animationData={studyAnimation} 
          loop={true}
          className="w-full h-full"
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-white text-lg mt-4 opacity-80"
      >
        Your Gateway to Academic Success!
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
