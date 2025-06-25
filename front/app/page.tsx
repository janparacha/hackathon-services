"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Clock, 
  Euro, 
  Users, 
  Star, 
  Phone, 
  Mail, 
  Briefcase,
  FileText,
  CheckCircle,
  TrendingUp,
  Building,
  Computer,
  X
} from "lucide-react"
import type { Projet, Prestataire, Prestation, Match, PrestationAvecMatches } from "@/lib/types"
import ProfileHeader from "@/components/ProfileHeader"
import ApiStatus from "@/components/ApiStatus"

// Données d'exemple basées sur la structure JSON réelle
const exempleProjets: Projet[] = [
  {
    plan: 1,
    label: "Économique",
    description: "Le moins cher possible, durée potentiellement longue.",
    budget: [3599, 3686],
    duree: [51, 173],
    prestations: [
      {
        titre: "Aménagement de combles",
        metier: "Bâtiment",
        matches: [
          {
            prestataire: {
              id: 22,
              nom: "Bâtiment Pro 22",
              description: "Prestataire spécialisé en bâtiment.",
              email: "bâtimentpro22@test.com",
              telephone: "0671737279",
              note: 9.09
            },
            prestation: {
              id: 326,
              titre: "Aménagement de combles",
              description: "Transformation de combles en espace habitable.",
              prix: 7609,
              duree_estimee: 15
            },
            score: 0.28,
            score_total: 3325.87
          },
          {
            prestataire: {
              id: 19,
              nom: "Bâtiment Pro 19",
              description: "Prestataire spécialisé en bâtiment.",
              email: "bâtimentpro19@test.com",
              telephone: "0637847752",
              note: 8.23
            },
            prestation: {
              id: 281,
              titre: "Aménagement de combles",
              description: "Transformation de combles en espace habitable.",
              prix: 2781,
              duree_estimee: 2
            },
            score: 0.63,
            score_total: 496.30
          }
        ]
      },
      {
        titre: "Construction de maison individuelle",
        metier: "Bâtiment",
        matches: [
          {
            prestataire: {
              id: 22,
              nom: "Bâtiment Pro 22",
              description: "Prestataire spécialisé en bâtiment.",
              email: "bâtimentpro22@test.com",
              telephone: "0671737279",
              note: 9.09
            },
            prestation: {
              id: 324,
              titre: "Construction de maison individuelle",
              description: "Réalisation complète d'une maison clé en main.",
              prix: 1832,
              duree_estimee: 16
            },
            score: 0.63,
            score_total: 4.20
          },
          {
            prestataire: {
              id: 67,
              nom: "Bâtiment Pro 67",
              description: "Prestataire spécialisé en bâtiment.",
              email: "bâtimentpro67@test.com",
              telephone: "0616652254",
              note: 8.96
            },
            prestation: {
              id: 994,
              titre: "Construction de maison individuelle",
              description: "Réalisation complète d'une maison clé en main.",
              prix: 860,
              duree_estimee: 7
            },
            score: 0.63,
            score_total: 4.20
          }
        ]
      }
    ]
  },
  {
    plan: 2,
    label: "Rapide",
    description: "Le plus rapide possible, quitte à payer plus cher.",
    budget: [24520, 60094],
    duree: [7, 7],
    prestations: [
      {
        titre: "Développement du site web",
        metier: "Informatique",
        matches: [
          {
            prestataire: {
              id: 487,
              nom: "Informatique Pro 487",
              description: "Prestataire spécialisé en informatique.",
              email: "informatiquepro487@test.com",
              telephone: "0685821626",
              note: 6.57
            },
            prestation: {
              id: 12167,
              titre: "Développement site accessible",
              description: "Sites web respectant les normes d'accessibilité.",
              prix: 4574,
              duree_estimee: 1
            },
            score: 0.63,
            score_total: 496.30
          }
        ]
      }
    ]
  },
  {
    plan: 3,
    label: "Équilibré",
    description: "Un compromis entre prix et durée.",
    budget: [37090, 37169],
    duree: [58, 131],
    prestations: [
      {
        titre: "Développement du site web",
        metier: "Informatique",
        matches: [
          {
            prestataire: {
              id: 64,
              nom: "Informatique Pro 64",
              description: "Prestataire spécialisé en informatique.",
              email: "informatiquepro64@test.com",
              telephone: "0667463661",
              note: 7.86
            },
            prestation: {
              id: 1590,
              titre: "Développement site accessible",
              description: "Sites web respectant les normes d'accessibilité.",
              prix: 5270,
              duree_estimee: 20
            },
            score: 0.63,
            score_total: 4.20
          }
        ]
      }
    ]
  }
]

