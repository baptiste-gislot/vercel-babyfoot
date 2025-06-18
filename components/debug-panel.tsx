"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/database"

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostic = async () => {
    setLoading(true)
    const info: any = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Non défini",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Défini" : "Non défini",
      tests: {},
    }

    try {
      // Test 1: Connexion basique
      const { data: testConnection, error: connectionError } = await supabase
        .from("players")
        .select("count", { count: "exact", head: true })

      info.tests.connection = {
        success: !connectionError,
        error: connectionError?.message,
        count: testConnection,
      }

      // Test 2: Récupération des joueurs
      const { data: players, error: playersError } = await supabase.from("players").select("*")

      info.tests.players = {
        success: !playersError,
        error: playersError?.message,
        count: players?.length || 0,
        data: players?.slice(0, 3), // Premiers 3 joueurs
      }

      // Test 3: Récupération des matchs
      const { data: matches, error: matchesError } = await supabase.from("matches").select("*")

      info.tests.matches = {
        success: !matchesError,
        error: matchesError?.message,
        count: matches?.length || 0,
        data: matches?.slice(0, 2), // Premiers 2 matchs
      }
    } catch (error) {
      info.globalError = error instanceof Error ? error.message : "Erreur inconnue"
    }

    setDebugInfo(info)
    setLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🔍 Diagnostic Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostic} disabled={loading}>
          {loading ? "Diagnostic en cours..." : "Lancer le diagnostic"}
        </Button>

        {debugInfo && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Configuration :</h4>
              <div className="space-y-1 text-sm">
                <div>
                  URL Supabase: <Badge variant="outline">{debugInfo.supabaseUrl}</Badge>
                </div>
                <div>
                  Clé API: <Badge variant="outline">{debugInfo.supabaseKey}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tests de connexion :</h4>
              <div className="space-y-2">
                {Object.entries(debugInfo.tests).map(([testName, result]: [string, any]) => (
                  <div key={testName} className="flex items-center gap-2">
                    <Badge variant={result.success ? "default" : "destructive"}>{testName}</Badge>
                    {result.success ? (
                      <span className="text-green-600">✅ {result.count} éléments</span>
                    ) : (
                      <span className="text-red-600">❌ {result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {debugInfo.tests.players?.data && (
              <div>
                <h4 className="font-semibold mb-2">Exemples de joueurs :</h4>
                <div className="text-sm space-y-1">
                  {debugInfo.tests.players.data.map((player: any) => (
                    <div key={player.id}>• {player.name}</div>
                  ))}
                </div>
              </div>
            )}

            {debugInfo.globalError && (
              <div className="text-red-600 bg-red-50 p-3 rounded">
                <strong>Erreur globale :</strong> {debugInfo.globalError}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
