import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { tournamentId } = await req.json();

    // Fetch registered players
    const { data: regData } = await supabase
      .from('tournament_registrations')
      .select('user_id')
      .eq('tournament_id', tournamentId);

    const playerIds = (regData || []).map((r: any) => r.user_id);

    if (playerIds.length < 2) {
      return new Response(JSON.stringify({ error: "Insufficient players to build bracket" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Build Round 1 brackets
    const bracketRows = [];
    for (let i = 0; i < playerIds.length; i += 2) {
      bracketRows.push({
        tournament_id: tournamentId,
        round: 1,
        match_slot: Math.floor(i / 2) + 1,
        player_a_id: playerIds[i],
        player_b_id: playerIds[i + 1] || null,
        status: playerIds[i + 1] ? 'pending' : 'bye',
        winner_id: playerIds[i + 1] ? null : playerIds[i]
      });
    }

    await supabase.from('tournament_brackets').insert(bracketRows);
    await supabase.from('tournaments').update({ status: 'in_progress' }).eq('id', tournamentId);

    return new Response(JSON.stringify({ success: true, bracketCount: bracketRows.length }), {
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
