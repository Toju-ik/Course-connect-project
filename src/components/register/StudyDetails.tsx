
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface StudyDetailsProps {
  initialValues?: {
    academicYear: string;
    semester: string;
    moduleGroup: string;
  };
  onSubmit: (academicYear: string, semester: string, moduleGroup: string) => void;
  onBack: () => void;
}

const academicYears = ["1", "2", "3", "4"];
const semesters = ["Semester 1", "Semester 2"];
const groups = ["G1", "G2", "G3", "G4"];

const StudyDetails = ({ initialValues, onSubmit, onBack }: StudyDetailsProps) => {
  // Explicitly set default values to empty strings
  const defaultAcademicYear = initialValues && initialValues.academicYear ? initialValues.academicYear : "";
  const defaultSemester = initialValues && initialValues.semester ? initialValues.semester : "";
  const defaultModuleGroup = initialValues && initialValues.moduleGroup ? initialValues.moduleGroup : "";
  
  console.log("StudyDetails - Initial values received:", { 
    academicYear: defaultAcademicYear,
    semester: defaultSemester,
    moduleGroup: defaultModuleGroup
  });

  const [academicYear, setAcademicYear] = useState(defaultAcademicYear);
  const [semester, setSemester] = useState(defaultSemester);
  const [moduleGroup, setModuleGroup] = useState(defaultModuleGroup);
  const [errors, setErrors] = useState({
    academicYear: "",
    semester: "",
    moduleGroup: "",
  });

  const originalSelections = useRef({
    academicYear: defaultAcademicYear,
    semester: defaultSemester,
    moduleGroup: defaultModuleGroup
  });

  useEffect(() => {
    if (initialValues) {
      // Only update state if initialValues contains non-empty values
      const newAcademicYear = initialValues.academicYear || "";
      const newSemester = initialValues.semester || "";
      const newModuleGroup = initialValues.moduleGroup || "";
      
      console.log("StudyDetails - Updating from initialValues:", {
        academicYear: newAcademicYear,
        semester: newSemester,
        moduleGroup: newModuleGroup
      });
      
      setAcademicYear(newAcademicYear);
      setSemester(newSemester);
      setModuleGroup(newModuleGroup);
      
      originalSelections.current = {
        academicYear: newAcademicYear,
        semester: newSemester,
        moduleGroup: newModuleGroup
      };
    }
  }, [initialValues]);

  const validate = () => {
    const newErrors = {
      academicYear: !academicYear ? "Please select your academic year" : "",
      semester: !semester ? "Please select a semester" : "",
      moduleGroup: !moduleGroup ? "Please select a module group" : "",
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("StudyDetails - Submitting values:", {
        academicYear: academicYear,
        academicYearType: typeof academicYear,
        semester: semester,
        semesterType: typeof semester,
        moduleGroup: moduleGroup,
        moduleGroupType: typeof moduleGroup
      });
      
      console.log("StudyDetails - Original vs Current:", {
        academicYear: {
          original: originalSelections.current.academicYear,
          current: academicYear,
          changed: originalSelections.current.academicYear !== academicYear
        },
        semester: {
          original: originalSelections.current.semester,
          current: semester,
          changed: originalSelections.current.semester !== semester
        },
        moduleGroup: {
          original: originalSelections.current.moduleGroup,
          current: moduleGroup,
          changed: originalSelections.current.moduleGroup !== moduleGroup
        }
      });
      
      // Ensure we're passing string values
      const yearValue = academicYear || "";
      const semValue = semester || "";
      const groupValue = moduleGroup || "";
      
      console.log("StudyDetails - Final values being passed to parent:", {
        academicYear: yearValue,
        semester: semValue,
        moduleGroup: groupValue
      });
      
      onSubmit(yearValue, semValue, groupValue);
    }
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Academic Year selected:", value, "Type:", typeof value);
    setAcademicYear(value);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Semester selected:", value, "Type:", typeof value);
    setSemester(value);
  };

  const handleModuleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Module Group selected:", value, "Type:", typeof value);
    setModuleGroup(value);
  };

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
        <span>Back to courses</span>
      </button>

      <h2 className="text-xl font-semibold mb-4">Study Details</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year
          </label>
          <select
            value={academicYear}
            onChange={handleAcademicYearChange}
            className={`w-full py-3 px-4 bg-gray-100 border border-gray-200 rounded-lg ${errors.academicYear ? 'border-red-500' : ''}`}
            data-testid="academic-year-select"
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-blue-600">
            Current selected value: {academicYear || "none"} (type: {typeof academicYear})
          </p>
          {errors.academicYear && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.academicYear}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester
          </label>
          <select
            value={semester}
            onChange={handleSemesterChange}
            className={`w-full py-3 px-4 bg-gray-100 border border-gray-200 rounded-lg ${errors.semester ? 'border-red-500' : ''}`}
            data-testid="semester-select"
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-blue-600">
            Current selected value: {semester || "none"} (type: {typeof semester})
          </p>
          {errors.semester && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.semester}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Allocation
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {groups.map((group) => (
              <label
                key={group}
                className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                  moduleGroup === group
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="group"
                  value={group}
                  checked={moduleGroup === group}
                  onChange={handleModuleGroupChange}
                  className="sr-only"
                />
                <span className={`font-medium ${
                  moduleGroup === group ? 'text-primary' : 'text-gray-700'
                }`}>
                  {group}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-blue-600">
            Current selected value: {moduleGroup || "none"} (type: {typeof moduleGroup})
          </p>
          {errors.moduleGroup && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.moduleGroup}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium"
          data-testid="submit-study-details"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

export default StudyDetails;
