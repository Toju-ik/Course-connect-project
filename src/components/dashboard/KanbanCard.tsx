
import { formatDistanceToNow } from 'date-fns';
import { Pencil, X, AlertCircle, Calendar, BookOpen, MoreVertical, ArrowRight, MoveRight, Check } from 'lucide-react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module_id?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  taskType?: string;
  createdAt?: string;
}

interface KanbanCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onMoveTask?: (taskId: string) => void;
  onMoveAllTasks?: (status: string) => void;
  isLastColumn: boolean;
}

const KanbanCard = ({ 
  task, 
  onEdit, 
  onDelete,
  onMoveTask,
  onMoveAllTasks,
  isLastColumn
}: KanbanCardProps) => {
  const priorityColors = {
    "low": "bg-green-100 text-green-700",
    "medium": "bg-amber-100 text-amber-700",
    "high": "bg-red-100 text-red-700"
  };

  const taskTypeColors = {
    "assignment": "bg-blue-100 text-blue-700",
    "project": "bg-indigo-100 text-indigo-700",
    "practical": "bg-purple-100 text-purple-700",
    "reading": "bg-teal-100 text-teal-700",
    "exam": "bg-orange-100 text-orange-700",
    "other": "bg-gray-100 text-gray-700"
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  return (
    <div
      id={`task-${task.id}`}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow transition-all select-none kanban-card"
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
            {task.taskType && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${taskTypeColors[task.taskType as keyof typeof taskTypeColors] || "bg-gray-100 text-gray-700"}`}>
                <BookOpen className="w-3 h-3" />
                {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
              </span>
            )}
            {/* We've removed the module_id display here that was showing the UUID */}
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
        
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Task options"
              >
                <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1 bg-white shadow-lg border border-gray-200 z-50" align="end">
              <div className="grid gap-1">
                {!isLastColumn && onMoveTask && (
                  <button
                    className="flex items-center w-full px-2 py-1.5 text-xs hover:bg-gray-100 rounded text-left"
                    onClick={() => onMoveTask(task.id)}
                  >
                    <ArrowRight className="mr-2 h-3.5 w-3.5" />
                    <span>Move to Next Column</span>
                  </button>
                )}
                
                {!isLastColumn && onMoveAllTasks && (
                  <button
                    className="flex items-center w-full px-2 py-1.5 text-xs hover:bg-gray-100 rounded text-left"
                    onClick={() => onMoveAllTasks(task.status)}
                  >
                    <MoveRight className="mr-2 h-3.5 w-3.5" />
                    <span>Move All in This Column</span>
                  </button>
                )}
                
                <button
                  className="flex items-center w-full px-2 py-1.5 text-xs hover:bg-gray-100 rounded text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onEdit();
                  }}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  <span>Edit Task</span>
                </button>
                
                <button
                  className="flex items-center w-full px-2 py-1.5 text-xs hover:bg-red-50 rounded text-left text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete();
                  }}
                >
                  <X className="mr-2 h-3.5 w-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
