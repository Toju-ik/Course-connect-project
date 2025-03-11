
import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskColumnWithDroppable from "./TaskColumnWithDroppable";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

interface TaskGridProps {
  tasks: {
    todo: Task[];
    "in-progress": Task[];
    completed: Task[];
  };
  onDragEnd: (result: DropResult) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onArchive: (status: "todo" | "in-progress" | "completed") => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  onDragEnd,
  onEdit,
  onDelete,
  onArchive,
}) => {
  // Handle the drag end event and pass to parent only if we have valid destination
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    // Return if dropped outside any droppable or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Call the parent handler with the valid result
    onDragEnd(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <TaskColumnWithDroppable
            title="To Do"
            status="todo"
            tasks={tasks.todo}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
          />
        </div>

        <div className="flex flex-col gap-4">
          <TaskColumnWithDroppable
            title="In Progress"
            status="in-progress"
            tasks={tasks["in-progress"]}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
          />
        </div>

        <div className="flex flex-col gap-4">
          <TaskColumnWithDroppable
            title="Completed"
            status="completed"
            tasks={tasks.completed}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default TaskGrid;
