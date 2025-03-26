import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { User as LucideUser, Upload, Save, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  student_id: string;
  department: string;
  academic_year: string;
  module_group: string;
  avatar_url?: string;
  full_name?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch profile data when component mounts
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
          setProfile(data);
          setFullName(data.full_name || "");
          if (data.avatar_url) {
            const { data: avatarData } = await supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            setAvatarUrl(avatarData.publicUrl);
          }
        }
      } catch (error: any) {
        console.error("Error loading profile:", error.message);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user]);

  // Handle avatar file selection
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

  // Update profile on form submission
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      setUpdating(true);
      setError(null);
      let avatar_url = profile.avatar_url;

      // Upload new avatar if one was selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;
        // Ensure the avatars bucket exists
        const { data: bucketData } = await supabase.storage.getBucket('avatars');
        const avatarBucketExists = !!bucketData;
        if (!avatarBucketExists) {
          await supabase.storage.createBucket('avatars', { public: true });
        }
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
        if (uploadError) {
          throw uploadError;
        }
        avatar_url = filePath;
      }

      // Update the profile record with new full name and avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });

      // Reload profile data after update
      const { data: updatedData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!fetchError && updatedData) {
        setProfile(updatedData);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Navigate back to the dashboard
  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <header className="bg-white shadow">
        <div className="container-pad py-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account details and preferences</p>
          </div>
        </div>
      </header>
      
      <main className="container-pad py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="card flex flex-col items-center p-6 bg-white shadow rounded-lg">
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
            </div>
          </div>
          
          {/* Edit Form */}
          <div className="card md:col-span-2 p-6 bg-white shadow rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Edit Profile</h2>
            
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex items-center">
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
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
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
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-50"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed as it's linked to your student ID.
                </p>
              </div>
              
              <button
                type="submit"
                className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
