-- Insert test questions into the Supabase database
INSERT INTO questions (id, category, difficulty, prompt_en, options_en, correct_index) VALUES
(gen_random_uuid(), 'world-cup', 1, 'Which country won the first ever World Cup in 1930?', ARRAY['Brazil', 'Argentina', 'Uruguay', 'Italy'], 2),
(gen_random_uuid(), 'world-cup', 1, 'Who won the Golden Boot in the 2022 FIFA World Cup?', ARRAY['Lionel Messi', 'Kylian Mbappé', 'Julián Álvarez', 'Olivier Giroud'], 1),
(gen_random_uuid(), 'world-cup', 2, 'Which nation has won the most FIFA Men''s World Cup titles?', ARRAY['Germany', 'Brazil', 'Argentina', 'Italy'], 1),
(gen_random_uuid(), 'ethiopian-premier-league', 2, 'Which club holds the record for the most Ethiopian Premier League titles?', ARRAY['Ethiopian Coffee SC', 'Dedebit FC', 'Fasil Kenema', 'Saint George SC'], 3),
(gen_random_uuid(), 'ethiopian-premier-league', 3, 'In which year was the Ethiopian Premier League established in its current format?', ARRAY['1985', '1997', '2002', '2010'], 1),
(gen_random_uuid(), 'walia-ibex', 4, 'Who is Ethiopia''s all-time top goalscorer in international football?', ARRAY['Getaneh Kebede', 'Saladin Said', 'Mengistu Worku', 'Adane Girma'], 0),
(gen_random_uuid(), 'champions-league', 2, 'Which player has won the most UEFA Champions League titles?', ARRAY['Cristiano Ronaldo', 'Lionel Messi', 'Paco Gento', 'Paolo Maldini'], 2),
(gen_random_uuid(), 'general', 1, 'How many players are there on a standard football pitch during a match?', ARRAY['20', '22', '24', '18'], 1),
(gen_random_uuid(), 'general', 1, 'What is the standard length of a football match in minutes?', ARRAY['60', '80', '90', '120'], 2),
(gen_random_uuid(), 'general', 2, 'Which country is famous for the "Tiki-Taka" style of play?', ARRAY['Brazil', 'Spain', 'Italy', 'Netherlands'], 1);
