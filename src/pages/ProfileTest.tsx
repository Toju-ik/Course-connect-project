
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, LogOut } from "lucide-react";

interface ProfileData {
  id: string;
  course_id: string | null;
  academic_year: string | null;
  semester: string | null;
  module_group: string | null;
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
}

interface CourseDisplay {
  id: string;
  course_code: string;
  course_name: string;
}

const ProfileTest = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDisplay, setCourseDisplay] = useState<CourseDisplay | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [academicYear, setAcademicYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [moduleGroup, setModuleGroup] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");

  useEffect(() => {
    fetchProfileData();
    fetchCourses();
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log("Fetching profile data for user:", user.id);

      // Get basic profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("id, course_id, academic_year, semester, module_group")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetched profile data:", data);
      setProfileData(data);
      
      // Set form state - ensuring empty strings, not nulls
      setAcademicYear(data.academic_year || "");
      setSemester(data.semester || "");
      setModuleGroup(data.module_group || "");
      
      // If we have a course_id, fetch the complete course details
      if (data.course_id) {
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id, course_code, course_name")
          .eq("id", data.course_id)
          .single();
          
        if (!courseError && courseData) {
          console.log("Fetched course data:", courseData);
          setCourseDisplay(courseData);
          setCourseId(courseData.course_code);
        } else {
          console.error("Error fetching course details:", courseError);
          setCourseId(data.course_id);
        }
      } else {
        setCourseId("");
        setCourseDisplay(null);
      }
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, course_code, course_name");

      if (error) {
        console.error("Error fetching courses:", error);
        return;
      }

      console.log("Fetched courses:", data);
      setCourses(data || []);
    } catch (error) {
      console.error("Error in fetchCourses:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setUpdating(true);
      
      // Find the actual course id from the course code
      let actualCourseId = courseId;
      const selectedCourse = courses.find(c => c.course_code === courseId);
      
      if (selectedCourse) {
        actualCourseId = selectedCourse.id;
      }
      
      // Log the update payload
      const updatePayload = {
        academic_year: academicYear,
        semester: semester,
        module_group: moduleGroup,
        course_id: actualCourseId,
      };
      
      console.log("Updating profile with payload:", updatePayload);

      const { data, error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: "Failed to update profile: " + error.message,
          variant: "destructive",
        });
        return;
      }

      // Log the response
      console.log("Profile update response:", data);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Refresh data to verify persistence
      await fetchProfileData();
      
      // Verify the semester was correctly saved
      const { data: verifyData, error: verifyError } = await supabase
        .from("profiles")
        .select("semester, academic_year, module_group, course_id")
        .eq("id", user.id)
        .single();
        
      if (verifyError) {
        console.error("Error verifying profile update:", verifyError);
      } else {
        console.log("Verification of profile update:", verifyData);
        if (verifyData.semester !== semester) {
          console.warn("Semester mismatch! Selected:", semester, "Saved:", verifyData.semester);
        }
        if (verifyData.academic_year !== academicYear) {
          console.warn("Academic year mismatch! Selected:", academicYear, "Saved:", verifyData.academic_year);
        }
        if (verifyData.module_group !== moduleGroup) {
          console.warn("Module group mismatch! Selected:", moduleGroup, "Saved:", verifyData.module_group);
        }
      }
    } catch (error) {
      console.error("Error in handleUpdateProfile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out. Please log back in to verify profile persistence.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const semesters = ["Semester 1", "Semester 2"];
  const years = ["1", "2", "3", "4"];
  const groups = ["G1", "G2", "G3", "G4"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Profile Persistence Test</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Current Profile Data</h2>
            
            <div className="mb-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium">
                  {courseDisplay ? (
                    `${courseDisplay.course_code} - ${courseDisplay.course_name}`
                  ) : (
                    "Not set"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Academic Year</p>
                <p className="font-medium">{profileData?.academic_year ? `Year ${profileData.academic_year}` : "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="font-medium">{profileData?.semester || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Module Group</p>
                <p className="font-medium">{profileData?.module_group || "Not set"}</p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h2 className="text-lg font-medium mb-4">Update Profile</h2>
              <p className="text-sm text-gray-500 mb-4">
                Change these values, then log out and log back in to verify persistence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.course_code}>
                        {course.course_code} - {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Academic Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        Year {year}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    data-testid="semester-select" /* Added for easier testing */
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module Group
                  </label>
                  <select
                    value={moduleGroup}
                    onChange={(e) => setModuleGroup(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    data-testid="module-group-select"
                  >
                    <option value="">Select Module Group</option>
                    {groups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                data-testid="update-profile-button" /* Added for easier testing */
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-700">Test Instructions</h3>
              <ol className="list-decimal pl-5 mt-2 text-sm text-blue-700 space-y-1">
                <li>Update one or more profile fields above</li>
                <li>Click the Update Profile button</li>
                <li>Check the console logs to confirm the update</li>
                <li>Click Logout</li>
                <li>Log back in with your credentials</li>
                <li>Return to this page to verify the changes persisted</li>
              </ol>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-700">Debug Information</h3>
              <p className="text-sm text-green-700 mt-1">
                Semester value stored in database: <span className="font-mono">{profileData?.semester || "null"}</span> (type: {typeof profileData?.semester})
              </p>
              <p className="text-sm text-green-700 mt-1">
                Academic Year stored in database: <span className="font-mono">{profileData?.academic_year || "null"}</span> (type: {typeof profileData?.academic_year})
              </p>
              <p className="text-sm text-green-700 mt-1">
                Module Group stored in database: <span className="font-mono">{profileData?.module_group || "null"}</span> (type: {typeof profileData?.module_group})
              </p>
              <p className="text-sm text-green-700 mt-1">
                Course ID stored in database: <span className="font-mono">{profileData?.course_id || "null"}</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileTest;
