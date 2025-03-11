
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const SetupComplete = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Timetable Setup Complete!</h2>
      <p className="text-gray-600 mb-8">
        Your timetable has been set up successfully. You can now access your dashboard.
      </p>
      
      <Link
        to="/dashboard"
        className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium text-center"
      >
        Go to Dashboard
      </Link>
    </motion.div>
  );
};

export default SetupComplete;
