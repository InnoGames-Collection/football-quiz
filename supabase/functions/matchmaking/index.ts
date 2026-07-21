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

    const { userId, eloRating, competitionId } = await req.json();

    // 1. Check if an opponent exists in queue with ELO delta <= 200
    const { data: queueData } = await supabase
      .from('matchmaking_queue')
      .select('*')
      .neq('user_id', userId)
      .gte('elo_rating', eloRating - 200)
      .lte('elo_rating', eloRating + 200)
      .limit(1);

    if (queueData && queueData.length > 0) {
      const opponent = queueData[0];

      // Remove opponent from queue
      await supabase.from('matchmaking_queue').delete().eq('id', opponent.id);

      // Fetch 10 random active question IDs from DB
      const { data: qData } = await supabase
        .from('questions')
        .select('id')
        .eq('is_active', true)
        .limit(10);

      const questionIds = (qData || []).map((q: any) => q.id);

      // Create live match record
      const { data: matchData, error: matchErr } = await supabase
        .from('live_matches')
        .insert({
          player_a_id: userId,
          player_b_id: opponent.user_id,
          competition_id: competitionId || null,
          question_ids: questionIds,
          status: 'waiting'
        })
        .select()
        .single();

      if (matchErr) throw matchErr;

      return new Response(JSON.stringify({ matched: true, liveMatch: matchData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // 2. No opponent found — add self to queue
    await supabase.from('matchmaking_queue').upsert({
      user_id: userId,
      elo_rating: eloRating,
      competition_id: competitionId || null
    });

    return new Response(JSON.stringify({ matched: false, message: 'Added to matchmaking queue' }), {
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
