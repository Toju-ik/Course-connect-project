
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Calendar, UserPlus, Users } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const links = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { to: "/tasks", icon: <ListTodo className="h-5 w-5" />, label: "Tasks" },
    { to: "/timetable", icon: <Calendar className="h-5 w-5" />, label: "Timetable" },
    { to: "/collaboration", icon: <UserPlus className="h-5 w-5" />, label: "Groups" },
    { to: "/friends", icon: <Users className="h-5 w-5" />, label: "Friends" }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 md:hidden">
      <div className="flex justify-between items-center">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center justify-center ${
              isActive(link.to) ? 'text-primary' : 'text-gray-500'
            }`}
          >
            {link.icon}
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
