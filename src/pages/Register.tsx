import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

// Import hooks and utilities
import { useRegistrationForm, FormData, Step } from "../hooks/useRegistrationForm";
import { handleRegistration, getStepTitle } from "../utils/registrationUtils";

// Import components
import WelcomeScreen from "../components/register/WelcomeScreen";
import AccountDetails from "../components/register/AccountDetails";
import DepartmentSelection from "../components/register/DepartmentSelection";
import CourseSelection from "../components/register/CourseSelection";
import StudyDetails from "../components/register/StudyDetails";
import ModuleSelection from "../components/register/ModuleSelection";
import RegisterComplete from "../components/register/RegisterComplete";
import NavigationHeader from "../components/shared/NavigationHeader";
import StepIndicator from "../components/register/StepIndicator";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    generalError,
    setGeneralError,
    goBack,
    resetForm
  } = useRegistrationForm();

  // Handle welcome screen start - make sure we start fresh
  const handleWelcomeStart = () => {
    // Clear any stale data before moving to the first step
    resetForm();
    setCurrentStep("account");
    console.log("Starting new registration - form data reset");
  };

  const handleAccountDetailsSubmit = (studentId: string, password: string, phoneNumber: string) => {
    setFormData(prev => ({
      ...prev,
      studentId,
      password,
      phoneNumber
    }));
    setCurrentStep("department");
  };

  const handleDepartmentSelect = (departmentId: string, departmentName: string) => {
    setFormData(prev => ({
      ...prev,
      departmentId,
      departmentName
    }));
    setCurrentStep("course");
  };

  const handleCourseSelect = (courseCode: string, courseName: string, courseId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCourse: courseCode,
      courseId: courseId,    // Store the actual UUID
      courseName
    }));
    setCurrentStep("details");
  };

  const handleStudyDetailsSubmit = (academicYear: string, semester: string, moduleGroup: string) => {
    console.log("Study details submitted:", { academicYear, semester, moduleGroup });
    
    // Update the form data with the study details
    setFormData(prev => ({
      ...prev,
      academicYear,
      semester,
      moduleGroup
    }));
    
    // Proceed to the module selection step
    setCurrentStep("modules");
  };

  const handleModuleSelectionSubmit = (selectedModules: { id: string; credits: number; description?: string; }[]) => {
    console.log("Module selection submitted:", { selectedModules });
    
    // Create an updated form data object with the latest values
    const updatedFormData: FormData = {
      ...formData,
      selectedModules
    };
    
    // Update the state 
    setFormData(updatedFormData);
    
    // Pass the updated form data directly to handleRegistration
    handleRegistration(
      updatedFormData, 
      setIsSubmitting, 
      setGeneralError, 
      () => {
        // Mark registration as complete
        setFormData(prev => ({
          ...prev,
          registrationComplete: true
        }));
        
        setCurrentStep("complete");
      }
    );
  };

  const handleCancel = async () => {
    // Clear stored form data
    localStorage.removeItem('registerFormData');
    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {currentStep !== "welcome" && currentStep !== "complete" && (
        <NavigationHeader 
          title={getStepTitle(currentStep)} 
          showBackButton={currentStep !== "account"}
          onBack={goBack}
          showCancelButton={true}
        />
      )}

      <div className="flex-1 flex flex-col px-5 py-6">
        <StepIndicator currentStep={currentStep} />

        {generalError && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="h-5 w-5 text-red-400">!</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{generalError}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === "welcome" && (
              <WelcomeScreen 
                onStart={handleWelcomeStart} 
              />
            )}
            
            {currentStep === "account" && (
              <AccountDetails 
                initialValues={{
                  studentId: formData.studentId,
                  password: formData.password,
                  phoneNumber: formData.phoneNumber
                }}
                onSubmit={handleAccountDetailsSubmit} 
              />
            )}
            
            {currentStep === "department" && (
              <DepartmentSelection 
                onSelect={handleDepartmentSelect} 
              />
            )}
            
            {currentStep === "course" && (
              <CourseSelection 
                departmentId={formData.departmentId}
                departmentName={formData.departmentName}
                onSelect={handleCourseSelect}
                onBack={() => setCurrentStep("department")} 
              />
            )}
            
            {currentStep === "details" && (
              <StudyDetails
                initialValues={{
                  academicYear: formData.academicYear,
                  semester: formData.semester,
                  moduleGroup: formData.moduleGroup
                }}
                onSubmit={handleStudyDetailsSubmit}
                onBack={() => setCurrentStep("course")} 
              />
            )}
            
            {currentStep === "modules" && (
              <ModuleSelection
                courseId={formData.courseId}  // Use the stored UUID instead of the course code
                selectedSemester={formData.semester}
                initialSelectedModules={formData.selectedModules}
                onSubmit={handleModuleSelectionSubmit}
                onBack={() => setCurrentStep("details")}
              />
            )}
            
            {currentStep === "complete" && (
              <RegisterComplete 
                formData={formData}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Register;
