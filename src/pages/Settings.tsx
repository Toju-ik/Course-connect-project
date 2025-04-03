import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Key, Bell, AlertCircle, Loader2, Trash2, Phone } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ROUTES, getSupabaseEdgeFunctionUrl } from "../components/api/routes";
import NavigationHeader from "../components/shared/NavigationHeader";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Settings = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Notification preferences state
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isTogglingSms, setIsTogglingSms] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  // Phone number dialog state
  const [phoneNumberDialogOpen, setPhoneNumberDialogOpen] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState<string>("");
  const [tempPhoneError, setTempPhoneError] = useState<string | null>(null);
  const [savingPhoneNumber, setSavingPhoneNumber] = useState(false);

  // Fetch user profile and notification preferences
  useEffect(() => {
    if (!user) return;

    async function getProfile() {
      try {
        setLoading(true);
        console.log("Fetching profile for user:", user.id);
        
        // Get the user's email
        setUserEmail(user.email);
        setProfileId(user.id);
        
        // Get the user's profile with notification preferences
        const { data, error } = await supabase
          .from('profiles')
          .select('sms_notifications, phone_number')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (data) {
          console.log('Profile data fetched:', data);
          setSmsNotifications(data.sms_notifications || false);
          setPhoneNumber(data.phone_number || "");
        } else {
          console.log('No profile data found');
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    getProfile();
  }, [user, toast]);

  const validatePhoneNumber = (phone: string): boolean => {
    setPhoneError(null);
    
    if (smsNotifications && !phone) {
      setPhoneError("Phone number is required for SMS notifications");
      return false;
    }
    
    if (phone && !phone.match(/^\+?[0-9]{10,15}$/)) {
      setPhoneError("Phone number should be in international format (e.g., +353891234567)");
      return false;
    }
    
    return true;
  };

  const validateTempPhoneNumber = (phone: string): boolean => {
    setTempPhoneError(null);
    
    if (!phone) {
      setTempPhoneError("Phone number is required for SMS notifications");
      return false;
    }
    
    if (!phone.match(/^\+?[0-9]{10,15}$/)) {
      setTempPhoneError("Phone number should be in international format (e.g., +353891234567)");
      return false;
    }
    
    return true;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    try {
      setUpdating(true);
      setError(null);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    } catch (error: any) {
      console.error("Error updating password:", error.message);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePhoneNumberSave = async () => {
    if (!validateTempPhoneNumber(tempPhoneNumber)) {
      return;
    }

    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    try {
      setSavingPhoneNumber(true);
      
      console.log("Updating phone number to:", tempPhoneNumber);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          phone_number: tempPhoneNumber
        })
        .eq('id', user.id)
        .select();
      
      if (error) {
        console.error("Error updating phone number:", error);
        throw error;
      }
      
      console.log("Phone number updated:", data);
      
      // Update local state
      setPhoneNumber(tempPhoneNumber);
      
      // Close dialog and reset temp value
      setPhoneNumberDialogOpen(false);
      
      toast({
        title: "Phone number updated",
        description: "Your phone number has been updated successfully."
      });
      
      // Send test SMS if SMS notifications are enabled
      if (smsNotifications) {
        try {
          console.log("Sending test SMS to:", tempPhoneNumber);
          
          const { data: smsData, error: smsError } = await supabase.functions.invoke('send-sms-notification', {
            body: { 
              to: tempPhoneNumber,
              message: "Your StudyBuddy SMS notifications have been enabled successfully! You will now receive important updates via SMS."
            }
          });
          
          if (smsError) {
            console.error("Error invoking SMS function:", smsError);
            toast({
              title: "SMS Test Failed",
              description: "Could not send test SMS. Your phone number was saved but we couldn't send a test message.",
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
      
    } catch (error: any) {
      console.error("Error updating phone number:", error);
      toast({
        title: "Error updating phone number",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSavingPhoneNumber(false);
    }
  };

  const toggleSmsNotifications = async () => {
    if (!user) {
      console.error("No authenticated user found");
      toast({
        title: "Authentication error",
        description: "You must be logged in to update settings",
        variant: "destructive"
      });
      return;
    }
    
    // If trying to enable SMS without a phone number, show the dialog
    if (!smsNotifications && !phoneNumber) {
      setPhoneNumberDialogOpen(true);
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }
    
    try {
      setIsTogglingSms(true);
      
      const newSmsState = !smsNotifications;
      console.log("Toggling SMS notifications to:", newSmsState);
      
      // Use the API endpoint to update the notification preference
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
        body: JSON.stringify({ enabled: newSmsState })
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
      
      // Update local state
      setSmsNotifications(newSmsState);
      
      toast({
        title: "Success",
        description: newSmsState ? 'SMS notifications enabled' : 'SMS notifications disabled',
      });
      
      // If SMS notifications were just enabled, send a test SMS
      if (newSmsState && phoneNumber) {
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
      
    } catch (error: any) {
      console.error("Error toggling SMS notifications:", error);
      // Revert state on error
      setSmsNotifications(!smsNotifications);
      toast({
        title: "Error saving notification preferences",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsTogglingSms(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      const success = await deleteAccount();
      
      if (success) {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted",
        });
        navigate('/');
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error.message);
      toast({
        variant: "destructive",
        title: "Delete account failed",
        description: error.message || "There was a problem deleting your account"
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <NavigationHeader 
        title="Account Settings" 
        showBackButton={true} 
        showCancelButton={false} 
        backPath="/dashboard"
      />
      
      <main className="container-pad py-8">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Security Settings */}
            <Card className="p-6">
              <div className="mb-4 flex items-center">
                <Key className="mr-2 h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="ml-3 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="mt-2 w-full"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </Card>
            
            {/* Notification Settings */}
            <Card className="p-6">
              <div className="mb-4 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive important notifications via SMS.
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={toggleSmsNotifications}
                    aria-label="SMS notifications"
                    disabled={isTogglingSms}
                  />
                </div>
                
                {(smsNotifications || phoneNumber) && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+353891234567"
                        value={phoneNumber}
                        readOnly
                        className={`${phoneError ? "border-red-500" : ""} flex-grow`}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setTempPhoneNumber(phoneNumber);
                          setTempPhoneError(null);
                          setPhoneNumberDialogOpen(true);
                        }}
                      >
                        Change
                      </Button>
                    </div>
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {phoneError}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your phone number in international format (e.g., +353891234567)
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Delete Account */}
            <Card className="p-6 md:col-span-2 border-red-200">
              <div className="mb-4 flex items-center">
                <Trash2 className="mr-2 h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
              </div>
              
              <p className="mb-4 text-gray-600">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                  >
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all of your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deletingAccount}
                    >
                      {deletingAccount ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Yes, delete my account"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </div>
        )}
      </main>

      {/* Phone Number Dialog */}
      <Dialog open={phoneNumberDialogOpen} onOpenChange={setPhoneNumberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phone Number Required</DialogTitle>
            <DialogDescription>
              To enable SMS notifications, please enter your phone number in international format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="tempPhoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="tempPhoneNumber"
              type="tel"
              placeholder="+353891234567"
              value={tempPhoneNumber}
              onChange={(e) => setTempPhoneNumber(e.target.value)}
              className={`mt-1 ${tempPhoneError ? "border-red-500" : ""}`}
            />
            {tempPhoneError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {tempPhoneError}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter your phone number in international format (e.g., +353891234567)
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPhoneNumberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePhoneNumberSave}
              disabled={savingPhoneNumber}
            >
              {savingPhoneNumber ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Enable SMS"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
