
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { useTimetablePrompt } from "../contexts/TimetablePromptContext";

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkTimetableSetup } = useTimetablePrompt();

  const checkUserExists = async (studentId: string) => {
    if (!studentId.match(/^B00\d{6}$/)) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('student_id')
        .eq('student_id', studentId)
        .maybeSingle();
      
      setIsExistingUser(!!data);
    } catch (error) {
      console.error("Error checking user:", error);
      setIsExistingUser(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Validate student ID format
      if (!studentId.match(/^B00\d{6}$/)) {
        setError("Student ID must be in format B00XXXXXX (e.g., B00123456)");
        return;
      }
      
      const email = `${studentId}@mytudublin.ie`;
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError.message);
        
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid student ID or password. Please check your credentials and try again.");
        } else {
          throw signInError;
        }
      }
      
      toast({
        title: "Login successful!",
        description: "Welcome to your dashboard.",
      });
      
      // Check if the user needs to set up their timetable
      await checkTimetableSetup();
      
      // Always navigate to dashboard - the route guard will redirect to timetable if needed
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error in login:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="py-4 px-4 flex items-center">
        <Link to="/" className="text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col px-5 pt-8 pb-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            StudyBuddy
          </h2>
          {isExistingUser === true && (
            <p className="text-gray-600">Welcome back!</p>
          )}
          {isExistingUser === false && (
            <p className="text-gray-600">Sign in to your account</p>
          )}
          {isExistingUser === null && (
            <p className="text-gray-600">Sign in to continue</p>
          )}
        </div>

        <div className="w-full mx-auto">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <input
                  id="studentId"
                  type="text"
                  required
                  pattern="B00[0-9]{6}"
                  title="Enter your Student ID in the format B00XXXXXX (where X are numbers)"
                  className="input-field w-full py-3 px-4 bg-gray-100 border-gray-200 rounded-lg"
                  placeholder="Student ID (B00XXXXXX)"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    checkUserExists(e.target.value);
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter only your Student ID (e.g., B00123456)
              </p>
            </div>

            <div>
              <input
                id="password"
                type="password"
                required
                className="input-field w-full py-3 px-4 bg-gray-100 border-gray-200 rounded-lg"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary-hover"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
