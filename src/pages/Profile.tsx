
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- Added import
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { User as LucideUser, Upload, Save, AlertCircle, Loader2, Trophy, Zap, History, Phone, ChevronLeft } from "lucide-react"; // <-- Added ChevronLeft
import { useToast } from "../hooks/use-toast";
import { useGamification } from "../hooks/useGamification";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoinTransaction } from "../types/gamification";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileData {
  student_id: string;
  department: string;
  academic_year: string;
  module_group: string;
  avatar_url?: string;
  full_name?: string;
  phone_number?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // <-- Initialize navigate
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Phone number dialog state
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [tempPhoneError, setTempPhoneError] = useState<string | null>(null);
  
  // Get gamification data
  const { 
    coins, 
    streak, 
    transactions, 
    loading: gamificationLoading 
  } = useGamification();

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data as ProfileData);
          setFullName(data.full_name || "");
          setPhoneNumber(data.phone_number || "");
          
          if (data.avatar_url) {
            const { data: avatarData } = await supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            
            setAvatarUrl(avatarData.publicUrl);
          }
        }
      } catch (error: any) {
        console.error("Error loading profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be less than 2MB");
        return;
      }
      
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    setTempPhoneError(null);
    
    if (phone && !phone.match(/^\+?[0-9]{10,15}$/)) {
      setTempPhoneError("Phone number should be in international format (e.g., +353891234567)");
      return false;
    }
    
    return true;
  };

  const handlePhoneUpdate = async () => {
    if (!validatePhoneNumber(tempPhoneNumber)) {
      return;
    }

    if (!user) return;
    
    try {
      setSavingPhone(true);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone_number: tempPhoneNumber
        })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      setPhoneNumber(tempPhoneNumber);
      setPhoneDialogOpen(false);
      
      toast({
        title: "Phone number updated",
        description: "Your phone number has been updated successfully."
      });
      
    } catch (error: any) {
      console.error("Error updating phone number:", error.message);
      setTempPhoneError(error.message);
    } finally {
      setSavingPhone(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      // Check phone number format if provided
      if (phoneNumber && !phoneNumber.match(/^\+?[0-9]{10,15}$/)) {
        setPhoneError("Phone number should be in international format (e.g., +353891234567)");
        setUpdating(false);
        return;
      } else {
        setPhoneError(null);
      }
      
      // Upload avatar if changed
      let avatar_url = profile.avatar_url;
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;
        
        // Check if avatars bucket exists, create if not
        const { data: bucketData } = await supabase.storage.getBucket('avatars');
        const avatarBucketExists = !!bucketData;
        
        if (!avatarBucketExists) {
          await supabase.storage.createBucket('avatars', {
            public: true
          });
        }
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        avatar_url = filePath;
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url,
          phone_number: phoneNumber
        })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container-pad py-6 flex items-center">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Back to Dashboard"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account details and preferences</p>
          </div>
        </div>
      </header>
      
      <main className="container-pad py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <div className="card flex flex-col items-center p-6">
            <div className="relative mb-4">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="h-32 w-32 rounded-full object-cover border-4 border-primary/10"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                  <LucideUser className="h-16 w-16 text-primary/40" />
                </div>
              )}
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover"
              >
                <Upload className="h-5 w-5" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            
            <h2 className="text-xl font-semibold">
              {profile?.full_name || `Student ${profile?.student_id}`}
            </h2>
            <p className="text-gray-600">{profile?.student_id}@mytudublin.ie</p>
            
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium">{profile?.department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Year:</span>
                <span className="font-medium">{profile?.academic_year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Group:</span>
                <span className="font-medium">{profile?.module_group}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone:</span>
                {phoneNumber ? (
                  <span className="font-medium">{phoneNumber}</span>
                ) : (
                  <button 
                    onClick={() => {
                      setTempPhoneNumber("");
                      setTempPhoneError(null);
                      setPhoneDialogOpen(true);
                    }}
                    className="text-primary hover:underline flex items-center"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Add phone
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Edit Form and Gamification Section */}
          <div className="space-y-6 md:col-span-2">
            {/* Gamification Status */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Gamification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {gamificationLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Total Coins</h3>
                          <p className="text-2xl font-bold text-primary">{coins}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Current Streak</h3>
                          <p className="text-2xl font-bold text-primary">{streak} days</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                        <History className="h-4 w-4" />
                        Recent Transactions
                      </h3>
                      {transactions.length > 0 ? (
                        <div className="max-h-[140px] overflow-y-auto">
                          {transactions.slice(0, 5).map((transaction: CoinTransaction) => (
                            <div 
                              key={transaction.id} 
                              className="mb-2 border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  {transaction.description}
                                </span>
                                <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(transaction.created_at).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm text-gray-500">No recent transactions</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Edit Form Card */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <p className="ml-3 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={updateProfile}>
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-field mt-1"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={`${profile?.student_id}@mytudublin.ie`}
                      className="input-field mt-1 bg-gray-50"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed as it's linked to your student ID
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      {phoneNumber && (
                        <button 
                          type="button"
                          onClick={() => {
                            setTempPhoneNumber(phoneNumber);
                            setTempPhoneError(null);
                            setPhoneDialogOpen(true);
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`input-field mt-1 ${phoneError ? 'border-red-500' : ''}`}
                      placeholder="+353891234567"
                    />
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
                  
                  <button
                    type="submit"
                    className="button-primary mt-2 flex items-center"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Phone Number Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Phone Number</DialogTitle>
            <DialogDescription>
              Enter your phone number in international format to receive SMS notifications.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="dialogPhoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="dialogPhoneNumber"
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
              onClick={() => setPhoneDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePhoneUpdate}
              disabled={savingPhone}
            >
              {savingPhone ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Phone Number"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
