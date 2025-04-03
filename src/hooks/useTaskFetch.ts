
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";
import { Task } from "./useTasks";

export function useTaskFetch() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view tasks.",
          variant: "destructive"
        });
        return;
      }
      
      // Fetch user's tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
        
      if (tasksError) {
        console.error("Error fetching tasks:", tasksError);
        toast({
          title: "Error loading tasks",
          description: tasksError.message,
          variant: "destructive"
        });
        setTasks([]);
        return;
      }
      
      // Format tasks for the UI - no default tasks
      const formattedTasks = tasksData ? tasksData.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as "todo" | "in-progress" | "completed",
        module_id: task.module_id,
        dueDate: task.due_date,
        priority: task.priority as "low" | "medium" | "high" | undefined,
        taskType: task.task_type // Include taskType from database
      })) : [];
      
      setTasks(formattedTasks);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks,
    setTasks,
    isLoading,
    refreshTasks: fetchTasks
  };
}
