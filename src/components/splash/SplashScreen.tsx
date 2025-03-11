
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
  // Add logging to verify component is rendering
  console.log('SplashScreen rendering with duration:', duration);
  
  useEffect(() => {
    console.log('SplashScreen effect triggered');
    const timer = setTimeout(() => {
      console.log('SplashScreen timeout finished, calling onFinished');
      onFinished();
    }, duration);

    return () => {
      console.log('SplashScreen cleanup');
      clearTimeout(timer);
    };
  }, [onFinished, duration]);

  return (
    <motion.div 
      className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-4"
      >
        <h1 className="text-4xl font-bold text-white">StudyBuddy</h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-64 h-64 mx-auto"
      >
        <Lottie 
          animationData={studyAnimation} 
          loop={true}
          className="w-full h-full"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-4"
      >
        <p className="text-white text-lg">Your academic companion</p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
