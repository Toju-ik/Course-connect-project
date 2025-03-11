
import { Home, ListTodo, Calendar, Settings, Archive, Clock, BookOpen, BarChart4, User } from "lucide-react";

export const useSidebarItems = () => {
  const navItems = [
    { path: "/dashboard", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { path: "/tasks", icon: <ListTodo className="w-5 h-5" />, label: "Tasks" },
    { path: "/archived-tasks", icon: <Archive className="w-5 h-5" />, label: "Archived Tasks" },
    { path: "/focus-timer", icon: <Clock className="w-5 h-5" />, label: "Focus Timer" },
    { path: "/flashcards", icon: <BookOpen className="w-5 h-5" />, label: "Flashcards" },
    { path: "/study-tracker", icon: <BarChart4 className="w-5 h-5" />, label: "Study Tracker" },
    { path: "/timetable", icon: <Calendar className="w-5 h-5" />, label: "Timetable" },
    { path: "/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
    { path: "/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ];

  return { navItems };
};
