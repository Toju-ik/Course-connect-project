
import { supabase } from "../lib/supabase";
import { FormData } from "../hooks/useRegistrationForm";

export const handleRegistration = async (
  updatedFormData: FormData,
  setIsSubmitting: (value: boolean) => void,
  setGeneralError: (error: string | null) => void,
  onSuccess: () => void
) => {
  try {
    setIsSubmitting(true);
    setGeneralError(null);
    
    const email = `${updatedFormData.studentId}@mytudublin.ie`;
    
    console.log("Registration data being sent:", {
      email,
      courseId: updatedFormData.courseId,
      academicYear: updatedFormData.academicYear || "",
      semester: updatedFormData.semester || "",
      moduleGroup: updatedFormData.moduleGroup || "",
      phoneNumber: updatedFormData.phoneNumber || ""
    });
    
    // Sign up the user with Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: updatedFormData.password,
      options: {
        data: {
          student_id: updatedFormData.studentId,
          department: updatedFormData.departmentName,
          academic_year: updatedFormData.academicYear || "",
          module_group: updatedFormData.moduleGroup || "",
          semester: updatedFormData.semester || "",
          phone_number: updatedFormData.phoneNumber || ""
        }
      }
    });

    if (signUpError) throw signUpError;
    
    console.log("User created successfully, auth data:", data);

    // If we got the user data, update the profile with the course ID and explicitly set semester
    if (data?.user) {
      // Use the courseId we have saved from CourseSelection component
      const courseId = updatedFormData.courseId;
      
      if (!courseId) {
        console.error("No course ID found in form data");
        throw new Error("Course information is missing");
      }
      
      console.log("Using course ID for profile update:", courseId);
      
      // Create update payload with explicit semester value and course ID
      const profileUpdatePayload = {
        course_id: courseId, // Use the UUID directly
        timetable_setup: false,
        academic_year: updatedFormData.academicYear || "",
        semester: updatedFormData.semester || "",
        module_group: updatedFormData.moduleGroup || "",
        phone_number: updatedFormData.phoneNumber || ""
      };
      
      console.log("Updating profile with payload:", profileUpdatePayload);
      
      const { data: profileData, error: updateError } = await supabase
        .from('profiles')
        .update(profileUpdatePayload)
        .eq('id', data.user.id)
        .select();

      if (updateError) throw updateError;
      
      console.log("Profile updated successfully:", profileData);
      
      // If the user has selected modules, store them in the user_module_selections table
      if (updatedFormData.selectedModules && updatedFormData.selectedModules.length > 0) {
        console.log("Processing module selections:", updatedFormData.selectedModules);
        
        // Insert each selected module
        for (const module of updatedFormData.selectedModules) {
          console.log("Inserting module selection:", module);
          
          const { data: insertData, error: moduleError } = await supabase
            .from('user_module_selections')
            .insert({
              user_id: data.user.id,
              module_id: module.id
            })
            .select();
            
          if (moduleError) {
            console.error(`Error saving module selection ${module.id}:`, moduleError);
          } else {
            console.log(`Successfully saved module selection:`, insertData);
          }
        }
        
        console.log(`Saved ${updatedFormData.selectedModules.length} module selections for user ${data.user.id}`);
      } else {
        console.log("No modules selected for this user");
      }
      
      // Verify the semester was correctly saved
      const { data: verifyData, error: verifyError } = await supabase
        .from("profiles")
        .select("semester, academic_year, module_group, course_id")
        .eq("id", data.user.id)
        .single();
        
      if (verifyError) {
        console.error("Error verifying profile update:", verifyError);
      } else {
        console.log("Verification of profile update:", verifyData);
        if (verifyData.semester !== updatedFormData.semester) {
          console.warn("Semester mismatch! Selected:", updatedFormData.semester, "Saved:", verifyData.semester);
        }
        if (verifyData.academic_year !== updatedFormData.academicYear) {
          console.warn("Academic year mismatch! Selected:", updatedFormData.academicYear, "Saved:", verifyData.academic_year);
        }
        if (verifyData.module_group !== updatedFormData.moduleGroup) {
          console.warn("Module group mismatch! Selected:", updatedFormData.moduleGroup, "Saved:", verifyData.module_group);
        }
        if (verifyData.course_id !== updatedFormData.courseId) {
          console.warn("Course ID mismatch! Selected:", updatedFormData.courseId, "Saved:", verifyData.course_id);
        }
      }
    }

    onSuccess();
    
  } catch (error: any) {
    console.error('Error:', error.message);
    
    // Handle specific errors
    if (error.message.includes("User already registered")) {
      setGeneralError("A user with this email already exists. Please log in instead.");
    } else {
      setGeneralError(error.message);
    }
  } finally {
    setIsSubmitting(false);
  }
};

export const getStepTitle = (currentStep: string) => {
  switch (currentStep) {
    case "welcome":
      return "Create Account";
    case "account":
      return "Account Details";
    case "department":
      return "Select Discipline";
    case "course":
      return "Select Course";
    case "details":
      return "Study Details";
    case "modules":
      return "Choose Your Modules";
    case "complete":
      return "Registration Complete";
    default:
      return "Create Account";
  }
};
