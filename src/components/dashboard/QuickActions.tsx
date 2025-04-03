
import { Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const QuickActions = () => {
  const navigate = useNavigate();

  const handleAddTask = () => {
    // This would open the add task dialog in the future
    console.log("Add task clicked");
  };

  const handleScheduleMeeting = () => {
    // Navigate to timetable page
    console.log("Navigating to timetable from QuickActions");
    navigate("/timetable");
  };

  return (
    <section className="rounded-lg p-6 gradient-accent shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-6 text-primary">Quick Actions</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.button 
          onClick={handleAddTask}
          className="p-4 text-left rounded-lg bg-white shadow-sm border border-gray-200 hover:border-primary/50 transition-colors"
          type="button"
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ y: 0 }}
        >
          <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-medium text-gray-900">Add New Task</h4>
          <p className="text-sm text-gray-600 mt-1">
            Create a new task or assignment
          </p>
        </motion.button>
        <motion.button 
          onClick={handleScheduleMeeting}
          className="p-4 text-left rounded-lg bg-white shadow-sm border border-gray-200 hover:border-primary/50 transition-colors"
          type="button"
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ y: 0 }}
        >
          <div className="rounded-full bg-green-100 w-10 h-10 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900">Schedule Meeting</h4>
          <p className="text-sm text-gray-600 mt-1">
            Book a study group session
          </p>
        </motion.button>
      </div>
    </section>
  );
};

export default QuickActions;
