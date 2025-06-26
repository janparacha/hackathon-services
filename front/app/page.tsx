"use client"

import React from "react"
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
import { Input } from "@/components/ui/input"
import { fetchPost } from "@/lib/utils"


export default function ProjectManagerAI() {
  const [projets, setProjets] = useState<Projet[]>([])
  const [selectedPlan, setSelectedPlan] = useState<number>(1)
  const [prompt, setPrompt] = useState<string>()
  const [selectedRecap, setSelectedRecap] = useState<{
    prestation: Prestation,
    prestataire: Prestataire,
    plan: number,
    validated?: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getProjectFromPrompt = async (prompt: string) => {
    setLoading(true)
    setError(null)
    fetchPost(`http://localhost:8000/match_prestataires/`, {
      prompt: prompt
    })
      .then(res => {
        setProjets(res)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Erreur inconnue')
        setLoading(false)
      })
  }

  const currentProjet = projets.find((p: Projet) => p.plan === selectedPlan)

  // Calcul du budget total des prestations
  const totalPrestations = Array.isArray(currentProjet?.prestations) && currentProjet.prestations.length > 0
    ? currentProjet.prestations.reduce((sum: any, prestationAvecMatches: any) => {
      if (Array.isArray(prestationAvecMatches.matches) && prestationAvecMatches.matches.length > 0) {
        return sum + prestationAvecMatches.matches.reduce((matchSum: any, match: any) => matchSum + (match?.prestation?.prix || 0), 0)
      }
      return sum
    }, 0)
    : 0

  const budgetUtilise = currentProjet?.budget && currentProjet.budget[1]
    ? (totalPrestations / currentProjet.budget[1]) * 100
    : 0

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
            {loading && <div className="text-blue-600 font-semibold mt-2">Chargement...</div>}
            {error && <div className="text-red-600 font-semibold mt-2">Erreur : {error}</div>}
          </div>

          {/* Section pitch client */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Décrivez votre besoin ou projet</CardTitle>
                <CardDescription>Ce texte sera visible dans la vue d'ensemble du plan sélectionné</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Exemple : Je souhaite rénover mon appartement, ou je souhaites un site web vitrine pour mon entreprise."
                  value={prompt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={() => getProjectFromPrompt(prompt || "")}>
                  Générer
                </Button>
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
                  {projets.map((projet: Projet) => (
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
                      {currentProjet?.label}
                    </CardTitle>
                    <CardDescription>{currentProjet?.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Affichage du pitch client */}
                    {prompt && (
                      <div className="mb-4 p-3 bg-blue-100 rounded">
                        <span className="block text-sm text-gray-700 font-semibold mb-1">Pitch client :</span>
                        <span className="text-gray-800">{prompt}</span>
                      </div>
                    )}
                    {currentProjet &&
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{formatRange(currentProjet?.duree, " jours")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{formatRange(currentProjet?.budget, "€")}</span>
                        </div>
                      </div>
                    }

                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Prestations incluses</h4>
                      <div className="space-y-2">
                        {Array.isArray(currentProjet?.prestations) && currentProjet.prestations.length > 0 ? (
                          currentProjet.prestations.map((prestation: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              {getMetierIcon(prestation.metier)}
                              <span className="text-sm">{prestation.titre}</span>
                              <Badge>{prestation.metier}</Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400">Aucune prestation</div>
                        )}
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
                          {totalPrestations?.toLocaleString()}€ / {currentProjet?.budget[1]?.toLocaleString()}€
                        </span>
                      </div>
                      <Progress value={budgetUtilise} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {budgetUtilise?.toFixed(1)}% du budget alloué
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentProjet?.prestations?.length}</div>
                        <div className="text-sm text-gray-600">Prestations</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {currentProjet?.prestations?.reduce((sum: any, p: any) => sum + p.matches?.length, 0)}
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
                  <CardTitle>Prestations du Plan {currentProjet?.plan}</CardTitle>
                  <CardDescription>
                    Liste des prestations nécessaires pour réaliser le projet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(currentProjet?.prestations) && currentProjet.prestations.length > 0 ? (
                      currentProjet.prestations.map((prestationAvecMatches: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{prestationAvecMatches.titre}</h3>
                                {getMetierIcon(prestationAvecMatches.metier)}
                                <Badge>{prestationAvecMatches.metier}</Badge>
                              </div>
                              <p className="text-gray-600">
                                {prestationAvecMatches.matches && prestationAvecMatches.matches.length > 0 ? prestationAvecMatches.matches[0]?.prestation?.description : null}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-sm text-gray-500 mb-1">
                                {prestationAvecMatches.matches?.length || 0} prestataire(s)
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                À partir de {prestationAvecMatches.matches && prestationAvecMatches.matches.length > 0 ? Math.min(...prestationAvecMatches.matches.map((m: any) => m?.prestation?.prix || 0)) : null}€
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">Aucune prestation</div>
                    )}
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
                    {Array.isArray(currentProjet?.prestations) && currentProjet.prestations.length > 0 ? (
                      currentProjet.prestations.flatMap((prestationAvecMatches: any) =>
                        Array.isArray(prestationAvecMatches.matches) && prestationAvecMatches.matches.length > 0 ? prestationAvecMatches.matches.map((match: any, matchIndex: number) => (
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
                                  {match.prestation.prix?.toLocaleString()}€
                                </div>
                                <div className="text-sm text-gray-500">
                                  {match.prestation.duree_estimee?.toLocaleString()} jours
                                </div>
                              </div>
                            </div>
                          </div>
                        )) : []
                      )
                    ) : (
                      <div className="text-gray-400">Aucun prestataire</div>
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
                    {Array.isArray(currentProjet?.prestations) && currentProjet.prestations.length > 0 ? (
                      currentProjet.prestations.flatMap((prestationAvecMatches: any) =>
                        Array.isArray(prestationAvecMatches.matches) && prestationAvecMatches.matches.length > 0 ? prestationAvecMatches.matches.map((match: any, matchIndex: number) => (
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
                                    <span className="text-sm">{match.prestation.duree_estimee?.toLocaleString()} jours</span>
                                  </div>
                                  <div className="text-lg font-bold text-blue-600">
                                    {match.prestation.prix?.toLocaleString()}€
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
                                  Score total : {match.score_total?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
                                plan: currentProjet?.plan
                              })}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Sélectionner cette correspondance
                              </Button>
                            </div>
                          </div>
                        )) : []
                      )
                    ) : (
                      <div className="text-gray-400">Aucune correspondance</div>
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
                    <div className="text-3xl font-bold text-blue-700">{selectedRecap.prestation.prix?.toLocaleString()}€</div>
                    <div className="text-gray-500 text-sm">Coût total de la prestation</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-10 w-10 text-green-600 mb-1" />
                    <div className="text-2xl font-semibold text-green-700">{selectedRecap.prestation.duree_estimee?.toLocaleString()} jours</div>
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