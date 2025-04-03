
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  module_id?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  taskType?: string;
}

interface KanbanBoardProps {
  tasks: {
    todo: Task[];
    "in-progress": Task[];
    completed: Task[];
  };
  onTaskMove: (taskId: string, newStatus: "todo" | "in-progress" | "completed") => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanBoard = ({ tasks, onTaskMove, onEditTask, onDeleteTask }: KanbanBoardProps) => {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [hoveringColumn, setHoveringColumn] = useState<string | null>(null);
  const { toast } = useToast();

  // Array of status options to determine next status
  const statusSequence: ["todo", "in-progress", "completed"] = ["todo", "in-progress", "completed"];

  // Function to determine the next status in the sequence
  const getNextStatus = (currentStatus: string): "todo" | "in-progress" | "completed" => {
    const currentIndex = statusSequence.indexOf(currentStatus as "todo" | "in-progress" | "completed");
    if (currentIndex === -1 || currentIndex === statusSequence.length - 1) {
      return currentStatus as "todo" | "in-progress" | "completed";
    }
    return statusSequence[currentIndex + 1];
  };

  // Handle moving a single task to the next column
  const handleMoveTask = (taskId: string) => {
    const findTask = (id: string): Task | undefined => {
      return [
        ...tasks.todo,
        ...tasks["in-progress"],
        ...tasks.completed
      ].find(task => task.id === id);
    };

    const task = findTask(taskId);
    if (!task) return;

    const nextStatus = getNextStatus(task.status);
    if (nextStatus !== task.status) {
      onTaskMove(taskId, nextStatus);
      toast({
        title: "Task Moved",
        description: `Task "${task.title}" moved to ${
          nextStatus === "todo" ? "To Do" : 
          nextStatus === "in-progress" ? "In Progress" : 
          "Completed"
        }`,
      });
    }
  };

  // Handle moving all tasks in a column to the next column
  const handleMoveAllTasks = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus === currentStatus) return;

    const tasksToMove = 
      currentStatus === "todo" ? tasks.todo :
      currentStatus === "in-progress" ? tasks["in-progress"] : 
      tasks.completed;

    if (tasksToMove.length === 0) return;

    // Move each task to the next status
    tasksToMove.forEach(task => {
      onTaskMove(task.id, nextStatus);
    });

    toast({
      title: "Tasks Moved",
      description: `${tasksToMove.length} tasks moved to ${
        nextStatus === "todo" ? "To Do" : 
        nextStatus === "in-progress" ? "In Progress" : 
        "Completed"
      }`,
    });
  };

  const handleDeleteClick = (taskId: string) => {
    setDeleteTaskId(taskId);
  };

  const handleConfirmDelete = () => {
    if (deleteTaskId) {
      onDeleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTaskId(null);
  };

  return (
    <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 overscroll-x-contain snap-x hide-scrollbar smooth-scroll">
      <KanbanColumn
        title="To Do"
        count={tasks.todo.length}
        status="todo"
        tasks={tasks.todo}
        onEditTask={onEditTask}
        onDeleteTask={handleDeleteClick}
        onMoveTask={handleMoveTask}
        onMoveAllTasks={handleMoveAllTasks}
        isLastColumn={false}
        isHighlighted={hoveringColumn === "todo"}
      />

      <KanbanColumn
        title="In Progress"
        count={tasks["in-progress"].length}
        status="in-progress"
        tasks={tasks["in-progress"]}
        onEditTask={onEditTask}
        onDeleteTask={handleDeleteClick}
        onMoveTask={handleMoveTask}
        onMoveAllTasks={handleMoveAllTasks}
        isLastColumn={false}
        isHighlighted={hoveringColumn === "in-progress"}
      />

      <KanbanColumn
        title="Done"
        count={tasks.completed.length}
        status="completed"
        tasks={tasks.completed}
        onEditTask={onEditTask}
        onDeleteTask={handleDeleteClick}
        onMoveTask={handleMoveTask}
        onMoveAllTasks={handleMoveAllTasks}
        isLastColumn={true}
        isHighlighted={hoveringColumn === "completed"}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteTaskId !== null} onOpenChange={handleCancelDelete}>
        <AlertDialogContent className="max-w-sm md:max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete or Archive Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to archive this task for later reference or permanently delete it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <Button 
              variant="outline" 
              className="flex items-center gap-1 w-full sm:w-auto"
              onClick={handleConfirmDelete}
            >
              <Archive className="w-4 h-4" />
              <span>Archive</span>
            </Button>
            <AlertDialogAction 
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
              onClick={handleConfirmDelete}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KanbanBoard;
