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

    const { liveMatchId, userId, questionIndex, selectedIndex, responseTimeMs } = await req.json();

    // Fetch live match & current question
    const { data: match } = await supabase.from('live_matches').select('*').eq('id', liveMatchId).single();
    if (!match) throw new Error("Match not found");

    const questionId = match.question_ids[questionIndex];
    const { data: qData } = await supabase.from('questions').select('correct_index').eq('id', questionId).single();

    const isCorrect = qData ? qData.correct_index === selectedIndex : false;

    // Record answer entry
    await supabase.from('live_match_answers').insert({
      live_match_id: liveMatchId,
      user_id: userId,
      question_index: questionIndex,
      selected_index: selectedIndex,
      response_time_ms: responseTimeMs,
      is_correct: isCorrect
    });

    // Update player score
    const isPlayerA = match.player_a_id === userId;
    const scoreDelta = isCorrect ? 150 : 0;

    const updatePayload = isPlayerA
      ? { player_a_score: match.player_a_score + scoreDelta }
      : { player_b_score: match.player_b_score + scoreDelta };

    await supabase.from('live_matches').update(updatePayload).eq('id', liveMatchId);

    return new Response(JSON.stringify({
      success: true,
      isCorrect,
      scoreDelta,
      newScore: isPlayerA ? match.player_a_score + scoreDelta : match.player_b_score + scoreDelta
    }), {
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
