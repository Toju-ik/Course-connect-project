
// API routes for the application – use edge function names (without a leading slash)
export const API_ROUTES = {
  SEND_SMS: 'send-sms-notification',
  TOGGLE_NOTIFICATIONS: 'toggle-notifications'
};

// Helper function to construct the Supabase Edge Function URL
export const getSupabaseEdgeFunctionUrl = (functionName: string): string => {
  // Check for the Vite-specific environment variable
  const supabaseUrl = 
    // First, try to get from import.meta.env.VITE_SUPABASE_URL
    (import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
    // Then fall back to process.env if available (for SSR or non-Vite environments)
    (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) ||
    // Then try Supabase URL directly (legacy support)
    (import.meta.env && import.meta.env.SUPABASE_URL) ||
    // Hardcoded fallback for development - replace with your actual Supabase URL for testing
    'https://cxrlytcsoyfkevoewkvk.supabase.co';
  
  console.log("Using Supabase URL:", supabaseUrl); // Added for debugging
  
  if (!supabaseUrl) {
    console.error('Missing Supabase URL environment variable. Using fallback URL for development.');
    return '';
  }
  
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

// For backward compatibility (to be deprecated)
export const getApiUrl = getSupabaseEdgeFunctionUrl;
