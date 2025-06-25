import { ProjetDetail } from '@/lib/types'
import { notFound } from 'next/navigation'
import { UserCircle, FileText, CheckCircle, XCircle, BadgeCheck } from 'lucide-react'

// Fake data pour la démo
const fakeProjet: ProjetDetail = {
  titre: "Projet E-commerce",
  description: "Création d'une boutique en ligne pour produits artisanaux.",
  id: 1,
  date_creation: "2025-06-25T09:01:20.221377",
  client_id: 7,
  projets_prestations: [
    {
      id: 1,
      prestation: {
        titre: "Rédaction de contrats de cession de droits de propriété littéraire et artistique",
        description: "Contrats pour vente de droits d'auteur.",
        prix: 1229,
        duree_estimee: 26,
        id: 999,
        prestataire_id: 40
      },
      prestataire: {
        id: 40,
        nom: "Juridique Pro 40",
        description: "Prestataire spécialisé en juridique.",
        email: "juridiquepro40@test.com",
        telephone: "0694413714",
        note: 9.83
      },
      statut: "à faire",
      conditions: [
        {
          id: 1,
          condition_prestation_id: 997,
          nom: "Condition 1 pour 'Rédaction de contrats de cession de droits de propriété littéraire et artistique'",
          remplie: true
        }
      ]
    },
    {
      id: 2,
      prestation: {
        titre: "Conseil en assurance emprunteur",
        description: "Choix et négociation d'assurance pour crédits.",
        prix: 3786,
        duree_estimee: 20,
        id: 736,
        prestataire_id: 30
      },
      prestataire: {
        id: 30,
        nom: "Finance Pro 30",
        description: "Prestataire spécialisé en finance.",
        email: "financepro30@test.com",
        telephone: "0657919286",
        note: 6.35
      },
      statut: "à faire",
      conditions: [
        {
          id: 2,
          condition_prestation_id: 745,
          nom: "Condition 1 pour 'Conseil en assurance emprunteur'",
          remplie: false
        },
        {
          id: 3,
          condition_prestation_id: 746,
          nom: "Condition 2 pour 'Conseil en assurance emprunteur'",
          remplie: false
        }
      ]
    },
    {
      id: 3,
      prestation: {
        titre: "Coaching préparation PMP",
        description: "Entraînement à la certification Project Management Professional.",
        prix: 5750,
        duree_estimee: 12,
        id: 3,
        prestataire_id: 1
      },
      prestataire: {
        id: 1,
        nom: "Éducation Pro 1",
        description: "Prestataire spécialisé en éducation.",
        email: "éducationpro1@test.com",
        telephone: "0662697813",
        note: 7.93
      },
      statut: "à faire",
      conditions: []
    },
    {
      id: 4,
      prestation: {
        titre: "Cours de mathématiques supérieures",
        description: "Soutien pour les étudiants en prépa ou licence.",
        prix: 9002,
        duree_estimee: 29,
        id: 46,
        prestataire_id: 2
      },
      prestataire: {
        id: 2,
        nom: "Éducation Pro 2",
        description: "Prestataire spécialisé en éducation.",
        email: "éducationpro2@test.com",
        telephone: "0622562167",
        note: 7.35
      },
      statut: "à faire",
      conditions: [
        {
          id: 4,
          condition_prestation_id: 51,
          nom: "Condition 1 pour 'Cours de mathématiques supérieures'",
          remplie: false
        }
      ]
    }
  ]
}

export default function ProjetDetailPage({ params }: { params: { id: string } }) {
  // Ici tu brancheras ton fetch backend plus tard
  const projet = fakeProjet.id === Number(params.id) ? fakeProjet : null
  if (!projet) return notFound()

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
        {projet.projets_prestations.map((pp) => (
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
                  {pp.conditions.map((cond) => (
                    <li key={cond.id} className={cond.remplie ? 'text-green-700 font-semibold flex items-center' : 'text-red-600 flex items-center'}>
                      {cond.nom}
                      {cond.remplie ? <CheckCircle className="inline h-4 w-4 ml-2 text-green-500" /> : <XCircle className="inline h-4 w-4 ml-2 text-red-400" />}
                      {cond.remplie ? <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Remplie</span> : <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">À faire</span>}
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