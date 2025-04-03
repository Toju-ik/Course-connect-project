
import React from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  LineChart,
  Layers,
  Timer,
  UserPlus,
  Settings,
  Users,
} from 'lucide-react';

export function useSidebarItems() {
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: <ListTodo className="h-5 w-5" />,
    },
    {
      title: "Timetable",
      href: "/timetable",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Study Tracker",
      href: "/study-tracker",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      title: "Flashcards",
      href: "/flashcards",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      title: "Focus Timer",
      href: "/focus-timer",
      icon: <Timer className="h-5 w-5" />,
    },
    {
      title: "Collaboration",
      href: "/collaboration",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      title: "Friends",
      href: "/friends",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return items;
}
