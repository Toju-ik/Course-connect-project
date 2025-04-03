
import { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock, Activity } from "lucide-react";

interface MoreFeaturesMenuProps {
  onClose: () => void;
}

export const MoreFeaturesMenu = ({ onClose }: MoreFeaturesMenuProps) => {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      name: "Flashcards",
      description: "Create and study flashcards",
      path: "/flashcards",
      icon: BookOpen,
    },
    {
      name: "Focus Timer",
      description: "Stay focused with pomodoro timer",
      path: "/focus-timer",
      icon: Clock,
    },
    {
      name: "Study Tracker",
      description: "Monitor your study progress",
      path: "/study-tracker",
      icon: Activity,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      className="absolute right-0 top-12 z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-2">
        <h3 className="text-sm font-medium text-gray-500 px-3 py-2">Additional Features</h3>
        <div className="space-y-1">
          {features.map((feature) => {
            const isActive = location.pathname === feature.path;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={onClose}
              >
                <div className={`p-2 rounded-full ${isActive ? 'bg-primary/20' : 'bg-gray-100'}`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.name}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
