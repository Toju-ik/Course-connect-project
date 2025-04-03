
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
  module_id?: string; // Updated to match database column name
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  taskType?: string; // Add taskType property
}

export { type Module };

export function useTasks() {
  const { tasks, setTasks, isLoading: tasksLoading, refreshTasks } = useTaskFetch();
  const { userModules, isLoading: modulesLoading } = useUserModules();
  const { handleCreateTask, handleUpdateTask, handleDeleteTask } = useTaskCrud();
  
  const isLoading = tasksLoading || modulesLoading;

  const createTask = async (taskData: Omit<Task, "id">) => {
    console.log("[useTasks] createTask called with data:", taskData);
    try {
      const newTask = await handleCreateTask(taskData);
      console.log("[useTasks] Result from handleCreateTask:", newTask);
      
      if (newTask) {
        console.log("[useTasks] Updating tasks state with new task");
        setTasks([...tasks, newTask]);
        return newTask;
      } else {
        console.log("[useTasks] No task returned from handleCreateTask");
        return null;
      }
    } catch (error) {
      console.error("[useTasks] Error in createTask:", error);
      return null;
    }
  };

  const updateTask = async (id: string, taskData: Omit<Task, "id">) => {
    console.log("[useTasks] updateTask called with id:", id, "data:", taskData);
    const success = await handleUpdateTask(id, taskData);
    if (success) {
      setTasks(tasks.map(task => 
        task.id === id ? { ...taskData, id } : task
      ));
    }
    return success;
  };

  const deleteTask = async (id: string) => {
    console.log("[useTasks] deleteTask called with id:", id);
    const success = await handleDeleteTask(id);
    if (success) {
      setTasks(tasks.filter(task => task.id !== id));
    }
    return success;
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
