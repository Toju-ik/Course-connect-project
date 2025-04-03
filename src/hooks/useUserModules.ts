
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";
import { Module } from "../types/module";

export interface UserProfile {
  course_id: string;
  academic_year: string;
  semester: string;
  department?: string;
}

export function useUserModules() {
  const [userModules, setUserModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view modules.",
          variant: "destructive"
        });
        return;
      }
      
      // Fetch the user's profile with course and semester info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('course_id, academic_year, semester, department')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return;
      }
      
      if (profile) {
        setUserProfile(profile);
        console.log("User profile fetched:", profile);
        console.log("Current semester:", profile.semester);
        
        // Fetch modules based on user profile and semester
        let moduleQuery = supabase
          .from('modules')
          .select('module_code, module_title, id, semester');
        
        if (profile.course_id) {
          moduleQuery = moduleQuery.eq('course_id', profile.course_id);
        }
        
        if (profile.semester) {
          moduleQuery = moduleQuery.eq('semester', profile.semester);
          console.log("Filtering modules by semester:", profile.semester);
        }
        
        const { data: moduleData, error: moduleError } = await moduleQuery;
        
        if (moduleError) {
          console.error("Error fetching modules:", moduleError);
          // Fall back to department-based filtering if module query fails
          let departmentModuleQuery = supabase
            .from('modules')
            .select('module_code, module_title, id, semester');
            
          if (profile.department) {
            departmentModuleQuery = departmentModuleQuery
              .ilike('module_code', `${profile.department.substring(0, 4)}%`)
              .eq('semester', profile.semester);
          }
          
          const { data: deptModuleData } = await departmentModuleQuery;
          
          if (deptModuleData && deptModuleData.length > 0) {
            console.log(`Found ${deptModuleData.length} department modules for semester ${profile.semester}`);
            const formattedModules = deptModuleData
              .filter(module => module.semester === profile.semester)
              .map(module => ({
                id: module.id,
                code: module.module_code,
                name: module.module_title
              }));
            setUserModules(formattedModules);
          } else {
            // Fallback to default modules
            console.log("No modules found for the current semester, using defaults");
            setUserModules([
              { id: "COMP101-id", code: "COMP101", name: "Programming Fundamentals" },
              { id: "MATH202-id", code: "MATH202", name: "Advanced Mathematics" },
              { id: "COMP203-id", code: "COMP203", name: "Data Structures" }
            ]);
          }
        } else if (moduleData && moduleData.length > 0) {
          // Filter modules to only include those matching the user's semester
          const semesterFilteredModules = moduleData.filter(module => 
            module.semester === profile.semester
          );
          
          console.log(`Found ${moduleData.length} modules, filtered to ${semesterFilteredModules.length} matching semester ${profile.semester}`);
          
          // Format modules for the UI from successful query
          const formattedModules = semesterFilteredModules.map(module => ({
            id: module.id || `${module.module_code}-id`, // Ensure id is always defined
            code: module.module_code,
            name: module.module_title
          }));
          
          setUserModules(formattedModules);
        } else {
          // Fallback to default modules if no modules found
          console.log("No modules found for the current semester, using defaults");
          setUserModules([
            { id: "COMP101-id", code: "COMP101", name: "Programming Fundamentals" },
            { id: "MATH202-id", code: "MATH202", name: "Advanced Mathematics" },
            { id: "COMP203-id", code: "COMP203", name: "Data Structures" }
          ]);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to refresh the modules, useful when semester changes
  const refreshModules = () => {
    fetchUserData();
  };

  return {
    userModules,
    userProfile,
    isLoading,
    refreshModules
  };
}
