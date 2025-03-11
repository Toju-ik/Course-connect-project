
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const TasksBreadcrumb: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link to="/dashboard" className="hover:text-primary flex items-center gap-1">
        <Home className="w-4 h-4" />
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Tasks</span>
    </div>
  );
};

export default TasksBreadcrumb;
