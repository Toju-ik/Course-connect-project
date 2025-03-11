
import { Calendar, Pencil, Trash2, AlertCircle } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  module?: string;
  dueDate?: string;
  status: "todo" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard = ({ 
  title, 
  description, 
  module, 
  dueDate, 
  status,
  priority = "medium",
  onEdit, 
  onDelete 
}: TaskCardProps) => {
  const statusColors = {
    "todo": "bg-blue-100 text-blue-700",
    "in-progress": "bg-yellow-100 text-yellow-700",
    "completed": "bg-green-100 text-green-700"
  };

  const priorityColors = {
    "low": "bg-gray-100 text-gray-700",
    "medium": "bg-orange-100 text-orange-700",
    "high": "bg-red-100 text-red-700"
  };

  const statusText = {
    "todo": "To Do",
    "in-progress": "In Progress",
    "completed": "Completed"
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[status]}`}>
              {statusText[status]}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${priorityColors[priority]}`}>
              <AlertCircle className="w-3 h-3" />
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </span>
          </div>
          <h5 className="font-medium text-gray-900">{title}</h5>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {module && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded">
                {module}
              </span>
            )}
            {dueDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                <Calendar className="w-3 h-3" />
                {new Date(dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" 
            onClick={onEdit}
            title="Edit task"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
          <button 
            className="p-1.5 hover:bg-red-50 rounded-full transition-colors" 
            onClick={onDelete}
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
