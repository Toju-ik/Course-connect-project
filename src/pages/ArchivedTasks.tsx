
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Archive, Trash2, Undo } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { supabase } from "../lib/supabase";
import { useToast } from "../hooks/use-toast";

interface ArchivedTask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  archived_at: string;
}

const ArchivedTasks = () => {
  const [archivedTasks, setArchivedTasks] = useState<ArchivedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const fetchArchivedTasks = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view archived tasks.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("archived_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("archived_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match the expected interface
      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        module: task.module_id,
        dueDate: task.due_date,
        priority: task.priority,
        archived_at: task.archived_at
      }));

      setArchivedTasks(formattedTasks);
    } catch (error: any) {
      toast({
        title: "Error fetching archived tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchiveTask = async (taskId: string) => {
    try {
      // Get the task data
      const { data: taskData, error: fetchError } = await supabase
        .from("archived_tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (fetchError) throw fetchError;

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to unarchive tasks.",
          variant: "destructive"
        });
        return;
      }

      // Insert back into the tasks table
      const { error: insertError } = await supabase
        .from("tasks")
        .insert({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          module_id: taskData.module_id,
          due_date: taskData.due_date,
          priority: taskData.priority,
          user_id: user.id
        });

      if (insertError) throw insertError;

      // Delete from archived_tasks
      const { error: deleteError } = await supabase
        .from("archived_tasks")
        .delete()
        .eq("id", taskId);

      if (deleteError) throw deleteError;

      // Update UI
      setArchivedTasks(archivedTasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task unarchived",
        description: "The task has been restored to your active tasks."
      });
    } catch (error: any) {
      toast({
        title: "Error unarchiving task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("archived_tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      // Update UI
      setArchivedTasks(archivedTasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "The task has been permanently deleted."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container-pad py-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/dashboard" className="hover:text-primary flex items-center gap-1">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Archived Tasks</span>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Archive className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Archived Tasks</h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : archivedTasks.length === 0 ? (
              <div className="p-8 text-center">
                <Archive className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No archived tasks found</p>
                <p className="mt-2 text-sm text-gray-500">
                  Archived tasks will appear here when you archive them from your task board.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {archivedTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {task.priority && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.status.replace('-', ' ')}
                          </span>
                          {task.module && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              {task.module}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Archived: {new Date(task.archived_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUnarchiveTask(task.id)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                          title="Unarchive task"
                        >
                          <Undo className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArchivedTasks;
