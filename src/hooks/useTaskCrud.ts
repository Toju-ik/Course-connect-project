
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";
import { Task } from "./useTasks";

export function useTaskCrud() {
  const { toast } = useToast();

  const handleCreateTask = async (taskData: Omit<Task, "id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create tasks.",
          variant: "destructive"
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          module_id: taskData.module,
          due_date: taskData.dueDate,
          priority: taskData.priority,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Format the new task for the UI
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        module: data.module_id,
        dueDate: data.due_date,
        priority: data.priority
      };
      
      toast({
        title: "Task created",
        description: "Your new task has been created successfully."
      });
      
      return newTask;
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const handleUpdateTask = async (id: string, taskData: Omit<Task, "id">) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          module_id: taskData.module,
          due_date: taskData.dueDate,
          priority: taskData.priority
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask
  };
}
