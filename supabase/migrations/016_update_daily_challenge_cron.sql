-- Update generate_daily_challenge to only pick from 'tournament' questions
CREATE OR REPLACE FUNCTION generate_daily_challenge()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_q_ids UUID[];
  v_themes TEXT[] := ARRAY[
    'Tactical Mastermind Day',
    'World Cup Heroics',
    'Ethiopian League Legends',
    'Champions League Drama',
    'Golden Boot Striker Challenge'
  ];
  v_selected_theme TEXT;
BEGIN
  -- Pick 10 random active question IDs that are allowed for tournaments
  SELECT array_agg(id) INTO v_q_ids
  FROM (
    SELECT id FROM questions
    WHERE is_active = true 
      AND usage_type IN ('tournament', 'both')
    ORDER BY random()
    LIMIT 10
  ) random_q;

  IF v_q_ids IS NOT NULL AND array_length(v_q_ids, 1) > 0 THEN
    v_selected_theme := v_themes[1 + floor(random() * array_length(v_themes, 1))::INT];
    
    INSERT INTO daily_challenges (challenge_date, theme_en, theme_am, theme_om, question_ids, bonus_multiplier)
    VALUES (
      CURRENT_DATE + INTERVAL '1 day',
      v_selected_theme,
      'የቀኑ ልዩ ጥያቄዎች',
      'Gaaffilee Addaa Hardhaa',
      v_q_ids,
      1.5
    )
    ON CONFLICT (challenge_date) DO NOTHING;
  END IF;
END;
$$;
