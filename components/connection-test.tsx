"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react"
import { getPlayers, getMatches } from "@/lib/database"

export function ConnectionTest() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [playersCount, setPlayersCount] = useState(0)
  const [matchesCount, setMatchesCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setStatus("loading")
    setError(null)

    try {
      const [players, matches] = await Promise.all([getPlayers(), getMatches()])

      setPlayersCount(players.length)
      setMatchesCount(matches.length)
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      setStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Test de connexion Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
          {status === "error" && <XCircle className="h-4 w-4 text-red-500" />}

          <span className="font-medium">
            {status === "loading" && "Test en cours..."}
            {status === "success" && "Connexion réussie !"}
            {status === "error" && "Erreur de connexion"}
          </span>
        </div>

        {status === "success" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Joueurs :</span>
              <Badge variant="secondary">{playersCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Matchs :</span>
              <Badge variant="secondary">{matchesCount}</Badge>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        <Button onClick={testConnection} variant="outline" className="w-full">
          Retester la connexion
        </Button>
      </CardContent>
    </Card>
  )
}
