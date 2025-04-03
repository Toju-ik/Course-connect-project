
import KanbanCard from "./KanbanCard";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module_id?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  taskType?: string;
}

interface KanbanColumnProps {
  title: string;
  count: number;
  status: "todo" | "in-progress" | "completed";
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string) => void;
  onMoveAllTasks: (status: string) => void;
  isLastColumn: boolean;
  isHighlighted: boolean;
}

const KanbanColumn = ({
  title,
  count,
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onMoveAllTasks,
  isLastColumn,
  isHighlighted
}: KanbanColumnProps) => {
  return (
    <div 
      className={`flex flex-col h-full rounded-xl ${
        isHighlighted 
          ? "border-2 border-primary/50 bg-primary/5" 
          : "border border-gray-200 bg-gray-50/80"
      } backdrop-blur-[2px] transition-all duration-200 kanban-column snap-center min-w-[85vw] md:min-w-[300px] md:w-1/3 shrink-0`}
      data-column-id={status}
    >
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">{title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto min-h-[calc(100vh-320px)] max-h-[calc(100vh-320px)]">
        <div className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <KanbanCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
                onMoveTask={onMoveTask}
                onMoveAllTasks={onMoveAllTasks}
                isLastColumn={isLastColumn}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 mt-2">
              <p>No tasks</p>
              <p className="text-xs mt-1">Add a task or move tasks here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
