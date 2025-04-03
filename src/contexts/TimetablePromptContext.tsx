
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";
import TimetableSetupPrompt from "../components/timetable/TimetableSetupPrompt";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface TimetablePromptContextType {
  showPrompt: boolean;
  setShowPrompt: (show: boolean) => void;
  checkTimetableSetup: () => Promise<void>;
  dismissedForSession: boolean;
  setDismissedForSession: (dismissed: boolean) => void;
}

const TimetablePromptContext = createContext<TimetablePromptContextType | undefined>(undefined);

export function TimetablePromptProvider({ children }: { children: ReactNode }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissedForSession, setDismissedForSession] = useState(false);
  const { user } = useAuth();

  const checkTimetableSetup = async () => {
    if (!user || dismissedForSession) {
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
      console.log("Dismissed for session status:", dismissedForSession);
      
      // Only show the prompt if timetable_setup is explicitly false AND not dismissed for session
      if (data && data.timetable_setup === false && !dismissedForSession) {
        setShowPrompt(true);
      } else {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Error in checkTimetableSetup:", error);
    }
  };

  // Check timetable setup status when user changes or dismissal status changes
  useEffect(() => {
    if (user) {
      checkTimetableSetup();
    } else {
      setShowPrompt(false);
    }
  }, [user, dismissedForSession]);

  return (
    <TimetablePromptContext.Provider value={{ 
      showPrompt, 
      setShowPrompt, 
      checkTimetableSetup, 
      dismissedForSession, 
      setDismissedForSession 
    }}>
      {children}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Timetable Setup</DialogTitle>
          <TimetableSetupPrompt onClose={() => setShowPrompt(false)} />
        </DialogContent>
      </Dialog>
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
