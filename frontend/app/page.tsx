"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Euro, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { analyzeProject, generateProjectPlan } from "@/lib/project-analyzer"
import type { ProjectAnalysis, ProjectPlan } from "@/lib/types"

export default function ProjectManagerAI() {
  const [brief, setBrief] = useState("")
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null)
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!brief.trim()) return

    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const projectAnalysis = analyzeProject(brief)
    const plan = generateProjectPlan(projectAnalysis)

    setAnalysis(projectAnalysis)
    setProjectPlan(plan)
    setIsAnalyzing(false)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-green-100 text-green-800"
      case "moyenne":
        return "bg-yellow-100 text-yellow-800"
      case "complexe":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agent IA - Gestionnaire de Projets</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analysez vos besoins, obtenez un plan de projet détaillé et trouvez les meilleurs prestataires
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Brief Client
                </CardTitle>
                <CardDescription>Décrivez votre projet en détail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Exemple: Je souhaite créer une plateforme e-commerce pour vendre des produits artisanaux. J'ai besoin d'un catalogue produits, d'un système de paiement sécurisé, d'une gestion des stocks et d'un back-office pour les commandes. Mon budget est d'environ 50 000€ et je souhaite lancer dans 4 mois..."
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <Button onClick={handleAnalyze} disabled={!brief.trim() || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyse en cours...
                    </>
                  ) : (
                    "Analyser le Projet"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {analysis && projectPlan ? (
              <Tabs defaultValue="analysis" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="analysis">Analyse</TabsTrigger>
                  <TabsTrigger value="plan">Plan Projet</TabsTrigger>
                  <TabsTrigger value="team">Équipe</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analyse du Projet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Type de Projet</label>
                          <Badge variant="secondary" className="mt-1 block w-fit">
                            {analysis.type}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Complexité</label>
                          <Badge className={`mt-1 block w-fit ${getComplexityColor(analysis.complexity)}`}>
                            {analysis.complexity}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Durée Estimée</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{analysis.estimated_duration}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Fonctionnalités Clés</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {analysis.key_features.map((feature, index) => (
                            <Badge key={index} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="plan">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plan de Gestion de Projet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {projectPlan.project_plan.phases.map((phase, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-lg">{phase.name}</h3>
                              <Badge variant="secondary">{phase.duration_weeks} semaines</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm text-gray-600 mb-2">Livrables</h4>
                                <ul className="space-y-1">
                                  {phase.deliverables.map((deliverable, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      {deliverable}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm text-gray-600 mb-2">Profils Requis</h4>
                                <div className="flex flex-wrap gap-1">
                                  {phase.required_profiles.map((profile, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {profile}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team">
                  <Card>
                    <CardHeader>
                      <CardTitle>Composition de l'Équipe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {Object.entries(projectPlan.team_composition).map(([role, data]) => (
                          <div key={role} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold capitalize">{role.replace("_", " ")}</h3>
                              <Badge>
                                {data.count} personne{data.count > 1 ? "s" : ""}
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              {data.candidates.map((candidate, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">{candidate.name}</h4>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary">Score: {candidate.matching_score}/10</Badge>
                                      <Badge variant="outline">{candidate.hourly_rate}€/h</Badge>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                      {candidate.skills.map((skill, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                    <span className="text-sm text-green-600 font-medium">{candidate.availability}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="budget">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Euro className="h-5 w-5" />
                          Estimation Budgétaire
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {projectPlan.budget_estimation.minimum.toLocaleString()}€
                            </div>
                            <div className="text-sm text-green-600">Budget Minimum</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.round(
                                (projectPlan.budget_estimation.minimum + projectPlan.budget_estimation.maximum) / 2,
                              ).toLocaleString()}
                              €
                            </div>
                            <div className="text-sm text-blue-600">Budget Moyen</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {projectPlan.budget_estimation.maximum.toLocaleString()}€
                            </div>
                            <div className="text-sm text-purple-600">Budget Maximum</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Répartition par Phase</h4>
                          <div className="space-y-3">
                            {Object.entries(projectPlan.budget_estimation.breakdown).map(([phase, amount]) => (
                              <div key={phase} className="flex items-center justify-between">
                                <span className="capitalize">{phase}</span>
                                <div className="flex items-center gap-3">
                                  <Progress
                                    value={(amount / projectPlan.budget_estimation.maximum) * 100}
                                    className="w-24"
                                  />
                                  <span className="font-medium w-20 text-right">{amount.toLocaleString()}€</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Planning Prévisionnel
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Date de Début</label>
                            <div className="font-medium">{projectPlan.timeline.start_date}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Date de Fin</label>
                            <div className="font-medium">{projectPlan.timeline.end_date}</div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium mb-3">Jalons Principaux</h4>
                          <div className="space-y-2">
                            {projectPlan.timeline.milestones.map((milestone, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span>{milestone.name}</span>
                                <Badge variant="outline">{milestone.date}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Risques Identifiés
                          </h4>
                          <div className="space-y-3">
                            {projectPlan.risks.map((risk, index) => (
                              <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{risk.description}</span>
                                  <Badge variant={risk.impact === "high" ? "destructive" : "secondary"}>
                                    {risk.impact}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{risk.mitigation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Prêt à analyser votre projet</h3>
                  <p className="text-gray-500">
                    Décrivez votre projet dans le formulaire à gauche pour obtenir une analyse complète
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
