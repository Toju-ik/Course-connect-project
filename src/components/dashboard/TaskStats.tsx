
import React from "react";
import { Task } from "../../hooks/useTasks";

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="card p-4">
        <h4 className="text-sm font-medium text-gray-500">Total Tasks</h4>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
      </div>
      <div className="card p-4">
        <h4 className="text-sm font-medium text-gray-500">To Do</h4>
        <p className="text-2xl font-semibold text-blue-600 mt-1">{stats.todo}</p>
      </div>
      <div className="card p-4">
        <h4 className="text-sm font-medium text-gray-500">In Progress</h4>
        <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.inProgress}</p>
      </div>
      <div className="card p-4">
        <h4 className="text-sm font-medium text-gray-500">Completed</h4>
        <p className="text-2xl font-semibold text-green-600 mt-1">{stats.completed}</p>
      </div>
    </div>
  );
};

export default TaskStats;
