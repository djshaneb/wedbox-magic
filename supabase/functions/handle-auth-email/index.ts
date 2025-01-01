import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, email, data } = await req.json()
    console.log('Received webhook:', { type, email, data })

    if (data?.template === 'partner-admin-invite') {
      if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set')
      }

      console.log('Sending partner admin invite email to:', email)
      
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'WeddingWin <onboarding@resend.dev>',
          to: [email],
          subject: 'Wedding Admin Access Invitation',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hi ${data.partner_name},</h2>
              
              <p>${data.inviter_name} would like to give you admin access to the WeddingWin Photo App for your wedding day.</p>
              
              <p>Follow this link to login:</p>
              <a href="${data.confirmation_url}" 
                 style="display: inline-block; 
                        background: #7c3aed; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 6px;
                        margin: 16px 0;">
                Accept Invitation
              </a>
              
              <p style="color: #666; font-size: 14px; margin-top: 32px;">
                If you didn't request this invitation, you can safely ignore this email.
              </p>
            </div>
          `
        })
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('Failed to send email:', error);
        throw new Error(`Failed to send email: ${error}`);
      }

      console.log('Email sent successfully');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in handle-auth-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
});