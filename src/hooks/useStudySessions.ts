
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';
import { format } from 'date-fns';

interface StudySession {
  id: string;
  user_id: string;
  module_id: string | null;
  duration: number; // in minutes
  date: string;
  notes?: string;
  created_at?: string;
}

interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

interface StudyStats {
  totalMinutes: number;
  totalSessions: number;
  thisWeekMinutes: number;
  thisMonthMinutes: number;
}

export const useStudySessions = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StudyStats>({
    totalMinutes: 0,
    totalSessions: 0,
    thisWeekMinutes: 0,
    thisMonthMinutes: 0
  });
  const { toast } = useToast();
  
  // Fetch study sessions and modules
  const fetchData = useCallback(async () => {
    console.log('Fetching study sessions data...');
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        setIsLoading(false);
        return;
      }
      
      console.log('Authenticated user ID:', session.user.id);
      
      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('id, module_code, module_title');
        
      if (modulesError) {
        console.error('Error fetching modules:', modulesError);
        throw modulesError;
      }
      
      console.log('Fetched modules:', modulesData?.length || 0);
      setModules(modulesData || []);
      
      // Fetch study sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
        
      if (sessionsError) {
        console.error('Error fetching study sessions:', sessionsError);
        throw sessionsError;
      }
      
      console.log('Fetched study sessions:', sessionsData?.length || 0, sessionsData);
      setSessions(sessionsData || []);
      
      // Calculate stats
      if (sessionsData && sessionsData.length > 0) {
        const total = sessionsData.reduce((sum, session) => sum + session.duration, 0);
        
        // Get current date info for filtering
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisWeekMinutes = sessionsData
          .filter(s => new Date(s.date) >= startOfWeek)
          .reduce((sum, s) => sum + s.duration, 0);
          
        const thisMonthMinutes = sessionsData
          .filter(s => new Date(s.date) >= startOfMonth)
          .reduce((sum, s) => sum + s.duration, 0);
          
        setStats({
          totalMinutes: total,
          totalSessions: sessionsData.length,
          thisWeekMinutes,
          thisMonthMinutes
        });
        
        console.log('Study stats calculated:', {
          totalMinutes: total,
          totalSessions: sessionsData.length,
          thisWeekMinutes,
          thisMonthMinutes
        });
      } else {
        console.log('No study sessions found, resetting stats to zero');
        setStats({
          totalMinutes: 0,
          totalSessions: 0,
          thisWeekMinutes: 0,
          thisMonthMinutes: 0
        });
      }
    } catch (error) {
      console.error('Error fetching study data:', error);
      toast({
        title: "Error",
        description: "Failed to load study sessions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Create study session
  const createStudySession = async (moduleId: string | null, duration: number, date: string, notes?: string) => {
    console.log('Creating study session:', { moduleId, duration, date, notes });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      const newSession = {
        user_id: session.user.id,
        module_id: moduleId,
        duration,
        date,
        notes
      };
      
      console.log('Inserting study session with data:', newSession);
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([newSession])
        .select();
        
      if (error) {
        console.error('Supabase error creating session:', error);
        throw error;
      }
      
      console.log('Study session created successfully:', data);
      
      if (data) {
        setSessions(prev => [data[0], ...prev]);
        
        // Update stats
        setStats(prev => ({
          totalMinutes: prev.totalMinutes + duration,
          totalSessions: prev.totalSessions + 1,
          thisWeekMinutes: isThisWeek(date) ? prev.thisWeekMinutes + duration : prev.thisWeekMinutes,
          thisMonthMinutes: isThisMonth(date) ? prev.thisMonthMinutes + duration : prev.thisMonthMinutes
        }));
        
        toast({
          title: "Success",
          description: "Study session logged successfully!",
        });
        
        // Refresh data to ensure consistency
        fetchData();
        
        return data[0];
      }
    } catch (error: any) {
      console.error('Error creating study session:', error);
      toast({
        title: "Error",
        description: "Failed to log study session. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Helper functions to determine if a date is in current week/month
  const isThisWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return date >= startOfWeek;
  };
  
  const isThisMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };
  
  // Update study session
  const updateStudySession = async (id: string, moduleId: string | null, duration: number, date: string, notes?: string) => {
    console.log('Updating study session:', { id, moduleId, duration, date, notes });
    try {
      const updates = {
        module_id: moduleId,
        duration,
        date,
        notes
      };
      
      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      console.log('Study session updated successfully:', data);
      
      if (data) {
        setSessions(prev => 
          prev.map(s => s.id === id ? { ...s, ...updates } : s)
        );
        
        // Refresh data to update stats
        fetchData();
        
        toast({
          title: "Success",
          description: "Study session updated successfully!",
        });
        
        return data[0];
      }
    } catch (error: any) {
      console.error('Error updating study session:', error);
      toast({
        title: "Error",
        description: "Failed to update study session. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Delete study session
  const deleteStudySession = async (id: string) => {
    console.log('Deleting study session:', id);
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSessions(prev => {
        const sessionToRemove = prev.find(s => s.id === id);
        if (sessionToRemove) {
          // Update stats
          setStats(prevStats => ({
            totalMinutes: prevStats.totalMinutes - sessionToRemove.duration,
            totalSessions: prevStats.totalSessions - 1,
            thisWeekMinutes: isThisWeek(sessionToRemove.date) 
              ? prevStats.thisWeekMinutes - sessionToRemove.duration 
              : prevStats.thisWeekMinutes,
            thisMonthMinutes: isThisMonth(sessionToRemove.date)
              ? prevStats.thisMonthMinutes - sessionToRemove.duration
              : prevStats.thisMonthMinutes
          }));
        }
        return prev.filter(s => s.id !== id);
      });
      
      toast({
        title: "Success",
        description: "Study session deleted successfully!",
      });
      
      // Refresh data to ensure consistency
      fetchData();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting study session:', error);
      toast({
        title: "Error",
        description: "Failed to delete study session. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Log timer session automatically
  const logTimerSession = async (duration: number, moduleId?: string | null) => {
    console.log('Logging timer session:', { duration, moduleId });
    const today = format(new Date(), 'yyyy-MM-dd');
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session when logging timer session');
        throw new Error('You must be logged in to log study sessions');
      }
      
      const newSession = {
        user_id: session.user.id,
        module_id: moduleId || null,
        duration,
        date: today,
        notes: "Logged from Focus Timer"
      };
      
      console.log('Inserting timer session with data:', newSession);
      
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([newSession])
        .select();
        
      if (error) {
        console.error('Error logging timer session:', error);
        throw error;
      }
      
      console.log('Timer session logged successfully:', data);
      
      if (data && data.length > 0) {
        // Update local state
        setSessions(prev => [data[0], ...prev]);
        
        // Update stats
        setStats(prev => ({
          totalMinutes: prev.totalMinutes + duration,
          totalSessions: prev.totalSessions + 1,
          thisWeekMinutes: prev.thisWeekMinutes + duration, // Today is always in this week
          thisMonthMinutes: prev.thisMonthMinutes + duration // Today is always in this month
        }));
        
        toast({
          title: "Study Session Recorded",
          description: `Your ${duration}-minute study session has been saved.`,
        });
        
        return data[0];
      }
      
      return null;
    } catch (error: any) {
      console.error('Error logging timer session:', error);
      toast({
        title: "Warning",
        description: "Couldn't save your study session. Your progress wasn't recorded.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  return {
    sessions,
    modules,
    isLoading,
    stats,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    logTimerSession,
    refreshSessions: fetchData
  };
};
