
import { useState, useEffect } from "react";
import { useTaskFetch } from "./useTaskFetch";
import { useTaskCrud } from "./useTaskCrud";
import { useUserModules } from "./useUserModules";
import { Module } from "../types/module";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export { type Module };

export function useTasks() {
  const { tasks, setTasks, isLoading: tasksLoading, refreshTasks } = useTaskFetch();
  const { userModules, isLoading: modulesLoading } = useUserModules();
  const { handleCreateTask, handleUpdateTask, handleDeleteTask } = useTaskCrud();
  
  const isLoading = tasksLoading || modulesLoading;

  const createTask = async (taskData: Omit<Task, "id">) => {
    const newTask = await handleCreateTask(taskData);
    if (newTask) {
      setTasks([...tasks, newTask]);
    }
  };

  const updateTask = async (id: string, taskData: Omit<Task, "id">) => {
    const success = await handleUpdateTask(id, taskData);
    if (success) {
      setTasks(tasks.map(task => 
        task.id === id ? { ...taskData, id } : task
      ));
    }
  };

  const deleteTask = async (id: string) => {
    const success = await handleDeleteTask(id);
    if (success) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  return {
    tasks,
    userModules,
    isLoading,
    handleCreateTask: createTask,
    handleUpdateTask: updateTask,
    handleDeleteTask: deleteTask,
    refreshTasks
  };
}
