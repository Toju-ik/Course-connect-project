
import { motion } from "framer-motion";

interface ModuleGroupProps {
  onSelect: (group: string) => void;
  onBack: () => void;
}

const ModuleGroup = ({ onSelect, onBack }: ModuleGroupProps) => {
  const groups = [
    { id: "A", name: "Group A" },
    { id: "B", name: "Group B" },
    { id: "C", name: "Group C" }
  ];

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-6">Select Module Group</h2>
      
      <div className="space-y-4">
        {groups.map((group) => (
          <button
            key={group.id}
            className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            onClick={() => onSelect(group.id)}
          >
            <div className="flex items-center">
              <div className="flex-1 text-left">
                <span className="font-medium">{group.name}</span>
              </div>
            </div>
          </button>
        ))}
        <button
          className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
          onClick={() => onSelect("None")}
        >
          <div className="flex items-center">
            <div className="flex-1 text-left">
              <span className="font-medium">No Group (Default)</span>
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default ModuleGroup;
