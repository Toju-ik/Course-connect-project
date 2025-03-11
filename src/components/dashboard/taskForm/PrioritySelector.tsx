
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

type PriorityType = "low" | "medium" | "high";

interface PrioritySelectorProps {
  priority: PriorityType;
  onChange: (priority: PriorityType) => void;
}

const PrioritySelector = ({ priority, onChange }: PrioritySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Priority</Label>
      <div className="grid grid-cols-3 gap-2">
        <div 
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            priority === 'low' ? 'bg-green-50 border-green-500' : 'border-gray-200'
          } cursor-pointer transition-all`}
          onClick={() => onChange('low')}
        >
          <CheckCircle className={`h-6 w-6 ${priority === 'low' ? 'text-green-500' : 'text-gray-400'} mb-1`} />
          <span className={`text-sm font-medium ${priority === 'low' ? 'text-green-700' : 'text-gray-700'}`}>Low</span>
        </div>
        
        <div 
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            priority === 'medium' ? 'bg-amber-50 border-amber-500' : 'border-gray-200'
          } cursor-pointer transition-all`}
          onClick={() => onChange('medium')}
        >
          <AlertTriangle className={`h-6 w-6 ${priority === 'medium' ? 'text-amber-500' : 'text-gray-400'} mb-1`} />
          <span className={`text-sm font-medium ${priority === 'medium' ? 'text-amber-700' : 'text-gray-700'}`}>Medium</span>
        </div>
        
        <div 
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            priority === 'high' ? 'bg-red-50 border-red-500' : 'border-gray-200'
          } cursor-pointer transition-all`}
          onClick={() => onChange('high')}
        >
          <AlertTriangle className={`h-6 w-6 ${priority === 'high' ? 'text-red-500' : 'text-gray-400'} mb-1`} />
          <span className={`text-sm font-medium ${priority === 'high' ? 'text-red-700' : 'text-gray-700'}`}>High</span>
        </div>
      </div>
    </div>
  );
};

export default PrioritySelector;
