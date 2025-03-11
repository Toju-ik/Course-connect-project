
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";
import TimetableSetupPrompt from "../components/timetable/TimetableSetupPrompt";

interface TimetablePromptContextType {
  showPrompt: boolean;
  setShowPrompt: (show: boolean) => void;
  checkTimetableSetup: () => Promise<void>;
}

const TimetablePromptContext = createContext<TimetablePromptContextType | undefined>(undefined);

export function TimetablePromptProvider({ children }: { children: ReactNode }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const { user } = useAuth();

  const checkTimetableSetup = async () => {
    if (!user) {
      setShowPrompt(false);
      return;
    }

    try {
      console.log("Checking timetable setup for user:", user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("timetable_setup")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking timetable setup:", error);
        return;
      }

      console.log("Timetable setup status:", data?.timetable_setup);
      
      // Only show the prompt if timetable_setup is explicitly false
      // This prevents showing it when the value is null or undefined
      if (data && data.timetable_setup === false) {
        setShowPrompt(true);
      } else {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Error in checkTimetableSetup:", error);
    }
  };

  // Check timetable setup status when user changes
  useEffect(() => {
    if (user) {
      checkTimetableSetup();
    } else {
      setShowPrompt(false);
    }
  }, [user]);

  return (
    <TimetablePromptContext.Provider value={{ showPrompt, setShowPrompt, checkTimetableSetup }}>
      {children}
      {showPrompt && <TimetableSetupPrompt onClose={() => setShowPrompt(false)} />}
    </TimetablePromptContext.Provider>
  );
}

export function useTimetablePrompt() {
  const context = useContext(TimetablePromptContext);
  if (context === undefined) {
    throw new Error("useTimetablePrompt must be used within a TimetablePromptProvider");
  }
  return context;
}
