
import { Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <section className="card p-6">
      <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <button 
          onClick={handleAddTask}
          className="p-4 text-left rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
          type="button"
        >
          <Plus className="w-5 h-5 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">Add New Task</h4>
          <p className="text-sm text-gray-600 mt-1">
            Create a new task or assignment
          </p>
        </button>
        <button 
          onClick={handleScheduleMeeting}
          className="p-4 text-left rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
          type="button"
        >
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <h4 className="font-medium text-gray-900">Schedule Meeting</h4>
          <p className="text-sm text-gray-600 mt-1">
            Book a study group session
          </p>
        </button>
      </div>
    </section>
  );
};

export default QuickActions;
