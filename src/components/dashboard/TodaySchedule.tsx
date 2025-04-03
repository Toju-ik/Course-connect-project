import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Clock, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { useTimetable } from "../../contexts/TimetableContext";
import { useTasks, Task, Module } from "../../hooks/useTasks";
import { motion } from "framer-motion";

const TodaySchedule = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const { modules, isLoading: timetableLoading } = useTimetable();
  const { tasks, userModules, isLoading: tasksLoading } = useTasks();
  
  // Get weekday names
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Get current day index (0-6)
  const currentDayIndex = new Date().getDay();
  
  useEffect(() => {
    // Set active day to today initially
    setActiveDay(currentDayIndex);
  }, [currentDayIndex]);
  
  // Filter modules for the active day
  const filterModulesByDay = (dayIndex: number) => {
    const dayName = weekdays[dayIndex];
    return modules.filter(module => module.day === dayName).sort((a, b) => {
      const timeA = a.time.split('-')[0]; // Start time
      const timeB = b.time.split('-')[0]; // Start time
      return timeA.localeCompare(timeB);
    });
  };
  
  // Get tasks that are due today
  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).sort((a, b) => {
      const priorityRank = { high: 0, medium: 1, low: 2 };
      const priorityA = a.priority ? priorityRank[a.priority] : 3;
      const priorityB = b.priority ? priorityRank[b.priority] : 3;
      return priorityA - priorityB;
    });
  };
  
  // Create a combined schedule of modules and tasks for a day
  const getCombinedSchedule = (dayIndex: number) => {
    const dayModules = filterModulesByDay(dayIndex);
    const todayTasks = dayIndex === currentDayIndex ? getTodayTasks() : [];
    
    return {
      modules: dayModules,
      tasks: todayTasks
    };
  };
  
  // Go to next day
  const nextDay = () => {
    setActiveDay((prev) => (prev + 1) % 7);
  };
  
  // Go to previous day
  const prevDay = () => {
    setActiveDay((prev) => (prev - 1 + 7) % 7);
  };
  
  // Get priority icon and color for tasks
  const getPriorityInfo = (priority?: string) => {
    switch (priority) {
      case 'high':
        return { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, bg: 'bg-red-50', text: 'text-red-700' };
      case 'medium':
        return { icon: <AlertCircle className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-50', text: 'text-orange-700' };
      case 'low':
        return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, bg: 'bg-green-50', text: 'text-green-700' };
      default:
        return { icon: <CheckCircle className="w-4 h-4 text-gray-500" />, bg: 'bg-gray-50', text: 'text-gray-700' };
    }
  };
  
  // Find module name from module_id
  const getModuleNameById = (moduleId?: string) => {
    if (!moduleId) return "";
    const foundModule = userModules.find(mod => mod.id === moduleId);
    return foundModule ? `${foundModule.code}` : "";
  };
  
  const isLoading = timetableLoading || tasksLoading;
  const { modules: dayModules, tasks: dayTasks } = getCombinedSchedule(activeDay);
  const isToday = activeDay === currentDayIndex;

  return (
    <section className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isCollapsed ? "Expand schedule" : "Collapse schedule"}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                isCollapsed ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            {!isCollapsed && (
              <div className="mb-4 relative">
                {/* Carousel navigation */}
                <div className="flex items-center justify-between mb-3">
                  <button 
                    onClick={prevDay}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  </button>
                  
                  <h4 className="font-medium">
                    {weekdays[activeDay]}
                    {isToday && <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">Today</span>}
                  </h4>
                  
                  <button 
                    onClick={nextDay}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                  </button>
                </div>
                
                {/* Schedule items */}
                <motion.div
                  key={activeDay}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {dayModules.length === 0 && dayTasks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Calendar className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No schedule for this day</p>
                    </div>
                  ) : (
                    <>
                      {dayModules.map((module) => (
                        <div
                          key={module.id}
                          className="p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start">
                            <Clock className="w-4 h-4 text-primary mt-0.5 mr-2" />
                            <div>
                              <h4 className="font-medium">
                                {module.code}: {module.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {module.time} • {module.room}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isToday && dayTasks.map((task) => {
                        const priorityInfo = getPriorityInfo(task.priority);
                        const moduleName = getModuleNameById(task.module_id);
                        return (
                          <div
                            key={task.id}
                            className={`p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors ${priorityInfo.bg} bg-opacity-40`}
                          >
                            <div className="flex items-start">
                              {priorityInfo.icon}
                              <div className="ml-2">
                                <h4 className="font-medium flex items-center">
                                  <span>Task: {task.title}</span>
                                  {task.priority && (
                                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${priorityInfo.bg} ${priorityInfo.text}`}>
                                      {task.priority}
                                    </span>
                                  )}
                                </h4>
                                {moduleName && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Module: {moduleName}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 mt-1">
                                  Due Today
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </motion.div>
              </div>
            )}
            
            {isCollapsed && (
              <>
                {dayModules.length > 0 || dayTasks.length > 0 ? (
                  <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-primary mr-2" />
                      <div>
                        <span className="text-sm text-gray-500">
                          {isToday ? "Today" : weekdays[activeDay]}:
                        </span>
                        <span className="font-medium ml-1">
                          {dayModules.length > 0 
                            ? `${dayModules.length} class${dayModules.length !== 1 ? 'es' : ''}` 
                            : 'No classes'}
                        </span>
                        {isToday && dayTasks.length > 0 && (
                          <span className="font-medium ml-1">
                            • {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} due
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No schedule for {isToday ? "today" : weekdays[activeDay]}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaySchedule;
