import pool from './postgres'

export interface Player {
  id: string
  name: string
  created_at: string
}

export interface Match {
  id: string
  team_a_player_1: string
  team_a_player_2: string
  team_b_player_1: string
  team_b_player_2: string
  score_a: number
  score_b: number
  created_at: string
}

// Fonctions pour les joueurs
export async function getPlayers(): Promise<Player[]> {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY name')
    return result.rows
  } catch (error) {
    console.error("Erreur lors de la récupération des joueurs:", error)
    return []
  }
}

export async function createPlayer(name: string): Promise<Player | null> {
  try {
    const result = await pool.query(
      'INSERT INTO players (name) VALUES ($1) RETURNING *',
      [name]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Erreur lors de la création du joueur:", error)
    return null
  }
}

// 🆕 Nouvelle fonction : Supprimer un joueur
export async function deletePlayer(playerId: string): Promise<boolean> {
  try {
    await pool.query('DELETE FROM players WHERE id = $1', [playerId])
    return true
  } catch (error) {
    console.error("Erreur lors de la suppression du joueur:", error)
    return false
  }
}

// 🆕 Nouvelle fonction : Modifier un joueur
export async function updatePlayer(playerId: string, name: string): Promise<Player | null> {
  try {
    const result = await pool.query(
      'UPDATE players SET name = $1 WHERE id = $2 RETURNING *',
      [name, playerId]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Erreur lors de la modification du joueur:", error)
    return null
  }
}

// Fonctions pour les matchs
export async function getMatches(): Promise<Match[]> {
  try {
    const result = await pool.query('SELECT * FROM matches ORDER BY created_at DESC')
    return result.rows
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs:", error)
    return []
  }
}

export async function createMatch(match: {
  team_a_player_1: string
  team_a_player_2: string
  team_b_player_1: string
  team_b_player_2: string
  score_a: number
  score_b: number
}): Promise<Match | null> {
  try {
    const result = await pool.query(
      'INSERT INTO matches (team_a_player_1, team_a_player_2, team_b_player_1, team_b_player_2, score_a, score_b) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [match.team_a_player_1, match.team_a_player_2, match.team_b_player_1, match.team_b_player_2, match.score_a, match.score_b]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Erreur lors de la création du match:", error)
    return null
  }
}

// 🆕 Nouvelle fonction : Supprimer un match
export async function deleteMatch(matchId: string): Promise<boolean> {
  try {
    await pool.query('DELETE FROM matches WHERE id = $1', [matchId])
    return true
  } catch (error) {
    console.error("Erreur lors de la suppression du match:", error)
    return false
  }
}

// 🆕 Nouvelle fonction : Modifier un match
export async function updateMatch(
  matchId: string,
  match: {
    team_a_player_1: string
    team_a_player_2: string
    team_b_player_1: string
    team_b_player_2: string
    score_a: number
    score_b: number
  },
): Promise<Match | null> {
  try {
    const result = await pool.query(
      'UPDATE matches SET team_a_player_1 = $1, team_a_player_2 = $2, team_b_player_1 = $3, team_b_player_2 = $4, score_a = $5, score_b = $6 WHERE id = $7 RETURNING *',
      [match.team_a_player_1, match.team_a_player_2, match.team_b_player_1, match.team_b_player_2, match.score_a, match.score_b, matchId]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Erreur lors de la modification du match:", error)
    return null
  }
}

// Fonction pour obtenir les statistiques
export async function getPlayerStats() {
  try {
    const matches = await getMatches()
    const players = await getPlayers()

    console.log("Matches récupérés:", matches.length)
    console.log("Players récupérés:", players.length)

    const stats: { [key: string]: any } = {}

    // Initialiser les stats pour tous les joueurs
    players.forEach((player) => {
      stats[player.name] = {
        name: player.name,
        matches: 0,
        wins: 0,
        losses: 0,
        totalScore: 0,
        ratio: 0,
      }
    })

    // Calculer les statistiques à partir des matchs
    matches.forEach((match) => {
      // 🔄 Normalisation des équipes pour cohérence
      const teamA = [match.team_a_player_1, match.team_a_player_2]
      const teamB = [match.team_b_player_1, match.team_b_player_2]
      const allPlayers = [...teamA, ...teamB]
      const teamAWins = match.score_a > match.score_b

      console.log("Match:", teamA, "vs", teamB, "Score:", match.score_a, "-", match.score_b)

      allPlayers.forEach((playerName) => {
        // Créer le joueur s'il n'existe pas dans les stats
        if (!stats[playerName]) {
          stats[playerName] = {
            name: playerName,
            matches: 0,
            wins: 0,
            losses: 0,
            totalScore: 0,
            ratio: 0,
          }
        }

        stats[playerName].matches++

        const isInTeamA = teamA.includes(playerName)
        const playerWins = (isInTeamA && teamAWins) || (!isInTeamA && !teamAWins)

        if (playerWins) {
          stats[playerName].wins++
          stats[playerName].totalScore++
        } else {
          stats[playerName].losses++
        }
      })
    })

    // Calculer les ratios
    Object.values(stats).forEach((stat: any) => {
      stat.ratio = stat.losses > 0 ? stat.wins / stat.losses : stat.wins
    })

    const result = Object.values(stats).filter((stat: any) => stat.matches > 0)
    console.log("Statistiques calculées:", result)

    return result
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error)
    return []
  }
}

export async function getDuoStats() {
  try {
    const matches = await getMatches()
    const stats: { [key: string]: any } = {}

    console.log("Calcul des stats de duo pour", matches.length, "matchs")

    matches.forEach((match) => {
      // 🔄 Normalisation : trier les noms pour éviter les doublons Alice-Bob vs Bob-Alice
      const teamA = [match.team_a_player_1, match.team_a_player_2].sort()
      const teamB = [match.team_b_player_1, match.team_b_player_2].sort()
      const duoA = teamA.join("-")
      const duoB = teamB.join("-")
      const teamAWins = match.score_a > match.score_b

      console.log(`📊 Duo normalisé A: ${duoA}, Duo normalisé B: ${duoB}`)

      // Traiter l'équipe A
      if (!stats[duoA]) {
        stats[duoA] = {
          players: teamA as [string, string],
          matches: 0,
          wins: 0,
          losses: 0,
          totalScore: 0,
          ratio: 0,
        }
      }
      stats[duoA].matches++
      if (teamAWins) {
        stats[duoA].wins++
        stats[duoA].totalScore++
      } else {
        stats[duoA].losses++
      }

      // Traiter l'équipe B
      if (!stats[duoB]) {
        stats[duoB] = {
          players: teamB as [string, string],
          matches: 0,
          wins: 0,
          losses: 0,
          totalScore: 0,
          ratio: 0,
        }
      }
      stats[duoB].matches++
      if (!teamAWins) {
        stats[duoB].wins++
        stats[duoB].totalScore++
      } else {
        stats[duoB].losses++
      }
    })

    // Calculer les ratios
    Object.values(stats).forEach((stat: any) => {
      stat.ratio = stat.losses > 0 ? stat.wins / stat.losses : stat.wins
    })

    const result = Object.values(stats)
    console.log("Stats de duo calculées:", result)

    return result
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques de duo:", error)
    return []
  }
}
