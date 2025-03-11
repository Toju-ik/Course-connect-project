
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface ModuleSelectorProps {
  selectedModule: string;
  moduleDisplayName: string;
  onClick: () => void;
}

const ModuleSelector = ({ selectedModule, moduleDisplayName, onClick }: ModuleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="module" className="text-sm font-medium">Module</Label>
      <div 
        className="w-full px-4 py-3 rounded-lg border border-gray-200 flex items-center justify-between cursor-pointer min-h-[48px]"
        onClick={onClick}
      >
        {selectedModule ? (
          <div className="truncate">
            <span className="font-medium">{selectedModule}</span>
            {moduleDisplayName && (
              <span className="text-gray-500 ml-1">: {moduleDisplayName}</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Select a module</span>
        )}
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
      </div>
    </div>
  );
};

export default ModuleSelector;
