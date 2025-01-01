import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, email, data } = await req.json()

    if (data?.template === 'partner-admin-invite') {
      // Custom template for partner admin invite
      const emailContent = `
        Hi ${data.partner_name},

        ${data.inviter_name} would like to give you admin access to the WeddingWin Photo App for your wedding day.

        Follow this link to login:
        ${data.confirmation_url}
      `

      // Send custom email using your preferred email service
      // You'll need to implement this part using a service like Resend
      // For now, we'll just log it
      console.log('Would send email:', emailContent)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})