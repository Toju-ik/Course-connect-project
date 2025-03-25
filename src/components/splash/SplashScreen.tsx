import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import studyAnimation from "../../assets/study-animation.json";

interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished, duration = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinished, duration]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Course Connect Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-5xl font-extrabold text-primary drop-shadow-md"
      >
        Course Connect
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl text-gray-700 mt-2"
      >
        The Smart Student Companion for{" "}
        <span className="text-primary">TU Dublin</span>
      </motion.h2>

      {/* Lottie Animation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-56 h-56 mt-6"
      >
        <Lottie animationData={studyAnimation} loop className="w-full h-full" />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-gray-600 text-lg mt-6"
      >
        Loading your experience...
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
