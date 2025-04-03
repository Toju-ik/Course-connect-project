
import { ChevronLeft, ChevronRight, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "../ui/tooltip";
import SidebarNavItem from "./SidebarNavItem";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface SidebarContentProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  handleSignOut: () => Promise<void>;
  navItems: Array<{ path: string; icon: JSX.Element; label: string }>;
  currentPath: string;
}

interface UserProfile {
  student_id: string;
  full_name?: string;
  avatar_url?: string;
}

export const SidebarContent = ({
  isCollapsed,
  toggleCollapse,
  handleSignOut,
  navItems,
  currentPath
}: SidebarContentProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const getProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('student_id, full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setProfile(data);
          
          if (data.avatar_url) {
            const { data: avatarData } = await supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            
            setAvatarUrl(avatarData.publicUrl);
          }
        }
      };
      
      getProfile();
    }
  }, [user]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="py-6 px-4 flex items-center justify-between">
          <div className={`${isCollapsed ? 'hidden' : 'block'} transition-opacity duration-200`}>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Course Connect</h2>
          </div>
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="mt-2 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <SidebarNavItem 
                key={item.path}
                item={item}
                isCollapsed={isCollapsed}
                isActive={currentPath === item.path}
              />
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t mt-auto px-2 py-4">
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 transition-all hover:bg-gray-100">
            <Link to="/profile" className="flex items-center flex-1 min-w-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className={`w-8 h-8 rounded-full ${isCollapsed ? 'mx-auto' : 'mr-2'}`}
                />
              ) : (
                <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-2'}`}>
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
              
              {!isCollapsed && (
                <div className="truncate">
                  <div className="font-medium text-sm text-gray-800 truncate">
                    {profile?.full_name || `Student ${profile?.student_id}`}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {profile?.student_id}
                  </div>
                </div>
              )}
            </Link>
            
            {!isCollapsed && (
              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/settings" className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600">
                      <SettingsIcon className="w-4 h-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top">Settings</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleSignOut}
                      className="p-1.5 rounded-md hover:bg-gray-200 text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Sign out</TooltipContent>
                </Tooltip>
              </div>
            )}
            
            {isCollapsed && (
              <div className="flex flex-col space-y-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/settings" className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600">
                      <SettingsIcon className="w-4 h-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleSignOut}
                      className="p-1.5 rounded-md hover:bg-gray-200 text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Sign out</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};
