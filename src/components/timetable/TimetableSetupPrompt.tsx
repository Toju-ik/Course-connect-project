
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useTimetablePrompt } from "../../contexts/TimetablePromptContext";
import { toast } from "sonner";

interface TimetableSetupPromptProps {
  onClose: () => void;
}

const TimetableSetupPrompt = ({ onClose }: TimetableSetupPromptProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setDismissedForSession } = useTimetablePrompt();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupNow = () => {
    setIsLoading(true);
    navigate("/timetable");
    onClose();
  };

  const handleRemindLater = async () => {
    setIsLoading(true);
    
    try {
      // Set the session-level dismissal flag to true
      setDismissedForSession(true);
      console.log("Dismissed timetable setup prompt for this session");
      
      // Just close the prompt without navigating
      onClose();
      
      toast.info("You'll be reminded about timetable setup next time you log in.");
    } catch (error) {
      console.error("Error handling remind later:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-2">Welcome to StudyBuddy!</h2>
        <p className="text-gray-600 text-center mb-6">
          Would you like to set up your timetable now for a better experience?
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleSetupNow}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary-hover"
          >
            {isLoading ? "Loading..." : "Set Up Now"}
          </button>
          
          <button
            onClick={handleRemindLater}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-200"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TimetableSetupPrompt;
