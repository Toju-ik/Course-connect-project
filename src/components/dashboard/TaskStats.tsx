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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-indigo-500 rounded-xl p-4 shadow-md">
        <h4 className="text-sm font-medium text-white">Total Tasks</h4>
        <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
      </div>
      <div className="bg-rose-500 rounded-xl p-4 shadow-md">
        <h4 className="text-sm font-medium text-white">To Do</h4>
        <p className="text-3xl font-bold text-white mt-1">{stats.todo}</p>
      </div>
      <div className="bg-yellow-400 rounded-xl p-4 shadow-md">
        <h4 className="text-sm font-medium text-gray-900">In Progress</h4>
        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
      </div>
      <div className="bg-green-500 rounded-xl p-4 shadow-md">
        <h4 className="text-sm font-medium text-white">Completed</h4>
        <p className="text-3xl font-bold text-white mt-1">{stats.completed}</p>
      </div>
    </div>
  );
};

export default TaskStats;
