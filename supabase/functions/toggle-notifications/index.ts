
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Function called: toggle-notifications");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      console.error("Missing Authorization header");
      throw new Error("Missing Authorization header");
    }
    
    console.log("Authorization header found");
    
    // Extract token from Authorization header (remove 'Bearer ' prefix if present)
    const token = authHeader.replace(/^Bearer\s/, '');
    console.log("Token extracted from header");
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
        auth: {
          persistSession: false,
        }
      }
    );

    // Now we can get the authenticated user's information
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    console.log("Auth check result:", user ? "User authenticated" : "Auth failed", userError ? `Error: ${userError.message}` : "No error");

    if (userError) {
      console.error("Authentication error:", userError.message);
      throw new Error(userError.message || "Authentication failed");
    }

    if (!user) {
      console.error("Unauthorized access attempt: No user found");
      throw new Error("Unauthorized: No user found");
    }

    console.log(`Authorized user: ${user.id}`);

    // Get the request body
    const requestData = await req.json();
    const { enabled } = requestData;
    
    if (enabled === undefined) {
      console.error("Missing 'enabled' field in request body");
      throw new Error("Missing 'enabled' field in request body");
    }
    
    console.log(`Updating sms_notifications to: ${enabled}`);

    // Update the user's sms_notifications preference
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({ sms_notifications: enabled })
      .eq("id", user.id);

    if (updateError) {
      console.error("Database update error:", updateError.message);
      throw new Error(updateError.message);
    }

    console.log("Update successful");

    // Return the successful response
    return new Response(
      JSON.stringify({
        success: true,
        message: enabled ? "SMS notifications enabled" : "SMS notifications disabled",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in toggle-notifications function:", error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
