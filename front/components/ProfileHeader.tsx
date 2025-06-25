"use client"
import { useState } from 'react'
import { UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const fakeUserProjects = [
  {
    titre: "Projet E-commerce",
    description: "Création d'une boutique en ligne pour produits artisanaux.",
    id: 1,
    date_creation: "2025-06-25T09:01:20.221377",
    client_id: 7
  },
  {
    titre: "Refonte site vitrine",
    description: "Modernisation du site web de l'entreprise.",
    id: 2,
    date_creation: "2025-06-20T14:15:10.123456",
    client_id: 7
  }
]

export default function ProfileHeader() {
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  const handleProjectClick = (id: number) => {
    setShowProfile(false)
    router.push(`/projet/${id}`)
  }

  return (
    <div className="w-full flex justify-end items-center p-4 bg-white/80 sticky top-0 z-40">
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
            <div className="space-y-3">
              {fakeUserProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="border-b pb-2 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2 transition"
                  onClick={() => handleProjectClick(proj.id)}
                >
                  <div className="font-semibold text-gray-800">{proj.titre}</div>
                  <div className="text-xs text-gray-500 mb-1">ID : {proj.id} | Client : {proj.client_id}</div>
                  <div className="text-sm text-gray-600 mb-1">{proj.description}</div>
                  <div className="text-xs text-gray-400">Créé le {new Date(proj.date_creation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 