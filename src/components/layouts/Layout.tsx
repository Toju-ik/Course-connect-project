import { Outlet } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Layout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Course Connect</h1>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? <Sun className="text-yellow-300 h-6 w-6" /> : <Moon className="text-gray-800 h-6 w-6" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <Outlet /> {/* This renders the current page content */}
      </main>
    </div>
  );
};

export default Layout;
