-- Update get_daily_challenge to return question_ids
CREATE OR REPLACE FUNCTION get_daily_challenge()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_challenge RECORD;
  v_completed BOOLEAN;
  v_user_id UUID := auth.uid();
BEGIN
  SELECT * INTO v_challenge FROM daily_challenges 
  WHERE challenge_date = CURRENT_DATE;

  IF v_challenge IS NULL THEN
    RETURN jsonb_build_object('available', false, 'message', 'No challenge today');
  END IF;

  SELECT EXISTS(SELECT 1 FROM daily_challenge_completions WHERE user_id = v_user_id AND challenge_date = CURRENT_DATE)
  INTO v_completed;

  RETURN jsonb_build_object(
    'available', true,
    'id', v_challenge.id,
    'theme_en', v_challenge.theme_en,
    'theme_am', v_challenge.theme_am,
    'theme_om', v_challenge.theme_om,
    'bonusMultiplier', v_challenge.bonus_multiplier,
    'completed', v_completed,
    'question_ids', v_challenge.question_ids
  );
END;
$$;
