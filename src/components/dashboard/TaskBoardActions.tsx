
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface TaskBoardActionsProps {
  onCreateTask: () => void;
}

const TaskBoardActions: React.FC<TaskBoardActionsProps> = ({ onCreateTask }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900">Task Board</h2>
      <Button 
        onClick={onCreateTask} 
        size="sm" 
        className="flex items-center gap-1"
        type="button"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Task</span>
      </Button>
    </div>
  );
};

export default TaskBoardActions;
