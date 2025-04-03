
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellDot, MoreVertical } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { API_ROUTES, getSupabaseEdgeFunctionUrl } from "../api/routes";
import { useToast } from "../../hooks/use-toast";
import { MoreFeaturesMenu } from "../navigation/MoreFeaturesMenu";

interface DashboardHeaderProps {
  title?: string; // e.g., "Dashboard" or "Profile"
  showAvatar?: boolean;
}

const DashboardHeader = ({ title = "Dashboard", showAvatar = true }: DashboardHeaderProps) => {
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const getNotificationPreferences = async () => {
      if (user) {
        console.log("Fetching user notification preferences");
        const { data, error } = await supabase
          .from('profiles')
          .select('sms_notifications, phone_number')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching notification preferences:", error);
          return;
        }

        if (data) {
          console.log("Notification preferences:", data.sms_notifications);
          setSmsNotificationsEnabled(data.sms_notifications || false);
          setPhoneNumber(data.phone_number || "");
        }
      }
    };

    getNotificationPreferences();
  }, [user]);

  const toggleNotifications = async () => {
    if (!user || isToggling) return;

    console.log("Toggle SMS notifications clicked, current state:", smsNotificationsEnabled);
    setIsToggling(true);
    const previousState = smsNotificationsEnabled;
    // Optimistically update UI
    setSmsNotificationsEnabled(!previousState);

    try {
      const newState = !previousState;
      console.log("Making API call to toggle SMS notifications to:", newState);
      
      // Construct the Supabase Edge Function URL
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
        body: JSON.stringify({ enabled: newState })
      });

      console.log("API response status:", response.status);
      
      // Handle non-JSON responses
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
      
      // Send test SMS if SMS notifications are enabled
      if (newState && phoneNumber) {
        try {
          console.log("Sending test SMS to:", phoneNumber);
          
          // Call our edge function to send the test SMS
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
      console.error('Error toggling notifications:', error);
      // Revert state on error
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

  return (
    <header className="bg-gradient-to-b from-blue-50/90 to-white/90 shadow-sm">
      <div className="container-pad py-4">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <div className="flex items-center space-x-3">
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

            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                aria-label="More features"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {moreMenuOpen && (
                <MoreFeaturesMenu onClose={() => setMoreMenuOpen(false)} />
              )}
            </div>

            {showAvatar && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                <span className="text-primary text-xs font-medium">
                  You
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <div className="h-[1px] bg-gray-100"></div>
    </header>
  );
};

export default DashboardHeader;
