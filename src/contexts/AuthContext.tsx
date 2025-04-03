
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '../hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id);
      
      // Update session and user state
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Handle specific auth events
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        // Using a timeout to avoid potential React state update loops
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 0);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      // Use scope: 'global' to clear all sessions across all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
      
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing you out"
      });
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Call the database function to delete the user
      const { data, error } = await supabase.rpc('delete_user', {
        user_id: user.id
      });
      
      if (error) {
        console.error('Error deleting account:', error);
        toast({
          variant: "destructive",
          title: "Delete account failed",
          description: error.message || "There was a problem deleting your account"
        });
        return false;
      }
      
      // Sign out the user after successful deletion
      await signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted"
      });
      
      return data || false;
    } catch (error: any) {
      console.error('Error in deleteAccount:', error);
      toast({
        variant: "destructive",
        title: "Delete account failed",
        description: error.message || "There was a problem deleting your account"
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
