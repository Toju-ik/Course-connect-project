
import { Archive } from "lucide-react";
import React from "react";

interface TaskColumnHeaderProps {
  title: string;
  onArchive: () => void;
}

const TaskColumnHeader: React.FC<TaskColumnHeaderProps> = ({ title, onArchive }) => {
  return (
    <div className="flex items-center justify-between">
      <h4 className="font-medium text-gray-700">{title}</h4>
      <button
        onClick={onArchive}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <Archive className="w-3 h-3 mr-1" />
        Archive All
      </button>
    </div>
  );
};

export default TaskColumnHeader;
