
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  to: string;
  message: string;
}

async function sendSMS(to: string, message: string) {
  console.log(`Attempting to send SMS to ${to}: ${message}`);
  
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error("Missing Twilio credentials. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in the environment variables.");
  }
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  const formData = new URLSearchParams();
  formData.append("To", to);
  formData.append("From", TWILIO_PHONE_NUMBER);
  formData.append("Body", message);
  
  console.log(`Sending SMS to: ${to} from: ${TWILIO_PHONE_NUMBER}`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`
      },
      body: formData.toString()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio error:", errorText);
      throw new Error(`Failed to send SMS: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log("SMS sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in sendSMS function:", error);
    throw error;
  }
}

// Verify user auth token
async function verifyAuthToken(authHeader: string | null) {
  if (!authHeader) {
    console.error("No authorization header provided");
    return { user: null, error: "Missing authorization header" };
  }

  const token = authHeader.replace("Bearer ", "");
  
  if (!token) {
    console.error("Token is empty after processing header");
    return { user: null, error: "Invalid authorization header format" };
  }
  
  console.log(`Verifying token (first 10 chars): ${token.substring(0, 10)}...`);
  
  try {
    // Create admin client
    const supabase = createClient(
      SUPABASE_URL || "",
      SUPABASE_SERVICE_ROLE_KEY || ""
    );
    
    // Verify the JWT token
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.error("Token verification failed:", error);
      return { user: null, error: error?.message || "Invalid token" };
    }
    
    console.log("Token verified successfully for user:", data.user.id);
    return { user: data.user, error: null };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { user: null, error: "Failed to verify authentication" };
  }
}

serve(async (req) => {
  console.log("Received request to send-sms-notification function");
  console.log("Request method:", req.method);
  console.log("Request headers present:", Object.keys(req.headers).join(", "));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    console.log("Authorization header:", authHeader ? `Present (starts with: ${authHeader.substring(0, 15)}...)` : "Missing");
    
    const { user, error: authError } = await verifyAuthToken(authHeader);
    
    if (authError) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ success: false, error: authError }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    console.log("Authenticated user:", user?.id);
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("Missing Twilio credentials. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in the environment variables.");
    }
    
    const requestData = await req.json();
    console.log("Request data:", requestData);
    
    const { to, message }: SMSRequest = requestData;
    
    // Validate phone number (basic validation)
    if (!to || !to.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error("Invalid phone number format. Please use E.164 format (e.g., +1234567890). Received: " + to);
    }
    
    if (!message) {
      throw new Error("Message cannot be empty.");
    }
    
    console.log(`Sending SMS to: ${to}`);
    const result = await sendSMS(to, message);
    console.log("SMS sent successfully:", result);
    
    return new Response(
      JSON.stringify({ success: true, message: "SMS sent successfully", result }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Error in send-sms-notification function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
