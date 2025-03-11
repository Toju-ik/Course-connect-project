
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Module {
  id: string;
  module_code: string;
  module_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string;
}

interface ModuleSelectionProps {
  courseId?: string;
  academicYear: string;
  semester: string;
  moduleGroup: string;
  onSubmit: (moduleIds: string[]) => void;
  onBack: () => void;
}

const ModuleSelection = ({ 
  courseId, 
  academicYear, 
  semester, 
  moduleGroup, 
  onSubmit, 
  onBack 
}: ModuleSelectionProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from("course_modules")
          .select("*")
          .eq("semester", semester)
          .eq("academic_year", academicYear);
          
        if (courseId) {
          query = query.eq("course_id", courseId);
        }
        
        if (moduleGroup !== "None") {
          query = query.eq("group_name", moduleGroup);
        }
        
        const { data, error } = await query;

        if (error) throw error;
        
        if (data) {
          setModules(data);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [courseId, academicYear, semester, moduleGroup]);

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const filteredModules = modules.filter(
    (module) =>
      module.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.module_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    onSubmit(selectedModules);
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-2">Select Your Modules</h2>
      <p className="text-gray-600 mb-4">
        Year {academicYear}, {semester}, Group {moduleGroup}
      </p>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search modules..."
          className="pl-10 pr-4 py-3 w-full bg-gray-100 border border-gray-200 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 mb-20">
          {filteredModules.map((module) => (
            <button
              key={module.id}
              className={`w-full px-4 py-4 border rounded-lg text-left flex items-start hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                selectedModules.includes(module.id) 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200"
              }`}
              onClick={() => toggleModuleSelection(module.id)}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-600">{module.module_code}</span>
                  {selectedModules.includes(module.id) && (
                    <Check className="h-4 w-4 text-primary ml-2" />
                  )}
                </div>
                <span className="font-medium block">{module.module_name}</span>
                <div className="text-sm text-gray-500 mt-1">
                  {module.day_of_week} {module.start_time}-{module.end_time} • {module.room}
                </div>
              </div>
            </button>
          ))}
          
          {filteredModules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? `No modules found matching "${searchTerm}"`
                : "No modules available for the selected criteria"}
            </div>
          )}
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <button
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
          onClick={handleSubmit}
          disabled={selectedModules.length === 0}
        >
          {selectedModules.length === 0 
            ? "Select at least one module" 
            : `Continue with ${selectedModules.length} module${selectedModules.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </motion.div>
  );
};

export default ModuleSelection;
