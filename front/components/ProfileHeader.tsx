"use client"
import { useState, useEffect } from 'react'
import { UserCircle, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fetchGet } from '@/lib/utils'
import React from 'react'
import { ClientIdContext } from './ClientIdProvider'

export default function ProfileHeader() {
  const { clientId, setClientId, refreshProjectsCount } = React.useContext(ClientIdContext)
  const [showProfile, setShowProfile] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    fetchGet(`http://localhost:8000/clients/${clientId}/projets`)
      .then(setProjects)
      .catch(e => setError(e.message || 'Erreur'))
      .finally(() => setLoading(false))
  }, [clientId, refreshProjectsCount])

  const handleProjectClick = (id: number) => {
    setShowProfile(false)
    router.push(`/projet/${id}`)
  }

  return (
    <div className="w-full flex justify-between items-center p-4 bg-white sticky top-0 z-40">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
        onClick={() => { setShowProfile(false); router.push('/') }}
        aria-label="Skillbridge"
      >
        <Home className="h-5 w-5" />
        Accueil
      </button>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white rounded px-2 py-1 shadow text-xs">
          <span>ID client :</span>
          <input
            type="number"
            min={1}
            value={clientId}
            onChange={e => setClientId(Number(e.target.value))}
            className="border rounded px-1 py-0.5 w-16 text-xs"
            style={{ fontSize: '0.85rem' }}
          />
        </div>
        <div className="relative">
          <button
            className="rounded-full p-1 hover:bg-gray-100 transition"
            onClick={() => setShowProfile((v) => !v)}
            aria-label="Profil utilisateur"
          >
            <UserCircle className="h-8 w-8 text-gray-700" />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border p-4 z-50 animate-fade-in-up">
              <div className="font-bold text-lg mb-2">Mes projets</div>
              {loading && <div className="text-blue-600">Chargement...</div>}
              {error && <div className="text-red-600">Erreur : {error}</div>}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="border-b pb-2 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2 transition"
                    onClick={() => handleProjectClick(proj.id)}
                  >
                    <div className="font-semibold text-gray-800">{proj.titre}</div>
                    <div className="text-sm text-gray-600 mb-1">{proj.description}</div>
                    <div className="text-xs text-gray-400">Créé le {new Date(proj.date_creation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                ))}
                {(!loading && projects.length === 0) && <div className="text-gray-400">Aucun projet</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}