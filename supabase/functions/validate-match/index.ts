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

    const { matchType, competitionId, answers } = await req.json();

    if (!answers || !Array.isArray(answers)) {
      throw new Error("Invalid answers payload");
    }

    // Server Anti-Cheat Checks
    let correctCount = 0;
    let totalTime = 0;
    let anomalyDetected = false;

    for (const ans of answers) {
      // Reject answers submitted impossibly fast (< 300ms bot threshold)
      if (ans.responseTimeMs < 300) {
        anomalyDetected = true;
      }

      // Fetch correct index from database
      const { data: qData } = await supabase
        .from('questions')
        .select('correct_index')
        .eq('id', ans.questionId)
        .single();

      if (qData && qData.correct_index === ans.selectedIndex) {
        correctCount++;
      }
      totalTime += ans.responseTimeMs;
    }

    const accuracy = answers.length > 0 ? (correctCount / answers.length) * 100 : 0;
    const coinsEarned = anomalyDetected ? 0 : correctCount * 100;
    const xpEarned = anomalyDetected ? 0 : correctCount * 20;

    const authHeader = req.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';
    let userId = null;

    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    if (userId && !anomalyDetected) {
      // 1. Insert Match Record
      const { data: matchResult } = await supabase.from('matches').insert({
        user_id: userId,
        competition_id: competitionId || null,
        match_type: matchType || 'solo',
        goals: correctCount,
        correct_answers: correctCount,
        total_questions: answers.length,
        accuracy: accuracy,
        avg_response_time: totalTime / (answers.length || 1) / 1000,
        coins_earned: coinsEarned,
        xp_earned: xpEarned,
        answers: answers
      }).select().single();

      // 1.5. If Daily Challenge, mark as completed
      if (matchType === 'daily' && matchResult) {
        const { data: todayDate } = await supabase.rpc('eat_today');
        if (todayDate) {
          await supabase.from('daily_challenge_completions').upsert({
            user_id: userId,
            challenge_date: todayDate,
            match_id: matchResult.id,
            score: (correctCount * 100), // Max combo is not calculated in edge function, just use correctCount * 100 for now
            time_taken_ms: Math.round(totalTime)
          }, { onConflict: 'user_id, challenge_date' });
        }
      }

      // 2. Update User Profile XP and Coins
      const { data: profile } = await supabase.from('users').select('xp, coins, total_matches').eq('id', userId).single();
      if (profile) {
        await supabase.from('users').update({
          xp: (profile.xp || 0) + xpEarned,
          coins: (profile.coins || 0) + coinsEarned,
          total_matches: (profile.total_matches || 0) + 1,
          last_active: new Date().toISOString()
        }).eq('id', userId);
      }
    }

    return new Response(JSON.stringify({
      valid: !anomalyDetected,
      correctCount,
      totalQuestions: answers.length,
      accuracy: Math.round(accuracy),
      coinsEarned,
      xpEarned,
      anomalyDetected
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
