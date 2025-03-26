import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';

interface StudySession {
  id: string;
  user_id: string;
  module_id: string | null;
  duration: number;
  date: string;
  notes?: string;
  created_at?: string;
}

interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

export const useStudySessions = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('No active session');
          setIsLoading(false);
          return;
        }

        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('id, module_code, module_title');
        if (modulesError) throw modulesError;
        setModules(modulesData || []);

        const { data: sessionsData, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('date', { ascending: false });
        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load study sessions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const createStudySession = async (
    moduleId: string | null,
    duration: number,
    date: string,
    notes?: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const newSession = {
        user_id: session.user.id,
        module_id: moduleId,
        duration,
        date,
        notes,
      };

      const { data, error } = await supabase
        .from('study_sessions')
        .insert([newSession])
        .select();

      if (error) throw error;

      if (data) {
        setSessions(prev => [data[0], ...prev]);
        toast({
          title: "Success",
          description: "Study session logged successfully!",
        });
        return data[0];
      }
    } catch (error) {
      console.error('Error creating study session:', error);
      toast({
        title: "Error",
        description: "Failed to log study session. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStudySession = async (
    id: string,
    moduleId: string | null,
    duration: number,
    date: string,
    notes?: string
  ) => {
    try {
      const updates = { module_id: moduleId, duration, date, notes };

      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data) {
        setSessions(prev =>
          prev.map(s => (s.id === id ? { ...s, ...updates } : s))
        );
        toast({
          title: "Success",
          description: "Study session updated successfully!",
        });
        return data[0];
      }
    } catch (error) {
      console.error('Error updating study session:', error);
      toast({
        title: "Error",
        description: "Failed to update study session. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteStudySession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Study session deleted successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error deleting study session:', error);
      toast({
        title: "Error",
        description: "Failed to delete study session. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logTimerSession = async (duration: number, moduleId?: string | null) => {
    const today = new Date().toISOString().split('T')[0];
    return await createStudySession(moduleId || null, duration, today, "Logged from Focus Timer");
  };

  // ✅ Add this method to push external session into local state
  const addSessionToState = (session: StudySession) => {
    setSessions(prev => [session, ...prev]);
  };

  return {
    sessions,
    modules,
    isLoading,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    logTimerSession,
    addSessionToState, // ← ✅ exposed
  };
};
