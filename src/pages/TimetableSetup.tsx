
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import NavigationHeader from "../components/shared/NavigationHeader";

// Import the setup components
import AcademicYear from "../components/timetable-setup/AcademicYear";
import Semester from "../components/timetable-setup/Semester";
import ModuleGroup from "../components/timetable-setup/ModuleGroup";
import ModuleSelection from "../components/timetable-setup/ModuleSelection";
import SetupComplete from "../components/timetable-setup/SetupComplete";

type Step = "year" | "semester" | "group" | "modules" | "complete";

interface Profile {
  student_id: string;
  department: string;
  academic_year: string;
  module_group: string;
  semester: string;
  course_id: string;
}

// Retrieve stored form data - may contain registration data from previous step
const getStoredFormData = () => {
  const storedData = localStorage.getItem('registerFormData');
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error('Error parsing stored form data', e);
    }
  }
  return null;
};

const TimetableSetup = () => {
  const [currentStep, setCurrentStep] = useState<Step>("year");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if registration was completed
  const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);

  // Form data state
  const [formData, setFormData] = useState({
    academicYear: "",
    semester: "",
    moduleGroup: "",
    selectedModules: [] as string[],
  });

  useEffect(() => {
    // Check if there's stored registration data
    const registrationData = getStoredFormData();
    if (registrationData) {
      setRegistrationComplete(registrationData.registrationComplete || false);
    }

    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setProfile(data);
          
          // If timetable is already set up, redirect to dashboard
          if (data.timetable_setup) {
            navigate("/dashboard");
          }
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your profile. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const handleAcademicYearSelect = (year: string) => {
    setFormData(prev => ({
      ...prev,
      academicYear: year
    }));
    setCurrentStep("semester");
  };

  const handleSemesterSelect = (semester: string) => {
    setFormData(prev => ({
      ...prev,
      semester
    }));
    setCurrentStep("group");
  };

  const handleGroupSelect = (group: string) => {
    setFormData(prev => ({
      ...prev,
      moduleGroup: group
    }));
    setCurrentStep("modules");
  };

  const handleModulesSelect = (moduleIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedModules: moduleIds
    }));
    handleSetupCompletion();
  };

  const handleBack = () => {
    // Navigate to the previous step based on current step
    switch (currentStep) {
      case "semester":
        setCurrentStep("year");
        break;
      case "group":
        setCurrentStep("semester");
        break;
      case "modules":
        setCurrentStep("group");
        break;
      case "year":
        // If registration was complete and we're at the first timetable step,
        // we could navigate back to registration complete
        if (registrationComplete) {
          navigate("/register");
        }
        break;
      default:
        break;
    }
  };

  const handleCancel = async () => {
    if (!registrationComplete) {
      // If registration wasn't fully completed, go back to registration
      navigate("/register");
    } else {
      // If registration was completed, sign out and go to login
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  const handleSetupCompletion = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Update user profile with academic year, semester, and group
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          academic_year: formData.academicYear,
          semester: formData.semester,
          module_group: formData.moduleGroup,
          timetable_setup: true
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Insert module selections
      if (formData.selectedModules.length > 0) {
        const moduleSelections = formData.selectedModules.map(moduleId => ({
          user_id: user.id,
          module_id: moduleId
        }));

        const { error: modulesError } = await supabase
          .from("user_module_selections")
          .insert(moduleSelections);

        if (modulesError) throw modulesError;
      }
      
      setCurrentStep("complete");
      
      // Mark registration as fully complete and timetable as set up
      const registrationData = getStoredFormData();
      if (registrationData) {
        localStorage.setItem('registerFormData', JSON.stringify({
          ...registrationData,
          registrationComplete: true,
          timetableSetupComplete: true
        }));
      }
      
    } catch (error: any) {
      console.error("Error saving timetable setup:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your timetable. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "year":
        return "Select Academic Year";
      case "semester":
        return "Select Semester";
      case "group":
        return "Select Module Group";
      case "modules":
        return "Select Your Modules";
      case "complete":
        return "Setup Complete";
      default:
        return "Timetable Setup";
    }
  };

  const renderStepIndicator = () => {
    const steps = ["year", "semester", "group", "modules", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="mb-6 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div 
              key={step}
              className={`w-2 h-2 rounded-full ${
                index <= currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {currentStep !== "complete" && (
        <NavigationHeader 
          title={getStepTitle()} 
          showBackButton={true}
          onBack={handleBack}
          showCancelButton={true}
        />
      )}

      <div className="flex-1 flex flex-col px-5 py-6">
        {renderStepIndicator()}
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === "year" && (
              <AcademicYear 
                courseId={profile?.course_id} 
                departmentName={profile?.department || ""}
                onSelect={handleAcademicYearSelect} 
              />
            )}
            
            {currentStep === "semester" && (
              <Semester 
                onSelect={handleSemesterSelect}
                onBack={() => setCurrentStep("year")}
              />
            )}
            
            {currentStep === "group" && (
              <ModuleGroup 
                onSelect={handleGroupSelect}
                onBack={() => setCurrentStep("semester")}
              />
            )}
            
            {currentStep === "modules" && (
              <ModuleSelection 
                courseId={profile?.course_id}
                academicYear={formData.academicYear}
                semester={formData.semester}
                moduleGroup={formData.moduleGroup}
                onSubmit={handleModulesSelect}
                onBack={() => setCurrentStep("group")}
              />
            )}
            
            {currentStep === "complete" && (
              <SetupComplete />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TimetableSetup;
