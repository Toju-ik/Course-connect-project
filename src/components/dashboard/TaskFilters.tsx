
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Module } from "../../types/module";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  moduleFilter: string;
  onModuleFilterChange: (module: string) => void;
  modules: Module[];
}

const TaskFilters = ({
  searchQuery,
  onSearchChange,
  moduleFilter,
  onModuleFilterChange,
  modules
}: TaskFiltersProps) => {
  // Create a deduplicated list of modules by grouping by module code
  // This will ensure each module code appears only once in the dropdown
  const uniqueModules = modules.reduce((uniqueModules, module) => {
    // Use the module code as the key for deduplication
    const existingModule = uniqueModules.find(m => 
      m.code.toLowerCase() === module.code.toLowerCase()
    );
    
    if (!existingModule) {
      uniqueModules.push(module);
    }
    return uniqueModules;
  }, [] as Module[]);
  
  // Sort modules alphabetically by code for better user experience
  uniqueModules.sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full h-10 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="sm:w-48">
        <Label htmlFor="moduleFilter" className="sr-only">Filter by module</Label>
        <select
          id="moduleFilter"
          className="w-full h-10 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
          value={moduleFilter}
          onChange={(e) => onModuleFilterChange(e.target.value)}
        >
          <option value="">All Modules</option>
          {uniqueModules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
