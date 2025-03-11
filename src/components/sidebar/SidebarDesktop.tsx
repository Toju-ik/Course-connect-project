
import { SidebarContent } from "./SidebarContent";

interface SidebarDesktopProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  handleSignOut: () => Promise<void>;
  navItems: Array<{ path: string; icon: JSX.Element; label: string }>;
  currentPath: string;
}

const SidebarDesktop = ({
  isCollapsed,
  toggleCollapse,
  handleSignOut,
  navItems,
  currentPath
}: SidebarDesktopProps) => {
  return (
    <aside
      className={`hidden md:block bg-white shadow-md transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[70px]' : 'w-[250px]'
      } fixed inset-y-0 left-0 z-20`}
    >
      <SidebarContent 
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        handleSignOut={handleSignOut}
        navItems={navItems}
        currentPath={currentPath}
      />
    </aside>
  );
};

export default SidebarDesktop;
