
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Book, X, AlertCircle } from "lucide-react";

interface ModuleSelection {
  id: string;
  module_id: string;
  user_id: string;
  created_at: string;
  module_details?: {
    module_code: string;
    module_title: string;
    credits: number;
    description?: string;
  };
}

const ModuleSelectionTest = () => {
  const { user } = useAuth();
  const [moduleSelections, setModuleSelections] = useState<ModuleSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeSuccess, setRemoveSuccess] = useState<string | null>(null);

  // Fetch user's module selections
  const fetchModuleSelections = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching module selections for user:", user.id);
      
      const { data, error: fetchError } = await supabase
        .from("user_module_selections")
        .select(`
          id, 
          module_id, 
          user_id, 
          created_at,
          modules(
            id,
            module_code, 
            module_title, 
            credits,
            description
          )
        `)
        .eq("user_id", user.id);
      
      if (fetchError) throw fetchError;
      
      console.log("Fetched module selections:", data);
      
      // Transform the data to match our interface
      const transformedData = data?.map((item: any) => ({
        id: item.id,
        module_id: item.module_id,
        user_id: item.user_id,
        created_at: item.created_at,
        module_details: item.modules ? {
          module_code: item.modules.module_code,
          module_title: item.modules.module_title,
          credits: item.modules.credits,
          description: item.modules.description
        } : undefined
      })) || [];
      
      setModuleSelections(transformedData);
      
    } catch (err: any) {
      console.error("Error fetching module selections:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove a module selection
  const removeModuleSelection = async (selectionId: string) => {
    if (!user) return;
    
    try {
      setRemoveSuccess(null);
      setError(null);
      
      console.log("Removing module selection:", selectionId);
      
      const { error: removeError } = await supabase
        .from("user_module_selections")
        .delete()
        .eq("id", selectionId)
        .eq("user_id", user.id);
      
      if (removeError) throw removeError;
      
      console.log("Successfully removed module selection:", selectionId);
      setRemoveSuccess("Module removed successfully");
      
      // Refresh the list
      await fetchModuleSelections();
      
    } catch (err: any) {
      console.error("Error removing module selection:", err);
      setError(err.message);
    }
  };

  // Fetch module selections on component mount
  useEffect(() => {
    fetchModuleSelections();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Module Selection Test</h1>
        <p className="text-gray-600">Please log in to view your module selections.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Module Selection Test</h1>
      <p className="text-gray-600 mb-6">View and manage your selected modules. This page verifies that your module selections are saved correctly and persist across sessions.</p>
      
      {removeSuccess && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
          {removeSuccess}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <button 
        onClick={fetchModuleSelections}
        className="mb-6 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Refresh Modules
      </button>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : moduleSelections.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <Book className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No module selections found</p>
          <p className="text-gray-400 text-sm mt-1">Complete registration with module selections to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg mb-2">Your Selected Modules</h2>
          <p className="text-sm text-gray-500 mb-4">Total modules: {moduleSelections.length}</p>
          
          {moduleSelections.map((selection) => (
            <div key={selection.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <Book className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">
                      {selection.module_details?.module_title || "Unknown Module"}
                    </h3>
                  </div>
                  
                  {selection.module_details?.module_code && (
                    <p className="text-sm text-gray-500 mt-1">
                      Code: {selection.module_details.module_code}
                    </p>
                  )}
                  
                  {selection.module_details?.credits && (
                    <p className="text-sm text-gray-500">
                      Credits: {selection.module_details.credits}
                    </p>
                  )}
                  
                  {selection.module_details?.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selection.module_details.description}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-2">
                    Selection ID: {selection.id}
                  </p>
                  <p className="text-xs text-gray-400">
                    Module ID: {selection.module_id}
                  </p>
                </div>
                
                <button
                  onClick={() => removeModuleSelection(selection.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Remove module"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="font-medium mb-2">Debug Information</h3>
        <p className="text-sm text-gray-500">User ID: {user.id}</p>
        <p className="text-sm text-gray-500">Selections count: {moduleSelections.length}</p>
      </div>
    </div>
  );
};

export default ModuleSelectionTest;
