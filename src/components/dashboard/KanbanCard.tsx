
import { formatDistanceToNow } from 'date-fns';
import { Pencil, X, AlertCircle, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  createdAt?: string;
}

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}

const KanbanCard = ({ 
  task, 
  onDragStart, 
  onDragEnd, 
  onEdit, 
  onDelete,
  onTouchStart,
  onTouchEnd
}: KanbanCardProps) => {
  const priorityColors = {
    "low": "bg-green-100 text-green-700",
    "medium": "bg-amber-100 text-amber-700",
    "high": "bg-red-100 text-red-700"
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  const handleOnDragStart = (e: React.DragEvent) => {
    onDragStart(e, task.id);
  };

  return (
    <div
      id={`task-${task.id}`}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow transition-all cursor-move touch-manipulation select-none active:shadow-md group"
      draggable
      onDragStart={handleOnDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {task.priority && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${priorityColors[task.priority]}`}>
                <AlertCircle className="w-3 h-3" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}
            {task.module && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-primary bg-primary/10 rounded-full truncate max-w-[120px]">
                {task.module}
              </span>
            )}
          </div>
          
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{task.title}</h4>
          
          {task.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.createdAt && (
              <span className="text-gray-400">{formatDate(task.createdAt)}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onEdit();
            }}
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button 
            className="p-1 rounded-full hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete();
            }}
            aria-label="Delete task"
          >
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
