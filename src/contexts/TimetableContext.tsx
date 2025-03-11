
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface Module {
  id: string;
  code: string;
  name: string;
  day: string;
  time: string;
  room: string;
}

interface TimetableContextProps {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  refreshTimetable: () => Promise<void>;
  addModule: (module: Module) => Promise<void>;
  updateModule: (id: string, updates: Partial<Module>) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
}

const TimetableContext = createContext<TimetableContextProps | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetableData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // First get the user's profile info including the new semester column
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('course_id, academic_year, semester')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Continue anyway - we'll try to get modules
      }
      
      // Fetch user's selected modules with any customizations
      const { data: userModules, error: userModulesError } = await supabase
        .from('user_module_selections')
        .select(`
          id,
          custom_start_time,
          custom_end_time,
          custom_room,
          custom_day_of_week,
          color,
          module_id,
          course_modules(*)
        `)
        .eq('user_id', user.id);

      if (userModulesError) throw userModulesError;

      if (userModules && userModules.length > 0) {
        const formattedModules = userModules.map((userModule: any) => {
          const moduleData = userModule.course_modules;
          
          // Use custom values if provided, otherwise fall back to original values
          return {
            id: userModule.id,
            code: moduleData.module_code,
            name: moduleData.module_name,
            day: userModule.custom_day_of_week || moduleData.day_of_week,
            time: userModule.custom_start_time && userModule.custom_end_time
              ? `${userModule.custom_start_time}-${userModule.custom_end_time}`
              : `${moduleData.start_time}-${moduleData.end_time}`,
            room: userModule.custom_room || moduleData.room
          };
        });

        setModules(formattedModules);
      } else {
        setModules([]);
      }
    } catch (err: any) {
      console.error("Error fetching timetable:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetableData();
  }, [user]);

  const addModule = async (module: Module) => {
    if (!user) return;

    try {
      setError(null);
      
      // Insert the module as a user selection
      const { error: insertError } = await supabase
        .from('user_module_selections')
        .insert({
          user_id: user.id,
          module_id: module.id,
          custom_day_of_week: module.day !== "default" ? module.day : null,
          custom_start_time: module.time ? module.time.split('-')[0] : null,
          custom_end_time: module.time ? module.time.split('-')[1] : null,
          custom_room: module.room !== "default" ? module.room : null
        });

      if (insertError) throw insertError;
      
      await fetchTimetableData();
    } catch (err: any) {
      console.error("Error adding module:", err.message);
      setError(err.message);
    }
  };

  const updateModule = async (id: string, updates: Partial<Module>) => {
    if (!user) return;

    try {
      setError(null);
      
      const updatesForDB: any = {};
      
      if (updates.day) updatesForDB.custom_day_of_week = updates.day;
      if (updates.room) updatesForDB.custom_room = updates.room;
      
      if (updates.time) {
        const [start, end] = updates.time.split('-');
        updatesForDB.custom_start_time = start;
        updatesForDB.custom_end_time = end;
      }
      
      const { error: updateError } = await supabase
        .from('user_module_selections')
        .update(updatesForDB)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      
      await fetchTimetableData();
    } catch (err: any) {
      console.error("Error updating module:", err.message);
      setError(err.message);
    }
  };

  const deleteModule = async (id: string) => {
    if (!user) return;

    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('user_module_selections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      
      await fetchTimetableData();
    } catch (err: any) {
      console.error("Error deleting module:", err.message);
      setError(err.message);
    }
  };

  const contextValue: TimetableContextProps = {
    modules,
    isLoading,
    error,
    refreshTimetable: fetchTimetableData,
    addModule,
    updateModule,
    deleteModule
  };

  return (
    <TimetableContext.Provider value={contextValue}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error("useTimetable must be used within a TimetableProvider");
  }
  return context;
};
