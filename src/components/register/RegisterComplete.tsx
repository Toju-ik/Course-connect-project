
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Book } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useTimetablePrompt } from "../../contexts/TimetablePromptContext";

interface Module {
  id: string;
  module_code: string;
  module_title: string;
  credits: number;
}

interface RegisterCompleteProps {
  formData?: {
    studentId: string;
    departmentName: string;
    courseName: string;
    academicYear: string;
    semester: string;
    moduleGroup: string;
    selectedModules?: { id: string; credits: number; description?: string; }[];
    [key: string]: any;
  };
}

const RegisterComplete = ({ formData }: RegisterCompleteProps) => {
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checkTimetableSetup } = useTimetablePrompt();

  useEffect(() => {
    const fetchSelectedModules = async () => {
      if (!formData?.selectedModules?.length) return;
      
      setLoading(true);
      try {
        // Fetch the module details for each selected module ID
        const { data, error } = await supabase
          .from("modules")
          .select("id, module_code, module_title, credits")
          .in("id", formData.selectedModules);
          
        if (error) throw error;
        
        console.log("Fetched selected modules:", data);
        setSelectedModules(data || []);
      } catch (err) {
        console.error("Error fetching selected modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedModules();
    
    // Check timetable setup status when registration is complete
    if (user) {
      checkTimetableSetup();
    }
  }, [formData?.selectedModules, user, checkTimetableSetup]);

  const totalCredits = selectedModules.reduce((total, module) => total + (module.credits || 0), 0);

  const handleGoToDashboard = () => {
    // Navigate to dashboard after registration
    navigate("/dashboard");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
      <p className="text-gray-600 mb-2">
        Your account has been created successfully.
      </p>

      {formData && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 w-full">
          <div className="text-left text-sm">
            <p><strong>Student ID:</strong> {formData.studentId}</p>
            <p><strong>Department:</strong> {formData.departmentName}</p>
            {formData.courseName && <p><strong>Course:</strong> {formData.courseName}</p>}
            <p><strong>Year:</strong> {formData.academicYear ? `Year ${formData.academicYear}` : "Not set"}</p>
            <p><strong>Semester:</strong> {formData.semester || "Not set"}</p>
            <p><strong>Module Group:</strong> {formData.moduleGroup || "Not set"}</p>
            
            {selectedModules.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Selected Modules:</p>
                <div className="space-y-2">
                  {selectedModules.map(module => (
                    <div key={module.id} className="flex items-center bg-white p-2 rounded border border-gray-200">
                      <Book className="h-4 w-4 text-primary mr-2" />
                      <div>
                        <span className="font-medium">{module.module_title}</span>
                        <span className="text-xs text-gray-600 ml-2">({module.module_code})</span>
                      </div>
                      <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                        {module.credits} Credits
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-right mt-2 font-medium">
                  Total: {totalCredits} Credits
                </p>
              </div>
            )}
            
            <p className="mt-2 text-xs text-blue-600">
              Raw data: Year: '{formData.academicYear}' (type: {typeof formData.academicYear}), 
              Semester: '{formData.semester}' (type: {typeof formData.semester}),
              Module Group: '{formData.moduleGroup}' (type: {typeof formData.moduleGroup})
            </p>
          </div>
        </div>
      )}
      
      <p className="text-gray-600 mb-8">
        Next, set up your timetable to get started.
      </p>
      
      <Link
        to="/timetable"
        className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium text-center"
      >
        Set Up Timetable
      </Link>

      <button
        onClick={handleGoToDashboard}
        className="w-full mt-4 py-3 px-4 bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-center"
      >
        Skip for Now (Go to Dashboard)
      </button>
    </motion.div>
  );
};

export default RegisterComplete;
