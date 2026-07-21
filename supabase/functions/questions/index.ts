import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { competitionId, count = 10, locale = 'en' } = await req.json().catch(() => ({}));

    let query = supabase.from('questions').select('*').eq('is_active', true);
    if (competitionId) {
      query = query.or(`competition_id.eq.${competitionId},category.eq.${competitionId}`);
    }

    const { data, error } = await query.limit(50);

    if (error) throw error;

    // Secure mapping: strip correct_index and generate SHA-256 answer_hash
    const secureQuestions = await Promise.all((data || []).map(async (q: any) => {
      let prompt = q.prompt_en;
      let options = q.options_en;

      if (locale === 'am' && q.prompt_am && q.options_am) {
        prompt = q.prompt_am;
        options = q.options_am;
      } else if (locale === 'om' && q.prompt_om && q.options_om) {
        prompt = q.prompt_om;
        options = q.options_om;
      }

      const answerHash = await sha256(`${q.id}:${q.correct_index}:ethio-secret-salt`);

      return {
        id: q.id,
        category: q.category,
        difficulty: q.difficulty,
        prompt,
        options,
        answerHash // Client verifies option selection against hash without knowing correct_index
      };
    }));

    // Randomize output order
    const shuffled = secureQuestions.sort(() => 0.5 - Math.random()).slice(0, count);

    return new Response(JSON.stringify({ questions: shuffled }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 's-maxage=60' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
