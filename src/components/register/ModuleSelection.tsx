
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Book, Check, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Module {
  id: string;
  module_code: string;
  module_title: string;
  module_type: string;
  semester: string;
  description?: string;
  credits: number;
}

interface ModuleSelectionProps {
  courseId: string | null;
  selectedSemester: string;
  initialSelectedModules?: { id: string; credits: number; description?: string; }[];
  onSubmit: (selectedModules: { id: string; credits: number; description?: string; }[]) => void;
  onBack: () => void;
}

const ModuleSelection: React.FC<ModuleSelectionProps> = ({
  courseId,
  selectedSemester,
  initialSelectedModules = [],
  onSubmit,
  onBack
}) => {
  const [selectedTab, setSelectedTab] = useState<"Semester 1" | "Semester 2">(
    selectedSemester === "Semester 2" ? "Semester 2" : "Semester 1"
  );
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);

  const [selectedModules, setSelectedModules] = useState<{ id: string; credits: number; description?: string; }[]>(
    initialSelectedModules || []
  );

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching modules for course ID:", courseId);
        
        if (!courseId) {
          throw new Error("No course ID provided");
        }
        
        const { data, error } = await supabase
          .from("modules")
          .select("*")
          .eq("course_id", courseId);

        if (error) {
          throw error;
        }

        console.log("Fetched modules:", data);
        setModules(data || []);
      } catch (err: any) {
        console.error("Error fetching modules:", err);
        setError(err.message || "Failed to load modules");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchModules();
    } else {
      console.error("No course ID provided to ModuleSelection component");
      setError("Course information is missing");
    }
  }, [courseId]);

  useEffect(() => {
    // Calculate total credits
    const credits = modules
      .filter(module => selectedModules.some(selectedModule => selectedModule.id === module.id))
      .reduce((total, module) => total + (module.credits || 0), 0);
    
    setTotalCredits(credits);
  }, [selectedModules, modules]);

  const toggleModuleSelection = (module: Module) => {
    setSelectedModules(prevSelected => {
      const isSelected = prevSelected.some(selectedModule => selectedModule.id === module.id);
      
      if (isSelected) {
        return prevSelected.filter(selectedModule => selectedModule.id !== module.id);
      } else {
        console.log("Adding module to selection:", {
          id: module.id,
          credits: module.credits,
          description: module.description
        });
        
        return [...prevSelected, { 
          id: module.id, 
          credits: module.credits, 
          description: module.description 
        }];
      }
    });
  };

  const handleSubmit = () => {
    console.log("Submitting selected modules:", selectedModules);
    onSubmit(selectedModules);
  };

  // Filter modules by semester
  const filteredModules = modules.filter(module => 
    module.semester === selectedTab
  );

  // Group modules by module_code to show each unique module once
  const uniqueModuleCodes = [...new Set(filteredModules.map(module => module.module_code))];
  
  const modulesByCode = uniqueModuleCodes.map(code => {
    const modulesWithCode = filteredModules.filter(m => m.module_code === code);
    // Just use the first module for display, but track all IDs
    return {
      ...modulesWithCode[0],
      allIds: modulesWithCode.map(m => m.id)
    };
  });

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <button 
        onClick={onBack} 
        className="flex items-center text-gray-600 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to study details</span>
      </button>

      <h2 className="text-xl font-semibold mb-2">Choose Your Modules</h2>
      <p className="text-gray-600 mb-6">
        Select your modules for each semester. You can choose multiple modules, keeping track of your total credits.
      </p>
      
      {/* Semester tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-md text-center transition ${
            selectedTab === "Semester 1" 
              ? "bg-white shadow-sm text-primary font-medium" 
              : "text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTab("Semester 1")}
        >
          First Semester
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-center transition ${
            selectedTab === "Semester 2" 
              ? "bg-white shadow-sm text-primary font-medium" 
              : "text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTab("Semester 2")}
        >
          Second Semester
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 flex items-center justify-center h-40">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      ) : modulesByCode.length === 0 ? (
        <div className="text-gray-500 flex flex-col items-center justify-center h-40">
          <Book className="h-8 w-8 mb-2 text-gray-400" />
          <span>No modules available for this semester</span>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {modulesByCode.map((module) => {
            const isSelected = selectedModules.some(selectedModule => module.allIds.includes(selectedModule.id));
            
            return (
              <div 
                key={module.module_code}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  toggleModuleSelection(module)
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Book className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium text-lg">{module.module_title}</h3>
                    </div>
                    <p className="text-gray-600 mt-1">{module.description || `Explore key concepts in ${module.module_title}`}</p>
                    
                    <div className="mt-2 flex items-center space-x-3">
                      <span className="inline-block bg-gray-100 px-2 py-1 text-xs rounded text-gray-700">
                        {module.module_code}
                      </span>
                      <span className="inline-block bg-gray-100 px-2 py-1 text-xs rounded text-gray-700">
                        {module.credits} Credits
                      </span>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="text-primary">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selection summary */}
      <div className="bg-purple-50 rounded-lg p-4 mt-auto mb-6 flex justify-between items-center">
        <div>
          <span className="text-purple-800 font-medium">Selected Modules: {selectedModules.length}</span>
        </div>
        <div>
          <span className="text-purple-800 font-medium">Total Credits: {totalCredits}</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </motion.div>
  );
};

export default ModuleSelection;
