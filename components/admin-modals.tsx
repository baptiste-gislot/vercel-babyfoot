"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Loader2 } from "lucide-react"
import type { Player, Match } from "@/lib/database"

// Modal de confirmation de suppression de joueur
interface DeletePlayerModalProps {
  player: Player | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (playerId: string) => Promise<void>
}

export function DeletePlayerModal({ player, isOpen, onClose, onConfirm }: DeletePlayerModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!player) return
    setLoading(true)
    await onConfirm(player.id)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Supprimer le joueur
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le joueur <strong>{player?.name}</strong> ?
            <br />
            <span className="text-red-600 font-medium">
              ⚠️ Attention : Tous les matchs de ce joueur seront également supprimés !
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Modal d'édition de joueur
interface EditPlayerModalProps {
  player: Player | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (playerId: string, newName: string) => Promise<void>
}

export function EditPlayerModal({ player, isOpen, onClose, onConfirm }: EditPlayerModalProps) {
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState("")

  const handleConfirm = async () => {
    if (!player || !newName.trim()) return
    setLoading(true)
    await onConfirm(player.id, newName.trim())
    setLoading(false)
    onClose()
  }

  // Réinitialiser le nom quand le modal s'ouvre
  useEffect(() => {
    if (player && isOpen) {
      setNewName(player.name)
    }
  }, [player, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le joueur</DialogTitle>
          <DialogDescription>Modifiez le nom du joueur {player?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="playerName">Nouveau nom</Label>
            <Input
              id="playerName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom du joueur"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !newName.trim()}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Modal d'édition de match
interface EditMatchModalProps {
  match: Match | null
  players: Player[]
  isOpen: boolean
  onClose: () => void
  onConfirm: (matchId: string, updatedMatch: any) => Promise<void>
}

export function EditMatchModal({ match, players, isOpen, onClose, onConfirm }: EditMatchModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    team_a_player_1: "",
    team_a_player_2: "",
    team_b_player_1: "",
    team_b_player_2: "",
    score_a: 0,
    score_b: 0,
  })

  // Réinitialiser les données quand le modal s'ouvre
  useEffect(() => {
    if (match && isOpen) {
      setFormData({
        team_a_player_1: match.team_a_player_1,
        team_a_player_2: match.team_a_player_2,
        team_b_player_1: match.team_b_player_1,
        team_b_player_2: match.team_b_player_2,
        score_a: match.score_a,
        score_b: match.score_b,
      })
    }
  }, [match, isOpen])

  const handleConfirm = async () => {
    if (!match) return
    setLoading(true)
    await onConfirm(match.id, formData)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le match</DialogTitle>
          <DialogDescription>Modifiez les détails du match</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          {/* Équipe A */}
          <div className="space-y-4">
            <h4 className="font-semibold text-green-600">Équipe A</h4>
            <div>
              <Label>Joueur 1</Label>
              <Select
                value={formData.team_a_player_1}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, team_a_player_1: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.name}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Joueur 2</Label>
              <Select
                value={formData.team_a_player_2}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, team_a_player_2: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.name}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Score</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.score_a}
                onChange={(e) => setFormData((prev) => ({ ...prev, score_a: Number.parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Équipe B */}
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-600">Équipe B</h4>
            <div>
              <Label>Joueur 1</Label>
              <Select
                value={formData.team_b_player_1}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, team_b_player_1: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.name}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Joueur 2</Label>
              <Select
                value={formData.team_b_player_2}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, team_b_player_2: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.name}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Score</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.score_b}
                onChange={(e) => setFormData((prev) => ({ ...prev, score_b: Number.parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Modal de confirmation de suppression de match
interface DeleteMatchModalProps {
  match: Match | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (matchId: string) => Promise<void>
}

export function DeleteMatchModal({ match, isOpen, onClose, onConfirm }: DeleteMatchModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!match) return
    setLoading(true)
    await onConfirm(match.id)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Supprimer le match
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce match ?
            <br />
            <strong>
              {match?.team_a_player_1} & {match?.team_a_player_2} vs {match?.team_b_player_1} & {match?.team_b_player_2}
            </strong>
            <br />
            Score : {match?.score_a} - {match?.score_b}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
