
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useSignOut = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      // Clear all local session data
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
      
      // Force navigation to login page after signout
      navigate("/login", { replace: true });
      
      // Optional: Hard refresh the page to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing you out"
      });
    }
  };

  return { handleSignOut };
};
