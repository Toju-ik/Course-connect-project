
import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Timetable = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [classSchedules, setClassSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchClassSchedules();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchClassSchedules = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_class_schedules")
        .select("*")
        .eq("user_id", user?.id)
        .order("start_time");

      if (error) {
        console.error("Error fetching class schedules:", error);
        return;
      }
      
      setClassSchedules(data || []);
    } catch (error) {
      console.error("Error fetching class schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getClassesByDay = (day: string) => {
    return classSchedules.filter((cls) => cls.day === day);
  };

  const navigateToTimetableSetup = () => {
    navigate("/timetable");
  };

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysClasses = getClassesByDay(today);

  return (
    <section className="card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Weekly Timetable</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={navigateToTimetableSetup}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Add class"
              type="button"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isCollapsed ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              DAYS.map((day) => {
                const dayClasses = getClassesByDay(day);
                return (
                  <div key={day}>
                    <h4 className="font-medium text-gray-700 mb-2">
                      {day} {day === today && (
                        <span className="text-primary text-sm">(Today)</span>
                      )}
                    </h4>
                    {dayClasses.length > 0 ? (
                      <div className="space-y-2">
                        {dayClasses.map((classItem) => (
                          <div
                            key={classItem.id}
                            className="p-3 rounded-lg border border-gray-200"
                          >
                            <div className="font-medium">{classItem.class_name}</div>
                            <div className="text-sm text-gray-600">
                              {classItem.start_time} - {classItem.end_time} • {classItem.location}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No classes scheduled</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={navigateToTimetableSetup}
            className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-center font-medium transition-colors"
          >
            View Full Timetable
          </button>
        </div>
      </div>
    </section>
  );
};

export default Timetable;
