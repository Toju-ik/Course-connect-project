
import React from "react";
import TaskColumn from "./TaskColumn";
import TaskColumnHeader from "./TaskColumnHeader";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

interface TaskColumnWithDroppableProps {
  title: string;
  status: "todo" | "in-progress" | "completed";
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onArchive: (status: "todo" | "in-progress" | "completed") => void;
}

const TaskColumnWithDroppable: React.FC<TaskColumnWithDroppableProps> = ({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onArchive,
}) => {
  return (
    <>
      <TaskColumnHeader 
        title={title} 
        onArchive={() => onArchive(status)} 
      />
      <TaskColumn
        title={title}
        status={status}
        tasks={tasks}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
};

export default TaskColumnWithDroppable;
