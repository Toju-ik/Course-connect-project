import { useState, useEffect } from "react";
import { ChevronLeft, Bell, BellDot, User, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { API_ROUTES, getSupabaseEdgeFunctionUrl } from "../api/routes";
import { useToast } from "../../hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { BookOpen, Clock, Activity } from "lucide-react";

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const MobileHeader = ({ title = "", showBackButton = false }: MobileHeaderProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        console.log("Fetching user profile data");
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('avatar_url, sms_notifications, phone_number')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        if (profileData) {
          console.log("Profile data:", profileData);
          
          if (profileData.avatar_url) {
            const { data: avatarData } = await supabase.storage
              .from('avatars')
              .getPublicUrl(profileData.avatar_url);
            setAvatarUrl(avatarData.publicUrl);
          }
          
          setSmsNotificationsEnabled(profileData.sms_notifications || false);
          setPhoneNumber(profileData.phone_number || "");
        }
      }
    };

    getProfile();
  }, [user]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const toggleNotifications = async () => {
    if (!user || isToggling) return;
    
    console.log("Toggle SMS notifications clicked, current state:", smsNotificationsEnabled);
    
    setIsToggling(true);
    const previousState = smsNotificationsEnabled;
    
    setSmsNotificationsEnabled(!previousState);
    
    try {
      const newState = !previousState;
      console.log("Making API call to toggle SMS notifications to:", newState);
      
      const apiUrl = getSupabaseEdgeFunctionUrl(API_ROUTES.TOGGLE_NOTIFICATIONS);
      console.log("API URL:", apiUrl);
      
      if (!apiUrl) {
        throw new Error('Failed to construct API URL. Check console for details.');
      }
      
      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes.data.session?.access_token;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log("Auth token available:", !!token);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          enabled: newState
        }),
      });
      
      console.log("API response status:", response.status);
      
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        console.log("API response data:", responseData);
      } catch (e) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error(`Invalid response from server: ${responseText}`);
      }
      
      if (!response.ok) {
        throw new Error(responseData.message || `Server responded with status: ${response.status}`);
      }
      
      toast({
        title: "Success",
        description: newState ? 'SMS notifications enabled' : 'SMS notifications disabled',
      });
      
      if (newState && phoneNumber) {
        try {
          console.log("Sending test SMS to:", phoneNumber);
          
          const { data: smsData, error: smsError } = await supabase.functions.invoke('send-sms-notification', {
            body: { 
              to: phoneNumber,
              message: "Your StudyBuddy SMS notifications have been enabled successfully! You will now receive important updates via SMS."
            }
          });
          
          if (smsError) {
            console.error("Error invoking SMS function:", smsError);
            toast({
              title: "SMS Test Failed",
              description: "Could not send test SMS. Please check your phone number and try again.",
              variant: "destructive"
            });
          } else {
            console.log("SMS function response:", smsData);
            toast({
              title: "SMS Test Sent",
              description: "A test SMS has been sent to your phone number."
            });
          }
        } catch (smsError: any) {
          console.error("Error invoking SMS function:", smsError.message);
        }
      }
      
    } catch (error) {
      console.error('Error toggling SMS notifications:', error);
      
      setSmsNotificationsEnabled(previousState);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update notification settings',
      });
    } finally {
      setIsToggling(false);
    }
  };

  const additionalFeatures = [
    { 
      name: "Flashcards", 
      path: "/flashcards", 
      icon: <BookOpen className="h-4 w-4" />,
      description: "Create and study flashcards"
    },
    { 
      name: "Focus Timer", 
      path: "/focus-timer", 
      icon: <Clock className="h-4 w-4" />,
      description: "Stay focused with pomodoro timer" 
    },
    { 
      name: "Study Tracker", 
      path: "/study-tracker", 
      icon: <Activity className="h-4 w-4" />,
      description: "Monitor your study progress" 
    }
  ];

  return (
    <header className="relative w-full z-40 bg-gradient-to-b from-blue-50/90 to-white/90 h-14 shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {showBackButton ? (
          <button
            onClick={handleGoBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        ) : (
          avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              onClick={() => navigate('/profile')}
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <User className="w-4 h-4 text-primary" />
            </div>
          )
        )}
        <h1 className="text-base font-semibold text-gray-900">
          {title}
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleNotifications}
            disabled={isToggling}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isToggling ? 'opacity-50' : ''
            } ${
              smsNotificationsEnabled 
                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            aria-label={smsNotificationsEnabled ? 'Disable SMS notifications' : 'Enable SMS notifications'}
          >
            {smsNotificationsEnabled ? (
              <BellDot className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>More Features</DropdownMenuLabel>
              {additionalFeatures.map((feature) => (
                <DropdownMenuItem 
                  key={feature.path}
                  onClick={() => navigate(feature.path)}
                  className="flex items-center gap-2 py-2 cursor-pointer"
                >
                  <div className={`p-1.5 rounded-full ${location.pathname === feature.path ? 'bg-primary/20' : 'bg-gray-100'}`}>
                    {feature.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{feature.name}</span>
                    <span className="text-xs text-gray-500">{feature.description}</span>
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              
              <DropdownMenuItem 
                onClick={() => navigate('/settings')}
                className="cursor-pointer"
              >
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => navigate('/favorites')}
                className="cursor-pointer"
              >
                Favorites
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 cursor-pointer"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
