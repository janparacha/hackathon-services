"use client"

import { ProjetDetail } from '@/lib/types'
import { notFound, useParams } from 'next/navigation'
import { UserCircle, FileText, CheckCircle, XCircle, BadgeCheck } from 'lucide-react'
import { fetchGet, fetchPatch } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function ProjetDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [projet, setProjet] = useState<ProjetDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingConditionId, setLoadingConditionId] = useState<number | null>(null)

  // Fonction utilitaire pour fetch le projet
  const fetchProjet = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGet(`http://localhost:8000/projets/${id}/detail`)
      setProjet(data)
    } catch (e: any) {
      setError(e.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchProjet(id)
  }, [id])

  const handleValidateCondition = async (conditionId: number) => {
    setLoadingConditionId(conditionId);
    setError(null);
    try {
      await fetchPatch(`http://localhost:8000/conditions/${conditionId}`, { remplie: true });
      // Refetch le projet pour mettre à jour l'UI
      if (id) {
        await fetchProjet(id);
      }
    } catch (e: any) {
      setError(e.message || "Erreur lors de la validation");
    } finally {
      setLoadingConditionId(null);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto py-10 px-4 text-blue-600">Chargement...</div>
  if (error) return <div className="max-w-3xl mx-auto py-10 px-4 text-red-600">Erreur : {error}</div>

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-7 w-7 text-blue-600" />
          {projet.titre}
        </h1>
        <div className="text-gray-600 mb-1 text-lg font-medium">{projet.description}</div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-1">
          <span className="bg-blue-50 px-2 py-1 rounded">ID : {projet.id}</span>
          <span className="bg-green-50 px-2 py-1 rounded">Client : {projet.client_id}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">Créé le {new Date(projet.date_creation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      <div className="space-y-6">
        {projet.projets_prestations.map((pp: any) => (
          <div key={pp.id} className="border rounded-xl p-5 bg-gradient-to-br from-white to-blue-50 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-lg">{pp.prestation.titre}</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{pp.statut}</span>
            </div>
            <div className="text-gray-600 mb-1 italic">{pp.prestation.description}</div>
            <div className="flex gap-4 text-sm mb-2">
              <span className="bg-blue-100 px-2 py-1 rounded">Prix : <span className="font-semibold">{pp.prestation.prix.toLocaleString()}€</span></span>
              <span className="bg-green-100 px-2 py-1 rounded">Durée estimée : <span className="font-semibold">{pp.prestation.duree_estimee} jours</span></span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <UserCircle className="h-5 w-5 text-gray-400" />
              <span className="font-medium">{pp.prestataire.nom}</span>
              <span className="text-xs text-gray-500">({pp.prestataire.note})</span>
              <span className="text-xs text-gray-400 ml-2">{pp.prestataire.email}</span>
            </div>
            <div className="text-xs text-gray-400 mb-2">{pp.prestataire.description}</div>
            {pp.conditions.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold text-sm mb-1">Conditions :</div>
                <ul className="list-disc ml-6 space-y-1">
                  {pp.conditions.map((cond: any) => (
                    <li key={cond.id} className={cond.remplie ? 'text-green-700 font-semibold flex items-center' : 'text-red-600 flex items-center'}>
                      {cond.nom}
                      {cond.remplie
                        ? <>
                            <CheckCircle className="inline h-4 w-4 ml-2 text-green-500" />
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Remplie</span>
                          </>
                        : <>
                            <XCircle className="inline h-4 w-4 ml-2 text-red-400" />
                            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">À faire</span>
                            <button
                              className="ml-3 px-2 py-0.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                              onClick={() => handleValidateCondition(cond.id)}
                              disabled={loadingConditionId === cond.id}
                            >
                              {loadingConditionId === cond.id ? "..." : "Valider"}
                            </button>
                          </>
                      }
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 