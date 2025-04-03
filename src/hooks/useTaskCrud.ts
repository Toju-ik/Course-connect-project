
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";
import { Task } from "./useTasks";
import { useGamification } from "./useGamification";

export function useTaskCrud() {
  const { toast } = useToast();
  const { awardTaskCompletionCoins, updateCoinBalance } = useGamification();

  // Helper function to ensure status values match expected values
  const normalizeStatus = (status: string): "todo" | "in-progress" | "completed" => {
    const statusMap: Record<string, "todo" | "in-progress" | "completed"> = {
      "todo": "todo",
      "to do": "todo",
      "to-do": "todo",
      "in-progress": "in-progress",
      "in progress": "in-progress",
      "inprogress": "in-progress",
      "completed": "completed",
      "complete": "completed",
      "done": "completed"
    };
    
    const normalizedStatus = statusMap[status.toLowerCase()];
    return normalizedStatus || "todo"; // Default to "todo" if unknown
  };

  // Helper function to normalize priority values
  const normalizePriority = (priority: string | undefined): "high" | "medium" | "low" => {
    if (!priority) return "medium"; // Default to medium if no priority
    
    const lowerPriority = priority.toLowerCase();
    
    if (lowerPriority === "high") return "high";
    if (lowerPriority === "low") return "low";
    
    // Default to medium for any other value
    return "medium";
  };

  const handleCreateTask = async (taskData: Omit<Task, "id">) => {
    console.log("[useTaskCrud] handleCreateTask called with data:", taskData);
    try {
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("[useTaskCrud] Auth error:", userError);
        throw userError;
      }
      
      if (!user) {
        console.error("[useTaskCrud] No authenticated user found");
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create tasks.",
          variant: "destructive"
        });
        return null;
      }
      
      console.log("[useTaskCrud] User authenticated:", user.id);
      
      // Ensure the status is normalized
      const normalizedStatus = normalizeStatus(taskData.status);
      console.log("[useTaskCrud] Normalized status:", normalizedStatus);
      
      // Create the actual insert payload with normalized priority
      const insertPayload = {
        title: taskData.title,
        description: taskData.description,
        status: normalizedStatus,
        module_id: taskData.module_id,
        due_date: taskData.dueDate,
        priority: normalizePriority(taskData.priority),
        task_type: taskData.taskType,
        user_id: user.id
      };
      
      // Log the exact payload being sent to the database
      console.log("[useTaskCrud] INSERT PAYLOAD:", JSON.stringify(insertPayload, null, 2));
      
      // Validate required fields
      if (!insertPayload.title) {
        console.error("[useTaskCrud] Missing required field: title");
        toast({
          title: "Validation Error",
          description: "Task title is required",
          variant: "destructive"
        });
        return null;
      }
      
      // Insert the task
      const { data, error } = await supabase
        .from('tasks')
        .insert(insertPayload)
        .select()
        .single();
        
      if (error) {
        console.error("[useTaskCrud] Database error:", error);
        console.error("[useTaskCrud] Error details:", error.details, error.hint, error.message);
        
        // More specific error messages
        if (error.message.includes("foreign key constraint")) {
          toast({
            title: "Database Error",
            description: "Invalid module reference",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error creating task",
            description: error.message,
            variant: "destructive"
          });
        }
        return null;
      }
      
      console.log("[useTaskCrud] Task inserted successfully:", data);
      
      // Format the new task for the UI
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: normalizedStatus,
        module_id: data.module_id,
        dueDate: data.due_date,
        // Normalize the priority from the database to ensure correct type
        priority: normalizePriority(data.priority),
        taskType: data.task_type
      };
      
      toast({
        title: "Task created",
        description: "Your new task has been created successfully."
      });
      
      return newTask;
    } catch (error: any) {
      console.error("[useTaskCrud] Error creating task:", error);
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
      // Get the current task to check if we're completing it
      const { data: currentTask, error: fetchError } = await supabase
        .from('tasks')
        .select('status')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error("[useTaskCrud] Error fetching current task:", fetchError);
      }
      
      // Ensure the status is normalized
      const normalizedStatus = normalizeStatus(taskData.status);
      // Ensure the priority is normalized
      const normalizedPriority = normalizePriority(taskData.priority);
      
      // Update the task
      const { error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          status: normalizedStatus,
          module_id: taskData.module_id,
          due_date: taskData.dueDate,
          priority: normalizedPriority,
          task_type: taskData.taskType
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Check if we just completed the task
      const wasCompleted = currentTask && currentTask.status !== 'completed' && normalizedStatus === 'completed';
      
      if (wasCompleted) {
        console.log("[useTaskCrud] Task was just marked as completed, awarding coins");
        
        // Award coins for completing a task
        awardTaskCompletionCoins()
          .then(success => {
            if (success) {
              toast({
                title: "Task completed!",
                description: "You earned 5 coins for completing this task.",
              });
              
              // Ensure the UI is updated with the new coin balance
              updateCoinBalance().then(() => {
                console.log('[useTaskCrud] Coin balance updated in UI after task completion');
              });
            }
          })
          .catch(error => {
            console.error("[useTaskCrud] Error awarding coins for task completion:", error);
          });
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
