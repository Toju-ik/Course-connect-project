
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  moduleFilter: string;
  onModuleFilterChange: (module: string) => void;
  modules: { code: string; name: string }[];
}

const TaskFilters = ({
  searchQuery,
  onSearchChange,
  moduleFilter,
  onModuleFilterChange,
  modules
}: TaskFiltersProps) => {
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
          {modules.map((module) => (
            <option key={module.code} value={module.code}>
              {module.code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
