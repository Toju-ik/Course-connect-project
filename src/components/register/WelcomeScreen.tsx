
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  // Effect to clear any existing registration data when the welcome screen mounts
  useEffect(() => {
    // Clear any registration data from previous attempts
    localStorage.removeItem('registerFormData');
    console.log("WelcomeScreen mounted - registration form data cleared");
  }, []);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-4 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-6 max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
        <p className="text-gray-600">
          Welcome to Course Connect! You're about to complete a 5-step registration process to set up your profile.
        </p>
        
        <div className="flex flex-col items-center space-y-3 mt-6">
          <div className="flex space-x-4 mt-6">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className="w-2.5 h-2.5 rounded-full bg-gray-300"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">5 simple steps to complete</p>
        </div>

        <button
          onClick={onStart}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium flex items-center justify-center mt-8"
        >
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
