
import { Link } from "react-router-dom";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "../ui/tooltip";

interface SidebarNavItemProps {
  item: {
    path: string;
    icon: JSX.Element;
    label: string;
  };
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarNavItem = ({ item, isCollapsed, isActive }: SidebarNavItemProps) => {
  return (
    <li key={item.path}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              className={`flex items-center py-2.5 px-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className={`${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              <span 
                className={`${isCollapsed ? 'hidden' : 'block'} transition-opacity duration-200 text-sm`}
              >
                {item.label}
              </span>
              {isActive && !isCollapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>
              )}
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

export default SidebarNavItem;
