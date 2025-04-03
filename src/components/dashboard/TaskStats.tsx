
import React from "react";
import { Task } from "../../hooks/useTasks";
import { motion } from "framer-motion";
import { CheckCircle, Clock, CircleDashed } from "lucide-react";

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
      <motion.div 
        className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      >
        <h4 className="text-sm font-medium text-gray-500">Total Tasks</h4>
        <p className="text-2xl font-semibold text-primary mt-1">{stats.total}</p>
      </motion.div>
      
      <motion.div 
        className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-500">To Do</h4>
          <CircleDashed className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-2xl font-semibold text-blue-600 mt-1">{stats.todo}</p>
      </motion.div>
      
      <motion.div 
        className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-500">In Progress</h4>
          <Clock className="w-5 h-5 text-yellow-600" />
        </div>
        <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.inProgress}</p>
      </motion.div>
      
      <motion.div 
        className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-500">Completed</h4>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-2xl font-semibold text-green-600 mt-1">{stats.completed}</p>
      </motion.div>
    </div>
  );
};

export default TaskStats;
