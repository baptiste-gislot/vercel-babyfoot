-- Création de la table des joueurs
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des matchs
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_a_player_1 VARCHAR(100) NOT NULL,
  team_a_player_2 VARCHAR(100) NOT NULL,
  team_b_player_1 VARCHAR(100) NOT NULL,
  team_b_player_2 VARCHAR(100) NOT NULL,
  score_a INTEGER NOT NULL CHECK (score_a >= 0),
  score_b INTEGER NOT NULL CHECK (score_b >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_matches_players ON matches (team_a_player_1, team_a_player_2, team_b_player_1, team_b_player_2);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches (created_at DESC);
