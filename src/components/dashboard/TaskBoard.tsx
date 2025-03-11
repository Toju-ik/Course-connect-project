
import { useState, useEffect } from "react";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskFilters from "./TaskFilters";
import TaskBoardActions from "./TaskBoardActions";
import KanbanBoard from "./KanbanBoard";
import { useToast } from "../../hooks/use-toast";
import { Task } from "../../hooks/useTasks";
import { Module } from "../../types/module";

interface TaskBoardProps {
  tasks: Task[];
  onCreateTask: (taskData: Omit<Task, "id">) => void;
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
    const matchesModule = !moduleFilter || task.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const getTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const tasksByStatus = {
    "todo": getTasksByStatus("todo"),
    "in-progress": getTasksByStatus("in-progress"),
    "completed": getTasksByStatus("completed")
  };

  return (
    <section className="mt-2">
      <div className="flex flex-col gap-4 mb-6">
        <TaskBoardActions onCreateTask={() => setIsCreateDialogOpen(true)} />
        
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          moduleFilter={moduleFilter}
          onModuleFilterChange={setModuleFilter}
          modules={modules}
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
        onClose={setIsCreateDialogOpen}
        onCreateTask={onCreateTask}
        modules={modules}
      />

      {editingTask && (
        <CreateTaskDialog
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onCreateTask={(taskData) => onUpdateTask(editingTask.id, taskData)}
          modules={modules}
          initialData={editingTask}
        />
      )}
    </section>
  );
};

export default TaskBoard;
