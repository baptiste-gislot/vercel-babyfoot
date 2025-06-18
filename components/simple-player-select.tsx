"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface SimplePlayerSelectProps {
  position: string
  label: string
  teamColor: string
  players: Array<{ id: string; name: string }>
  selectedPlayer: string
  newPlayerName: string
  onPlayerSelect: (value: string) => void
  onNewPlayerNameChange: (value: string) => void
  onReset: () => void
}

export function SimplePlayerSelect({
  position,
  label,
  teamColor,
  players,
  selectedPlayer,
  newPlayerName,
  onPlayerSelect,
  onNewPlayerNameChange,
  onReset,
}: SimplePlayerSelectProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isNewPlayerMode, setIsNewPlayerMode] = useState(false)

  console.log(`🎯 SimplePlayerSelect ${position}:`, {
    selectedPlayer,
    newPlayerName,
    isNewPlayerMode,
    showDropdown,
  })

  const handlePlayerClick = (playerName: string) => {
    console.log(`👤 Joueur sélectionné: ${playerName}`)
    onPlayerSelect(playerName)
    setShowDropdown(false)
    setIsNewPlayerMode(false)
  }

  const handleNewPlayerClick = () => {
    console.log(`➕ Mode nouveau joueur activé pour ${position}`)
    setIsNewPlayerMode(true)
    setShowDropdown(false)
    onPlayerSelect("")
  }

  const handleReset = () => {
    console.log(`🔄 Reset pour ${position}`)
    setIsNewPlayerMode(false)
    setShowDropdown(false)
    onReset()
  }

  // État initial : rien de sélectionné
  if (!selectedPlayer && !newPlayerName && !isNewPlayerMode) {
    return (
      <div className="space-y-2">
        <Label className={`text-sm font-medium ${teamColor}`}>{label}</Label>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => {
              console.log(`🔽 Ouverture dropdown pour ${position}`)
              setShowDropdown(!showDropdown)
            }}
          >
            Sélectionner un joueur
            <span>▼</span>
          </Button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {players.map((player) => (
                <button
                  key={player.id}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={() => handlePlayerClick(player.name)}
                >
                  {player.name}
                </button>
              ))}
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 font-medium text-blue-600"
                onClick={handleNewPlayerClick}
              >
                + Nouveau joueur
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mode nouveau joueur
  if (isNewPlayerMode || (!selectedPlayer && newPlayerName !== "")) {
    return (
      <div className="space-y-2">
        <Label className={`text-sm font-medium ${teamColor}`}>{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nom du nouveau joueur"
            value={newPlayerName}
            onChange={(e) => {
              console.log(`✏️ Saisie: ${e.target.value}`)
              onNewPlayerNameChange(e.target.value)
            }}
            className="flex-1"
            autoFocus
          />
          <Button variant="outline" size="sm" onClick={handleReset}>
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  // Joueur sélectionné
  return (
    <div className="space-y-2">
      <Label className={`text-sm font-medium ${teamColor}`}>{label}</Label>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex-1 justify-center py-2">
          {selectedPlayer}
        </Badge>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Changer
        </Button>
      </div>
    </div>
  )
}