// Ajout du pitch client par plan
const initialPitches: Record<number, string> = {
  1: "",
  2: "",
  3: ""
}

export default function ProjectManagerAI() {
  const [projets] = useState<Projet[]>(exempleProjets)
  const [selectedPlan, setSelectedPlan] = useState<number>(1)
  const [pitches, setPitches] = useState<Record<number, string>>(initialPitches)
  const [selectedRecap, setSelectedRecap] = useState<{
    prestation: Prestation,
    prestataire: Prestataire,
    plan: number,
    validated?: boolean
  } | null>(null)

  const currentProjet = projets.find(p => p.plan === selectedPlan) || projets[0]

  // Calcul du budget total des prestations
  const totalPrestations = currentProjet.prestations.reduce((sum, prestationAvecMatches) => {
    return sum + prestationAvecMatches.matches.reduce((matchSum, match) => matchSum + match.prestation.prix, 0)
  }, 0)
  
  const budgetUtilise = (totalPrestations / currentProjet.budget[1]) * 100

  const renderStars = (note: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(note) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getMetierIcon = (metier: string) => {
    switch (metier.toLowerCase()) {
      case 'bâtiment':
        return <Building className="h-4 w-4" />
      case 'informatique':
        return <Computer className="h-4 w-4" />
      default:
        return <Briefcase className="h-4 w-4" />
    }
  }

  // Gestion du pitch client
  const handlePitchChange = (plan: number, value: string) => {
    setPitches((prev) => ({ ...prev, [plan]: value }))
  }

  // Helpers pour afficher les fourchettes
  const formatRange = (arr: [number, number], unit: string) => {
    if (arr[0] === arr[1]) return `${arr[0].toLocaleString()}${unit}`
    return `${arr[0].toLocaleString()}${unit} – ${arr[1].toLocaleString()}${unit}`
  }

  return (
    <>
      <ProfileHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Skillbridge</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Visualisez et gérez vos projets avec leurs prestations et prestataires
            </p>
          </div>

          {/* Section pitch client */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Décrivez votre besoin ou projet</CardTitle>
                <CardDescription>Ce texte sera visible dans la vue d'ensemble du plan sélectionné</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Exemple : Je souhaite rénover mon appartement, installer une alarme et optimiser l'isolation."
                  value={pitches[selectedPlan] || ""}
                  onChange={(e) => handlePitchChange(selectedPlan, e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sélecteur de plan */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner un Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {projets.map((projet) => (
                    <Button
                      key={projet.plan}
                      variant={selectedPlan === projet.plan ? "default" : "outline"}
                      onClick={() => setSelectedPlan(projet.plan)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {projet.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="prestations">Prestations</TabsTrigger>
              <TabsTrigger value="prestataires">Prestataires</TabsTrigger>
              <TabsTrigger value="matches">Correspondances</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {currentProjet.label}
                    </CardTitle>
                    <CardDescription>{currentProjet.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Affichage du pitch client */}
                    {pitches[selectedPlan] && (
                      <div className="mb-4 p-3 bg-blue-100 rounded">
                        <span className="block text-sm text-gray-700 font-semibold mb-1">Pitch client :</span>
                        <span className="text-gray-800">{pitches[selectedPlan]}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{formatRange(currentProjet.duree, " jours")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{formatRange(currentProjet.budget, "€")}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Prestations incluses</h4>
                      <div className="space-y-2">
                        {currentProjet.prestations.map((prestation, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {getMetierIcon(prestation.metier)}
                            <span className="text-sm">{prestation.titre}</span>
                            <Badge variant="outline" className="ml-auto">
                              {prestation.metier}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Budget et Progression
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Budget utilisé</span>
                        <span className="text-sm text-gray-600">
                          {totalPrestations.toLocaleString()}€ / {currentProjet.budget[1].toLocaleString()}€
                        </span>
                      </div>
                      <Progress value={budgetUtilise} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {budgetUtilise.toFixed(1)}% du budget alloué
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentProjet.prestations.length}</div>
                        <div className="text-sm text-gray-600">Prestations</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {currentProjet.prestations.reduce((sum, p) => sum + p.matches.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Correspondances</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-1">
                  <ApiStatus />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prestations">
              <Card>
                <CardHeader>
                  <CardTitle>Prestations du Plan {currentProjet.plan}</CardTitle>
                  <CardDescription>
                    Liste des prestations nécessaires pour réaliser le projet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentProjet.prestations.map((prestationAvecMatches, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{prestationAvecMatches.titre}</h3>
                              {getMetierIcon(prestationAvecMatches.metier)}
                              <Badge variant="secondary">{prestationAvecMatches.metier}</Badge>
                            </div>
                            <p className="text-gray-600">
                              {prestationAvecMatches.matches[0]?.prestation.description || "Aucune description disponible"}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500 mb-1">
                              {prestationAvecMatches.matches.length} prestataire(s)
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              À partir de {Math.min(...prestationAvecMatches.matches.map(m => m.prestation.prix)).toLocaleString()}€
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prestataires">
              <Card>
                <CardHeader>
                  <CardTitle>Prestataires Disponibles</CardTitle>
                  <CardDescription>
                    Liste des prestataires correspondant aux besoins du projet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentProjet.prestations.flatMap(prestationAvecMatches => 
                      prestationAvecMatches.matches.map((match, matchIndex) => (
                        <div key={`${prestationAvecMatches.titre}-${matchIndex}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{match.prestataire.nom}</h3>
                                <div className="flex items-center gap-1">
                                  {renderStars(match.prestataire.note)}
                                  <span className="text-sm text-gray-600 ml-1">
                                    ({match.prestataire.note})
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-3">{match.prestataire.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {match.prestataire.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {match.prestataire.telephone}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <Badge variant="secondary" className="mb-2">
                                {match.prestation.titre}
                              </Badge>
                              <div className="text-lg font-bold text-green-600">
                                {match.prestation.prix.toLocaleString()}€
                              </div>
                              <div className="text-sm text-gray-500">
                                {match.prestation.duree_estimee} jours
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="matches">
              <Card>
                <CardHeader>
                  <CardTitle>Correspondances Projet-Prestataires</CardTitle>
                  <CardDescription>
                    Mise en relation des prestations avec les prestataires les plus adaptés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentProjet.prestations.flatMap(prestationAvecMatches => 
                      prestationAvecMatches.matches.map((match, matchIndex) => (
                        <div key={`${prestationAvecMatches.titre}-${matchIndex}`} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {match.prestation.titre}
                              </h3>
                              <p className="text-gray-600 mb-3">{match.prestation.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{match.prestation.duree_estimee} jours</span>
                                </div>
                                <div className="text-lg font-bold text-blue-600">
                                  {match.prestation.prix.toLocaleString()}€
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                {match.prestataire.nom}
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                  Score : {(match.score * 100).toFixed(0)}%
                                </span>
                              </h3>
                              <div className="text-xs text-gray-400 mb-1 ml-7">
                                Score total : {match.score_total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </div>
                              <p className="text-gray-600 mb-3">{match.prestataire.description}</p>
                              <div className="flex items-center gap-2 mb-3">
                                {renderStars(match.prestataire.note)}
                                <span className="text-sm text-gray-600">({match.prestataire.note})</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-500" />
                                  {match.prestataire.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  {match.prestataire.telephone}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <Button className="w-full" onClick={() => setSelectedRecap({
                              prestation: match.prestation,
                              prestataire: match.prestataire,
                              plan: currentProjet.plan
                            })}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Sélectionner cette correspondance
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bilan récapitulatif */}
        {selectedRecap && (
          <div className="fixed left-0 right-0 bottom-0 z-50 flex justify-center items-end pointer-events-none">
            <div className="bg-white shadow-2xl rounded-t-2xl max-w-sm w-full mx-4 mb-6 p-6 border pointer-events-auto animate-fade-in-up flex flex-col items-center gap-6 relative">
              <button onClick={() => setSelectedRecap(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
              {selectedRecap.validated ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
                  <div className="text-xl font-bold text-green-700 text-center">Merci !</div>
                  <div className="text-gray-700 text-center">
                    Le prestataire <span className="font-semibold">{selectedRecap.prestataire.nom}</span> va vous contacter dans un délai de <span className="font-semibold">24h</span> pour prendre contact et commencer le projet.
                  </div>
                  <Button className="mt-4 w-full" onClick={() => setSelectedRecap(null)}>
                    Fermer
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <Euro className="h-10 w-10 text-blue-600 mb-1" />
                    <div className="text-3xl font-bold text-blue-700">{selectedRecap.prestation.prix.toLocaleString()}€</div>
                    <div className="text-gray-500 text-sm">Coût total de la prestation</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-10 w-10 text-green-600 mb-1" />
                    <div className="text-2xl font-semibold text-green-700">{selectedRecap.prestation.duree_estimee} jours</div>
                    <div className="text-gray-500 text-sm">Durée estimée</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div className="text-base font-medium text-gray-700">{selectedRecap.prestataire.nom}</div>
                    <div className="text-xs text-gray-400">Prestataire sélectionné</div>
                  </div>
                  <div className="flex gap-2 w-full mt-4">
                    <Button className="w-full" variant="secondary" onClick={() => setSelectedRecap(null)}>
                      Annuler
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setSelectedRecap({ ...selectedRecap, validated: true })}>
                      Valider cette prestation
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
} 