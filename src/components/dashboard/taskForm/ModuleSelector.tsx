
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface ModuleSelectorProps {
  selectedModule: string;
  moduleDisplayName: string;
  onClick: () => void;
  isRequired?: boolean;
  error?: string;
}

const ModuleSelector = ({ selectedModule, moduleDisplayName, onClick, isRequired = false, error }: ModuleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="module" className="text-sm font-medium">
        Module {isRequired && <span className="text-red-500">*</span>}
      </Label>
      <div 
        className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'} flex items-center justify-between cursor-pointer min-h-[48px]`}
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
          <span className={`${error ? 'text-red-400' : 'text-gray-400'}`}>
            {error ? 'Select a module (required)' : 'Select a module'}
          </span>
        )}
        <Search className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'} flex-shrink-0 ml-2`} />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ModuleSelector;
