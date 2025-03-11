
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PrioritySelector from "./taskForm/PrioritySelector";
import ModuleSelector from "./taskForm/ModuleSelector";
import ModuleSearchModal from "./taskForm/ModuleSearchModal";
import { Module } from "../../types/module";

interface Task {
  title: string;
  description: string;
  module?: string;
  dueDate?: string;
  status: "todo" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
}

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onCreateTask: (task: Task) => void;
  modules: Module[];
  initialData?: Task;
}

const CreateTaskDialog = ({ isOpen, onClose, onCreateTask, modules: providedModules, initialData }: CreateTaskDialogProps) => {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    module: "",
    dueDate: "",
    status: "todo",
    priority: "medium"
  });
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModuleSearch, setShowModuleSearch] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        resetForm();
      }
      setFilteredModules(providedModules);
    }
  }, [initialData, isOpen, providedModules]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      module: "",
      dueDate: "",
      status: "todo",
      priority: "medium"
    });
    setSearchQuery("");
    setShowModuleSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting task data:", formData);
    onCreateTask(formData);
    onClose(false);
    resetForm();
  };

  const handleModuleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredModules(providedModules);
      return;
    }
    const filtered = providedModules
      .filter(module =>
        module.code.toLowerCase().includes(query.toLowerCase()) ||
        module.name.toLowerCase().includes(query.toLowerCase())
      );
    setFilteredModules(filtered);
  };

  const selectModule = (moduleCode: string) => {
    setFormData(prev => ({ ...prev, module: moduleCode }));
    setShowModuleSearch(false);
  };

  const getModuleNameByCode = (code: string): string => {
    const module = providedModules.find(m => m.code === code);
    return module ? module.name : "";
  };

  const handlePriorityChange = (priority: "low" | "medium" | "high") => {
    setFormData(prev => ({ ...prev, priority }));
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
              
              {/* Module Selection */}
              <ModuleSelector 
                selectedModule={formData.module || ""} 
                moduleDisplayName={getModuleNameByCode(formData.module || "")}
                onClick={() => setShowModuleSearch(true)}
              />
              
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
            >
              {initialData ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
      {showModuleSearch && (
        <ModuleSearchModal 
          modules={filteredModules}
          searchQuery={searchQuery}
          onSearchChange={handleModuleSearch}
          onSelectModule={selectModule}
          onClose={() => setShowModuleSearch(false)}
        />
      )}
    </Dialog>
  );
};

export default CreateTaskDialog;
