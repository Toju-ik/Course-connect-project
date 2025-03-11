
import { Home, ListTodo, Timer, BookOpen, BarChart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: Timer, label: "Focus", path: "/focus-timer" },
    { icon: BookOpen, label: "Cards", path: "/flashcards" },
    { icon: BarChart, label: "Stats", path: "/study-tracker" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive(item.path) ? "text-primary" : "text-gray-500"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-primary" : "text-gray-500"}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
