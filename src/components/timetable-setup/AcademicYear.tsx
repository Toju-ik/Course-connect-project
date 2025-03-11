
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AcademicYearProps {
  courseId?: string;
  departmentName: string;
  onSelect: (year: string) => void;
}

const AcademicYear = ({ courseId, departmentName, onSelect }: AcademicYearProps) => {
  const [years, setYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from("course_modules")
          .select("academic_year")
          .order("academic_year");
          
        if (courseId) {
          query = query.eq("course_id", courseId);
        }
        
        const { data, error } = await query;

        if (error) throw error;
        
        if (data) {
          // Extract unique academic years
          const uniqueYears = [...new Set(data.map(item => item.academic_year.toString()))];
          setYears(uniqueYears);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchYears();
  }, [courseId]);

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-2">Select Your Year</h2>
      <p className="text-gray-600 mb-6">Course: {departmentName}</p>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {years.length > 0 ? (
            years.map((year) => (
              <button
                key={year}
                className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => onSelect(year)}
              >
                <div className="flex items-center">
                  <div className="flex-1 text-left">
                    <span className="font-medium">Year {year}</span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            // If no years are returned, provide default options
            <>
              <button
                className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => onSelect("1")}
              >
                <div className="flex items-center">
                  <div className="flex-1 text-left">
                    <span className="font-medium">Year 1</span>
                  </div>
                </div>
              </button>
              <button
                className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => onSelect("2")}
              >
                <div className="flex items-center">
                  <div className="flex-1 text-left">
                    <span className="font-medium">Year 2</span>
                  </div>
                </div>
              </button>
              <button
                className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => onSelect("3")}
              >
                <div className="flex items-center">
                  <div className="flex-1 text-left">
                    <span className="font-medium">Year 3</span>
                  </div>
                </div>
              </button>
              <button
                className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => onSelect("4")}
              >
                <div className="flex items-center">
                  <div className="flex-1 text-left">
                    <span className="font-medium">Year 4</span>
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AcademicYear;
