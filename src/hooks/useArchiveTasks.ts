
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export function useArchiveTasks(tasks: Task[], onDeleteTask: (id: string) => void) {
  const { toast } = useToast();

  const handleArchiveTasks = async (status: Task["status"]) => {
    const tasksToArchive = tasks.filter(task => task.status === status);
    
    if (tasksToArchive.length === 0) {
      toast({
        title: "No tasks to archive",
        description: `There are no tasks in the "${status}" list to archive.`
      });
      return;
    }
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to archive tasks.",
          variant: "destructive"
        });
        return;
      }
      
      for (const task of tasksToArchive) {
        // First, insert the task into archived_tasks
        const { error: archiveError } = await supabase
          .from('archived_tasks')
          .insert({
            title: task.title,
            description: task.description,
            status: task.status,
            module_id: task.module,
            due_date: task.dueDate,
            priority: task.priority,
            user_id: user.id,
            original_task_id: task.id
          });
          
        if (archiveError) {
          console.error("Error archiving task:", archiveError);
          continue;
        }
        
        // Then, delete the task from the tasks table
        onDeleteTask(task.id);
      }
      
      toast({
        title: "Tasks archived",
        description: `${tasksToArchive.length} tasks have been archived from the "${status}" list.`
      });
    } catch (error: any) {
      toast({
        title: "Error archiving tasks",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return { handleArchiveTasks };
}
