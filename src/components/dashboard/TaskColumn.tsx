
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

interface TaskColumnProps {
  title: string;
  status: Task["status"];
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskColumn = ({ title, status, tasks, onEdit, onDelete }: TaskColumnProps) => {
  return (
    <div className="card p-4 h-full">
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] ${snapshot.isDraggingOver ? "bg-gray-50" : ""}`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      // Ensure proper positioning during and after drag
                      position: snapshot.isDragging ? "relative" : "static"
                    }}
                    className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                  >
                    <TaskCard 
                      {...task} 
                      onEdit={() => onEdit(task)}
                      onDelete={() => onDelete(task.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-8 text-gray-500">
                <p>No tasks in this column</p>
                <p className="text-sm mt-1">Drag and drop tasks here</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
