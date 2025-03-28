import { Home, ListTodo, Timer, BookOpen, BarChart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: Timer, label: "Focus", path: "/focus-timer" },
    { icon: BookOpen, label: "Cards", path: "/flashcards" },
    { icon: BarChart, label: "Stats", path: "/study-tracker" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-indigo-600 border-t border-indigo-700">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                active ? "text-white font-semibold scale-105" : "text-indigo-200"
              }`}
            >
              <item.icon
                className={`w-6 h-6 transition-colors ${
                  active ? "text-white" : "text-indigo-200"
                }`}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
