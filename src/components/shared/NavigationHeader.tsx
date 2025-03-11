
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showCancelButton?: boolean;
}

const NavigationHeader = ({
  title,
  showBackButton = false,
  onBack,
  showCancelButton = true,
}: NavigationHeaderProps) => {
  const navigate = useNavigate();

  const handleCancel = async () => {
    // Sign out the user if they're authenticated
    await supabase.auth.signOut();
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
      <div>
        {showBackButton ? (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
        ) : (
          <div className="w-10">{/* Placeholder for alignment */}</div>
        )}
      </div>
      
      <div className="text-center">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      {showCancelButton ? (
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-10">{/* Placeholder for alignment */}</div>
      )}
    </div>
  );
};

export default NavigationHeader;
