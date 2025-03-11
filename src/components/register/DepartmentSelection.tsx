
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Department {
  id: string;
  name: string;
  color: string;
}

interface DepartmentSelectionProps {
  onSelect: (departmentId: string, departmentName: string) => void;
}

const DepartmentSelection = ({ onSelect }: DepartmentSelectionProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("departments")
          .select("id, name, color")
          .order("name");

        if (error) throw error;
        console.log("Fetched departments:", data);
        setDepartments(data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Select Your Discipline</h2>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search disciplines..."
          className="pl-10 pr-4 py-3 w-full bg-gray-100 border border-gray-200 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredDepartments.map((dept) => (
            <button
              key={dept.id}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg flex items-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => onSelect(dept.id, dept.name)}
              style={{ borderLeftColor: dept.color, borderLeftWidth: '4px' }}
            >
              <div className="flex-1 text-left">
                <span className="font-medium">{dept.name}</span>
              </div>
            </button>
          ))}
          
          {filteredDepartments.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              No departments found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DepartmentSelection;
