
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "../../hooks/use-toast";
import PrioritySelector from "./taskForm/PrioritySelector";
import { Module } from "../../types/module";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Task {
  title: string;
  description: string;
  module_id?: string;
  dueDate?: string;
  status: "todo" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  taskType?: string;
}

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onCreateTask: (task: Task) => Promise<Task | true | false | null>;
  modules: Module[];
  initialData?: Task;
  selectedModuleId?: string;
}

const CreateTaskDialog = ({ 
  isOpen, 
  onClose, 
  onCreateTask, 
  modules, 
  initialData, 
  selectedModuleId 
}: CreateTaskDialogProps) => {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    module_id: "",
    dueDate: "",
    status: "todo",
    priority: "medium",
    taskType: "assignment"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      console.log("[CreateTaskDialog] Dialog opened, initialData:", initialData, "selectedModuleId:", selectedModuleId);
      if (initialData) {
        setFormData(initialData);
      } else {
        // Reset form and set selected module if provided
        setFormData({
          title: "",
          description: "",
          module_id: selectedModuleId || "",
          dueDate: "",
          status: "todo",
          priority: "medium",
          taskType: "assignment"
        });
      }
      setIsSubmitting(false);
    }
  }, [initialData, isOpen, selectedModuleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[CreateTaskDialog] Form submitted with data:", formData);
    
    // Prevent double submission
    if (isSubmitting) {
      console.log("[CreateTaskDialog] Form submission already in progress, preventing duplicate");
      return;
    }
    
    setIsSubmitting(true);
    
    // Check if title is provided
    if (!formData.title.trim()) {
      console.log("[CreateTaskDialog] Form submission failed: Title is required");
      toast({
        title: "Title required",
        description: "Please enter a title for your task",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Check if a module is selected or use the board's selected module
    const moduleId = formData.module_id || selectedModuleId;
    if (!moduleId) {
      console.log("[CreateTaskDialog] Form submission failed: No module selected");
      toast({
        title: "Module required",
        description: "Please select a module in the board filter first",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Use the module from board filter if task doesn't have one
    const taskData = {
      ...formData,
      module_id: moduleId
    };
    
    console.log("[CreateTaskDialog] Submitting task data:", taskData);
    try {
      const result = await onCreateTask(taskData);
      console.log("[CreateTaskDialog] Task creation result:", result);
      
      // Fix: Only check truthiness on non-void return values
      if (result === true || (result !== false && result !== null)) {
        console.log("[CreateTaskDialog] Task created successfully, closing dialog");
        onClose(false);
      } else {
        console.log("[CreateTaskDialog] Task creation failed or returned null");
        // The toast will be shown by the useTaskCrud hook
      }
    } catch (error) {
      console.error("[CreateTaskDialog] Error creating task:", error);
      toast({
        title: "Error creating task",
        description: "An error occurred while creating the task",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriorityChange = (priority: "low" | "medium" | "high") => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const getModuleNameById = (moduleId: string): string => {
    const module = modules.find(m => m.id === moduleId);
    return module ? `${module.code}: ${module.name}` : "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-sm sm:max-w-md mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="text-center sm:text-left pb-2 sm:pb-4">
            <DialogTitle className="text-xl font-semibold">
              {initialData ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the details below to {initialData ? "update the" : "create a new"} task
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto max-h-[60vh] px-1 py-2">
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Task title"
                  className="w-full h-12 text-base"
                  required
                  autoFocus
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details about this task"
                  className="w-full resize-none min-h-[80px] text-base"
                  rows={3}
                />
              </div>
              
              {/* Module Information (read-only) */}
              {(selectedModuleId || formData.module_id) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Module</Label>
                  <div className="px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="font-medium">
                      {getModuleNameById(selectedModuleId || formData.module_id || "")}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Task Type */}
              <div className="space-y-2">
                <Label htmlFor="taskType" className="text-sm font-medium">Task Type</Label>
                <div className="relative">
                  <Select
                    value={formData.taskType}
                    onValueChange={(value) => setFormData({ ...formData, taskType: value })}
                  >
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent 
                      className="z-[100] bg-white border border-gray-200 shadow-lg"
                      position="popper"
                    >
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="exam">Exam Preparation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  className="w-full h-12 text-base"
                  value={formData.dueDate || ""}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <select
                  id="status"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all h-12 text-base"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "todo" | "in-progress" | "completed" })
                  }
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {/* Priority */}
              <PrioritySelector 
                priority={formData.priority || "medium"} 
                onChange={handlePriorityChange} 
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onClose(false)}
              className="w-full h-12 text-base sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full h-12 text-base sm:order-2"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (initialData ? "Saving..." : "Creating...") 
                : (initialData ? "Save Changes" : "Create Task")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
