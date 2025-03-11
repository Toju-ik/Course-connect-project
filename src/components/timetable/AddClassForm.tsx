
import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import { ClassSchedule, Module, colorOptions } from "../../types/timetable";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface AddClassFormProps {
  formData: ClassSchedule;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredModules: Module[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onModuleSelect: (moduleId: string) => void;
  onColorSelect: (color: string) => void;
  onClassNameInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const AddClassForm = ({
  formData,
  searchQuery,
  setSearchQuery,
  filteredModules,
  isSubmitting,
  onClose,
  onSubmit,
  onInputChange,
  onModuleSelect,
  onColorSelect,
  onClassNameInput
}: AddClassFormProps) => {
  // Get user's semester for filtering
  const [userSemester, setUserSemester] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserSemester = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("semester")
            .eq("id", user.id)
            .single();
            
          if (data && data.semester) {
            setUserSemester(data.semester);
            console.log("User's semester:", data.semester);
          }
        }
      } catch (error) {
        console.error("Error fetching user semester:", error);
      }
    };
    
    fetchUserSemester();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white h-full w-full max-w-md p-6 overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add New Class</h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800"
            type="button"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Details
            </label>
            <div className="space-y-4">
              {/* Module search - optional */}
              <div className="relative">
                <div className="text-sm text-gray-600 mb-1">
                  Search for a module (optional)
                  {userSemester && <span className="text-primary ml-1">• Showing {userSemester} modules</span>}
                </div>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="px-3 py-2 bg-gray-100">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for a module..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 px-3 border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
                
                {searchQuery && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredModules.length > 0 ? (
                      filteredModules.map(module => (
                        <div
                          key={module.id}
                          onClick={() => {
                            onModuleSelect(module.id);
                            setSearchQuery("");
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium">{module.module_code}</div>
                          <div className="text-sm text-gray-600">{module.module_title}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">
                        No modules found for {userSemester || "current semester"}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Class name input - required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  name="class_name"
                  value={formData.class_name}
                  onChange={onClassNameInput || onInputChange}
                  placeholder="e.g., Calculus, Programming 101"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter a class name or select a module above
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher
            </label>
            <input
              type="text"
              name="teacher"
              value={formData.teacher}
              onChange={onInputChange}
              placeholder="e.g., Dr. Smith"
              className="w-full py-2 px-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onInputChange}
              placeholder="e.g., Room 101"
              className="w-full py-2 px-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day *
            </label>
            <select
              name="day"
              value={formData.day}
              onChange={onInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md"
              required
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={onInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={onInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => onColorSelect(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color.value
                      ? "border-gray-800"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.class_name}
              className="py-2 px-4 bg-primary text-white rounded-md font-medium disabled:opacity-70"
            >
              {isSubmitting ? "Adding..." : "Add Class"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddClassForm;
