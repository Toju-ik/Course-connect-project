import { useState, useEffect } from "react";
import { ChevronLeft, Bell, User, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const MobileHeader = ({ title = "", showBackButton = false }: MobileHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (profileData?.avatar_url) {
          const { data: avatarData } = await supabase.storage
            .from("avatars")
            .getPublicUrl(profileData.avatar_url);
          setAvatarUrl(avatarData.publicUrl);
        }
      }
    };

    getProfile();
  }, [user]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleGoBack = () => navigate(-1);
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="relative w-full z-40 bg-indigo-600 h-16 shadow-md">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-0">
          {showBackButton ? (
            <button onClick={handleGoBack} className="p-2 -ml-2 rounded-full hover:bg-indigo-500">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          ) : avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-sm font-medium text-white truncate">{title}</span>
        </div>

        {/* Center: App Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-white font-bold text-base tracking-wide">
          Course Connect
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-indigo-500">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-indigo-500">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div className="absolute right-3 top-16 z-50 w-40 py-2 bg-white rounded-md shadow-lg border border-gray-100">
            <button
              onClick={() => {
                navigate("/settings");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            >
              Settings
            </button>
            <button
              onClick={() => {
                navigate("/favorites");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            >
              Favorites
            </button>
            <button
              onClick={() => {
                handleSignOut();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
            >
              Sign Out
            </button>
          </div>
          <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
        </>
      )}
    </header>
  );
};

export default MobileHeader;
