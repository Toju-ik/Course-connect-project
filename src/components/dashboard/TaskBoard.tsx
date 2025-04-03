
import { useState, useEffect } from "react";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskFilters from "./TaskFilters";
import TaskBoardActions from "./TaskBoardActions";
import KanbanBoard from "./KanbanBoard";
import { useToast } from "../../hooks/use-toast";
import { useGamification } from "../../hooks/useGamification";
import { Task } from "../../hooks/useTasks";
import { Module } from "../../types/module";

interface TaskBoardProps {
  tasks: Task[];
  onCreateTask: (taskData: Omit<Task, "id">) => Promise<Task | true | false | null>;
  onUpdateTask: (id: string, taskData: Omit<Task, "id">) => void;
  onDeleteTask: (id: string) => void;
  modules: Module[];
}

const TaskBoard = ({ tasks, onCreateTask, onUpdateTask, onDeleteTask, modules }: TaskBoardProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const { toast } = useToast();
  const { awardTaskCompletionCoins } = useGamification();
  
  // Create a deduplicated list of modules for internal use
  const uniqueModules = modules.reduce((uniqueModules, module) => {
    const existingModule = uniqueModules.find(m => 
      m.code?.toLowerCase() === module.code?.toLowerCase()
    );
    
    if (!existingModule) {
      uniqueModules.push(module);
    }
    return uniqueModules;
  }, [] as Module[]);
  
  const handleTaskMove = (taskId: string, newStatus: Task["status"]) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status !== newStatus) {
      onUpdateTask(task.id, { ...task, status: newStatus });
      
      // Show toast notification for task movement
      toast({
        title: "Task Moved",
        description: `"${task.title}" moved to ${newStatus === "todo" ? "To Do" : newStatus === "in-progress" ? "In Progress" : "Done"}`,
      });
      
      // Award coins if task is moved to completed status
      if (newStatus === "completed" && task.status !== "completed") {
        console.log(`[TaskBoard] Awarding coins for completing task: ${task.title}`);
        awardTaskCompletionCoins()
          .then(success => {
            if (success) {
              toast({
                title: "Coins Awarded!",
                description: "You earned 5 coins for completing a task.",
              });
            } else {
              console.error(`[TaskBoard] Failed to award coins for task completion: ${task.title}`);
            }
          })
          .catch(error => {
            console.error(`[TaskBoard] Error awarding coins for task completion:`, error);
          });
      }
    }
  };

  const handleCreateNewTask = async (taskData: Omit<Task, "id">) => {
    console.log("[TaskBoard] handleCreateNewTask called with data:", taskData);
    try {
      const result = await onCreateTask(taskData);
      console.log("[TaskBoard] Task creation result:", result);
      
      if (result) {
        console.log("[TaskBoard] Task created successfully");
        return true;
      } else {
        console.error("[TaskBoard] Task creation failed or returned null");
        toast({
          title: "Error",
          description: "Failed to create task. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("[TaskBoard] Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleConfirmDelete = (taskId: string) => {
    onDeleteTask(taskId);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = !moduleFilter || task.module_id === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const getTasksByStatus = (status: Task["status"]) => {
    // Make sure we normalize any non-standard status values
    const normalizeStatus = (taskStatus: string): boolean => {
      if (status === "todo") {
        return ["todo", "to do", "to-do"].includes(taskStatus.toLowerCase());
      } else if (status === "in-progress") {
        return ["in-progress", "in progress", "inprogress"].includes(taskStatus.toLowerCase());
      } else if (status === "completed") {
        return ["completed", "complete", "done"].includes(taskStatus.toLowerCase());
      }
      return taskStatus === status;
    };
    
    return filteredTasks.filter(task => normalizeStatus(task.status));
  };

  const tasksByStatus = {
    "todo": getTasksByStatus("todo"),
    "in-progress": getTasksByStatus("in-progress"),
    "completed": getTasksByStatus("completed")
  };

  return (
    <section className="mt-2">
      <div className="flex flex-col gap-4 mb-6">
        <TaskBoardActions onCreateTask={() => {
          console.log("[TaskBoard] Opening create task dialog");
          setIsCreateDialogOpen(true);
        }} />
        
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          moduleFilter={moduleFilter}
          onModuleFilterChange={setModuleFilter}
          modules={uniqueModules} // Pass the deduplicated modules
        />
      </div>

      <KanbanBoard
        tasks={tasksByStatus}
        onTaskMove={handleTaskMove}
        onEditTask={handleEditTask}
        onDeleteTask={handleConfirmDelete}
      />

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={(open) => {
          console.log("[TaskBoard] Closing create task dialog");
          setIsCreateDialogOpen(open);
        }}
        onCreateTask={handleCreateNewTask}
        modules={modules}
        selectedModuleId={moduleFilter}
      />

      {editingTask && (
        <CreateTaskDialog
          isOpen={!!editingTask}
          onClose={() => {
            console.log("[TaskBoard] Closing edit task dialog");
            setEditingTask(null);
          }}
          onCreateTask={(taskData) => {
            console.log("[TaskBoard] Updating task:", editingTask.id, taskData);
            onUpdateTask(editingTask.id, taskData);
            return Promise.resolve(true);
          }}
          modules={modules}
          initialData={editingTask}
          selectedModuleId={moduleFilter}
        />
      )}
    </section>
  );
};

export default TaskBoard;
