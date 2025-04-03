
import { useState, useEffect } from "react";

// Type definitions
export type Step = "welcome" | "account" | "department" | "course" | "details" | "modules" | "complete";

export interface FormData {
  studentId: string;
  password: string;
  phoneNumber?: string;
  departmentId: string;
  departmentName: string;
  selectedCourse: string;    // This will store the course code
  courseId: string;          // This will store the actual UUID
  courseName: string;
  academicYear: string;
  semester: string;
  moduleGroup: string;
  selectedModules: {
    id: string;
    credits: number;
    description?: string;
  }[];
  registrationComplete: boolean;
}

// Clear localStorage and return default form data
export const getInitialFormData = (): FormData => {
  // Clear any existing registration data from localStorage
  localStorage.removeItem('registerFormData');
  
  console.log("Registration form data cleared from localStorage");
  
  // Return default empty form data
  return {
    studentId: "",
    password: "",
    phoneNumber: "",
    departmentId: "",
    departmentName: "",
    selectedCourse: "",
    courseId: "",         // Now including the course UUID
    courseName: "",
    academicYear: "",
    semester: "",
    moduleGroup: "",
    selectedModules: [],
    registrationComplete: false
  };
};

// Try to retrieve form data from local storage only if we're in the middle of registration
export const getStoredFormData = (): FormData => {
  const storedData = localStorage.getItem('registerFormData');
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      console.log("Retrieved stored form data:", parsedData);
      return {
        ...parsedData,
        phoneNumber: parsedData.phoneNumber || "",
        academicYear: parsedData.academicYear || "",
        semester: parsedData.semester || "",
        moduleGroup: parsedData.moduleGroup || "",
        selectedModules: parsedData.selectedModules || [],
        courseId: parsedData.courseId || ""  // Ensure courseId is included
      };
    } catch (e) {
      console.error('Error parsing stored form data', e);
    }
  }
  
  // If no stored data or error parsing, return default empty form data
  return getInitialFormData();
};

export const useRegistrationForm = (initialStep: Step = "welcome") => {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Form data state initialized based on current step
  const [formData, setFormData] = useState<FormData>(() => {
    // Only use stored data if we're not at the welcome screen (meaning registration is in progress)
    // Otherwise, clear localStorage and start fresh
    return currentStep === "welcome" ? getInitialFormData() : getStoredFormData();
  });

  // Ensure localStorage is cleared when component mounts and we're at the welcome screen
  useEffect(() => {
    if (currentStep === "welcome") {
      localStorage.removeItem('registerFormData');
      console.log("Registration form reset on welcome screen");
      
      // Reset form data state to defaults
      setFormData(getInitialFormData());
    }
  }, [currentStep]);

  // Update local storage when form data changes
  useEffect(() => {
    console.log("Updating localStorage with form data:", formData);
    localStorage.setItem('registerFormData', JSON.stringify(formData));
  }, [formData]);

  // Navigation functions
  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const goBack = () => {
    // Navigate to the previous step based on current step
    switch (currentStep) {
      case "department":
        setCurrentStep("account");
        break;
      case "course":
        setCurrentStep("department");
        break;
      case "details":
        setCurrentStep("course");
        break;
      case "modules":
        setCurrentStep("details");
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    localStorage.removeItem('registerFormData');
    setFormData(getInitialFormData());
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    generalError,
    setGeneralError,
    goToStep,
    goBack,
    resetForm
  };
};
