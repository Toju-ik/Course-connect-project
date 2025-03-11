
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";

export const useSignOut = () => {
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
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
