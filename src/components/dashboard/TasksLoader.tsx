
import React from "react";

const TasksLoader: React.FC = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};

export default TasksLoader;
