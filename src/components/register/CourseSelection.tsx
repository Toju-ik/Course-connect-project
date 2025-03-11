
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Course {
  id: string;
  course_code: string;
  course_name: string;
}

interface CourseSelectionProps {
  departmentId: string;
  departmentName: string;
  onSelect: (courseCode: string, courseName: string, courseId: string) => void;
  onBack: () => void;
}

const CourseSelection = ({ 
  departmentId, 
  departmentName, 
  onSelect, 
  onBack 
}: CourseSelectionProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        console.log("Fetching courses for department ID:", departmentId);
        
        const { data, error } = await supabase
          .from("courses")
          .select("id, course_code, course_name")
          .eq("department_id", departmentId)
          .order("course_name");

        if (error) throw error;
        
        console.log("Fetched courses:", data);
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (departmentId) {
      fetchCourses();
    }
  }, [departmentId]);

  const filteredCourses = courses.filter(
    (course) =>
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <span>Back to disciplines</span>
      </button>

      <h2 className="text-xl font-semibold mb-1">Select Your Course</h2>
      <p className="text-gray-500 text-sm mb-4">{departmentName}</p>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search courses..."
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
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <button
                key={course.id}
                className="w-full px-4 py-4 border border-gray-200 rounded-lg flex flex-col items-start hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => onSelect(course.course_code, course.course_name, course.id)}
              >
                <span className="text-sm font-semibold text-gray-600">{course.course_code}</span>
                <span className="font-medium">{course.course_name}</span>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? `No courses found matching "${searchTerm}"`
                : "No courses available for this department"}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CourseSelection;
