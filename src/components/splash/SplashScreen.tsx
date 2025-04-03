
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

  // Animation variants for the letter-by-letter text reveal
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      }
    }
  };

  // Animation variants for each individual letter
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      x: -20, 
      y: 0, 
      scale: 0.5 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 12,
        stiffness: 100
      } 
    }
  };

  // The title text to animate
  const titleText = "Course Connect";

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
        {/* Letter-by-letter animation container */}
        <motion.h1 
          className="text-4xl font-bold text-white flex overflow-hidden"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Map each letter to an animated element */}
          {titleText.split("").map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className={index === 0 ? "origin-center" : ""}
              style={{ 
                display: 'inline-block',
                // First letter acts as the origin point
                transformOrigin: index === 0 ? 'center' : 'left center'
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>
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
