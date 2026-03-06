// Supabase Edge Function: send-invite-email
// Deploy with: supabase functions deploy send-invite-email
// Set secret: supabase secrets set RESEND_API_KEY=re_xxxxx
//
// Falls back to Supabase's built-in SMTP if RESEND_API_KEY is not set.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, inviteLink, fromName } = await req.json()

    if (!to || !inviteLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, inviteLink' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')

    if (resendKey) {
      // Send via Resend
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Motivate Me <onboarding@resend.dev>',
          to: [to],
          subject: `${fromName || 'Someone'} invited you to Motivate Me`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
              <h2 style="color: #D35400; margin-bottom: 8px;">Motivate Me</h2>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                <strong>${fromName || 'A friend'}</strong> wants you to be their accountability monitor on Motivate Me.
              </p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                As a monitor, you'll be able to view their habits, progress, and help approve their reward redemptions.
              </p>
              <a href="${inviteLink}" style="display: inline-block; background: #D35400; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px;">
                Accept Invite
              </a>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
                If you didn't expect this email, you can safely ignore it.
              </p>
            </div>
          `,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        return new Response(
          JSON.stringify({ error: `Email send failed: ${err}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, method: 'resend' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fallback: use Supabase admin to send a magic link with redirect
    // This sends the user a login email that redirects to the invite page
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase.auth.admin.inviteUserByEmail(to, {
      redirectTo: inviteLink,
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, method: 'supabase-invite' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
