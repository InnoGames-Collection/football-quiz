import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-ethio-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { msisdn, tier, event, userId } = body; // 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'RENEW'

    if (!msisdn || !tier) {
      throw new Error("Missing msisdn or tier");
    }

    const expiresAt = tier === 'premium'
      ? new Date(Date.now() + 30 * 86400000).toISOString()
      : new Date(Date.now() + 1 * 86400000).toISOString();

    if (userId) {
      // Upsert subscription record in database
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        phone: msisdn,
        tier: tier,
        status: event === 'UNSUBSCRIBE' ? 'cancelled' : 'active',
        expires_at: expiresAt
      });

      // Update user subscription_tier field
      await supabase.from('users').update({
        subscription_tier: event === 'UNSUBSCRIBE' ? 'free' : tier
      }).eq('id', userId);
    }

    return new Response(JSON.stringify({ status: 'ACK', msisdn, tier }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
