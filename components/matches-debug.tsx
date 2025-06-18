"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/database"

export function MatchesDebug() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testMatches = async () => {
    setLoading(true)
    const tests: any = {}

    try {
      // Test 1: Requête basique
      console.log("Test 1: Requête basique matches")
      const { data: basicData, error: basicError } = await supabase.from("matches").select("*")

      tests.basic = {
        success: !basicError,
        error: basicError?.message,
        data: basicData,
        count: basicData?.length || 0,
      }

      // Test 2: Requête avec count
      console.log("Test 2: Count matches")
      const { count, error: countError } = await supabase.from("matches").select("*", { count: "exact", head: true })

      tests.count = {
        success: !countError,
        error: countError?.message,
        count: count,
      }

      // Test 3: Requête avec colonnes spécifiques
      console.log("Test 3: Colonnes spécifiques")
      const { data: specificData, error: specificError } = await supabase
        .from("matches")
        .select("team_a_player_1, team_a_player_2, score_a, score_b")

      tests.specific = {
        success: !specificError,
        error: specificError?.message,
        data: specificData,
        count: specificData?.length || 0,
      }

      // Test 4: Requête avec limite
      console.log("Test 4: Avec limite")
      const { data: limitData, error: limitError } = await supabase.from("matches").select("*").limit(1)

      tests.limit = {
        success: !limitError,
        error: limitError?.message,
        data: limitData,
        count: limitData?.length || 0,
      }
    } catch (error) {
      tests.globalError = error instanceof Error ? error.message : "Erreur inconnue"
    }

    console.log("Résultats des tests matches:", tests)
    setResult(tests)
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔍 Debug spécifique Matches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testMatches} disabled={loading}>
          {loading ? "Test en cours..." : "Tester les requêtes matches"}
        </Button>

        {result && (
          <div className="space-y-4">
            {Object.entries(result).map(([testName, testResult]: [string, any]) => (
              <div key={testName} className="border p-3 rounded">
                <h4 className="font-semibold">{testName}</h4>
                {testResult.success ? (
                  <div className="text-green-600">
                    ✅ Succès - {testResult.count} éléments
                    {testResult.data && testResult.data.length > 0 && (
                      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                        {JSON.stringify(testResult.data[0], null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="text-red-600">❌ Erreur: {testResult.error}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
