-- Insertion de quelques joueurs d'exemple
INSERT INTO players (name) VALUES 
  ('Alice'),
  ('Bob'),
  ('Charlie'),
  ('Diana'),
  ('Eve'),
  ('Frank')
ON CONFLICT (name) DO NOTHING;

-- Insertion de quelques matchs d'exemple
INSERT INTO matches (team_a_player_1, team_a_player_2, team_b_player_1, team_b_player_2, score_a, score_b) VALUES 
  ('Alice', 'Bob', 'Charlie', 'Diana', 10, 8),
  ('Eve', 'Frank', 'Alice', 'Charlie', 6, 10),
  ('Bob', 'Diana', 'Eve', 'Frank', 10, 7),
  ('Alice', 'Charlie', 'Bob', 'Diana', 8, 10),
  ('Eve', 'Diana', 'Frank', 'Charlie', 10, 5);
