
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";
import { useSidebarItems } from "./useSidebarItems";
import { useSignOut } from "./useSignOut";

interface SidebarProps {
  isMobile?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar = ({ isMobile = false, onCollapse }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { navItems } = useSidebarItems();
  const { handleSignOut } = useSignOut();
  
  // Expand sidebar on larger screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Notify parent component when collapse state changes
  useEffect(() => {
    onCollapse?.(isCollapsed);
  }, [isCollapsed, onCollapse]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <SidebarMobile 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        handleSignOut={handleSignOut}
        navItems={navItems}
        currentPath={location.pathname}
      />
      <SidebarDesktop 
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        handleSignOut={handleSignOut}
        navItems={navItems}
        currentPath={location.pathname}
      />
    </>
  );
};

export default Sidebar;
