
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();
    
    if (!email) {
      console.error("Email is required but was not provided");
      throw new Error("Email is required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error(`Invalid email format: ${email}`);
      throw new Error("Invalid email format");
    }

    console.log(`Sending notification email to: ${email}, name: ${name || 'there'}`);

    const { data, error } = await resend.emails.send({
      from: "Study Tracker <onboarding@resend.dev>",
      to: [email],
      subject: "Email Notifications Enabled",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Study Tracker Notifications Enabled</h1>
          <p>Hello ${name || "there"},</p>
          <p>You have successfully enabled email notifications for Study Tracker. You will now receive updates about:</p>
          <ul>
            <li>Upcoming assignment deadlines</li>
            <li>Study session reminders</li>
            <li>Weekly study progress reports</li>
          </ul>
          <p>You can manage your notification preferences anytime in your account settings.</p>
          <p>Best regards,<br>The Study Tracker Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);
    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
