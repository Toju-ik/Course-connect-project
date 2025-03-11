
import { Menu, X } from "lucide-react";
import { SidebarContent } from "./SidebarContent";
import { useState, useEffect } from "react";

interface SidebarMobileProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  handleSignOut: () => Promise<void>;
  navItems: Array<{ path: string; icon: JSX.Element; label: string }>;
  currentPath: string;
}

const SidebarMobile = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  isCollapsed,
  toggleCollapse,
  handleSignOut,
  navItems,
  currentPath
}: SidebarMobileProps) => {
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath, setMobileMenuOpen]);

  // Mobile toggle button
  const mobileToggle = (
    <div className="md:hidden fixed top-4 left-4 z-30">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 bg-white rounded-md shadow-lg flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {mobileToggle}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-30 w-[250px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent 
          isCollapsed={false} // Always expanded on mobile
          toggleCollapse={toggleCollapse}
          handleSignOut={handleSignOut}
          navItems={navItems}
          currentPath={currentPath}
        />
      </aside>
    </>
  );
};

export default SidebarMobile;
