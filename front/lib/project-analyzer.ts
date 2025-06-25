import type { ProjectAnalysis, ProjectPlan, Candidate } from "./types"

// Base de données simulée des prestataires
const freelancersDatabase: Candidate[] = [
  {
    id: "DEV001",
    name: "Marie Dubois",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    hourly_rate: 75,
    availability: "Immédiate",
    matching_score: 9,
  },
  {
    id: "DEV002",
    name: "Pierre Martin",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    hourly_rate: 70,
    availability: "Dans 2 semaines",
    matching_score: 8,
  },
  {
    id: "DEV003",
    name: "Sophie Laurent",
    skills: ["Vue.js", "Nuxt.js", "JavaScript", "CSS"],
    hourly_rate: 65,
    availability: "Immédiate",
    matching_score: 7,
  },
  {
    id: "DEV004",
    name: "Thomas Rousseau",
    skills: ["Python", "Django", "FastAPI", "PostgreSQL"],
    hourly_rate: 80,
    availability: "Dans 1 mois",
    matching_score: 9,
  },
  {
    id: "UX001",
    name: "Emma Leroy",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    hourly_rate: 60,
    availability: "Immédiate",
    matching_score: 9,
  },
  {
    id: "UX002",
    name: "Lucas Bernard",
    skills: ["Sketch", "InVision", "Wireframing", "UI Design"],
    hourly_rate: 55,
    availability: "Dans 1 semaine",
    matching_score: 8,
  },
]

export function analyzeProject(brief: string): ProjectAnalysis {
  const lowerBrief = brief.toLowerCase()

  // Détection du type de projet
  let type = "web"
  if (lowerBrief.includes("e-commerce") || lowerBrief.includes("boutique") || lowerBrief.includes("vente")) {
    type = "e-commerce"
  } else if (lowerBrief.includes("mobile") || lowerBrief.includes("app")) {
    type = "application mobile"
  } else if (lowerBrief.includes("saas") || lowerBrief.includes("plateforme")) {
    type = "plateforme SaaS"
  } else if (lowerBrief.includes("crm") || lowerBrief.includes("erp")) {
    type = "système de gestion"
  }

  // Détection de la complexité
  let complexity: "simple" | "moyenne" | "complexe" = "moyenne"
  const complexityIndicators = {
    simple: ["simple", "basique", "vitrine", "landing"],
    complexe: [
      "complexe",
      "avancé",
      "ia",
      "intelligence artificielle",
      "machine learning",
      "api multiple",
      "intégration",
    ],
  }

  if (complexityIndicators.simple.some((indicator) => lowerBrief.includes(indicator))) {
    complexity = "simple"
  } else if (complexityIndicators.complexe.some((indicator) => lowerBrief.includes(indicator))) {
    complexity = "complexe"
  }

  // Estimation de durée basée sur la complexité
  const durations = {
    simple: "4-8 semaines",
    moyenne: "3-6 mois",
    complexe: "6-12 mois",
  }

  // Extraction des fonctionnalités
  const features: string[] = []
  const featureKeywords = {
    authentification: ["login", "connexion", "authentification", "compte utilisateur"],
    paiement: ["paiement", "stripe", "paypal", "transaction"],
    "base de données": ["base de données", "stockage", "données"],
    api: ["api", "intégration", "service externe"],
    responsive: ["mobile", "responsive", "adaptatif"],
    admin: ["admin", "back-office", "gestion"],
    recherche: ["recherche", "filtre", "tri"],
    notifications: ["notification", "email", "alerte"],
    chat: ["chat", "messagerie", "communication"],
    analytics: ["analytics", "statistiques", "reporting"],
  }

  Object.entries(featureKeywords).forEach(([feature, keywords]) => {
    if (keywords.some((keyword) => lowerBrief.includes(keyword))) {
      features.push(feature)
    }
  })

  // Fonctionnalités par défaut selon le type
  if (type === "e-commerce") {
    features.push("catalogue produits", "panier", "gestion commandes")
  } else if (type === "plateforme SaaS") {
    features.push("tableau de bord", "gestion utilisateurs", "abonnements")
  }

  return {
    type,
    complexity,
    estimated_duration: durations[complexity],
    key_features: [...new Set(features)], // Supprime les doublons
  }
}

export function generateProjectPlan(analysis: ProjectAnalysis): ProjectPlan {
  // Génération des phases selon la complexité
  const phases = [
    {
      name: "Conception",
      duration_weeks: analysis.complexity === "simple" ? 1 : analysis.complexity === "moyenne" ? 2 : 3,
      deliverables: [
        "Cahier des charges détaillé",
        "Wireframes et maquettes",
        "Architecture technique",
        "Spécifications fonctionnelles",
      ],
      required_profiles: ["UX Designer", "Architecte Solution"],
    },
    {
      name: "Développement",
      duration_weeks: analysis.complexity === "simple" ? 4 : analysis.complexity === "moyenne" ? 8 : 16,
      deliverables: ["Interface utilisateur", "Backend et API", "Base de données", "Intégrations tierces"],
      required_profiles: ["Développeur Frontend", "Développeur Backend"],
    },
    {
      name: "Tests et Déploiement",
      duration_weeks: analysis.complexity === "simple" ? 1 : analysis.complexity === "moyenne" ? 2 : 4,
      deliverables: ["Tests unitaires et d'intégration", "Tests utilisateurs", "Documentation", "Mise en production"],
      required_profiles: ["Testeur QA", "DevOps"],
    },
  ]

  // Sélection des candidats selon les besoins
  const frontendDevs = freelancersDatabase
    .filter((dev) => dev.skills.some((skill) => ["React", "Vue.js", "Angular", "JavaScript"].includes(skill)))
    .slice(0, 2)

  const backendDevs = freelancersDatabase
    .filter((dev) => dev.skills.some((skill) => ["Node.js", "Python", "Django", "Express"].includes(skill)))
    .slice(0, 2)

  const uxDesigners = freelancersDatabase
    .filter((dev) => dev.skills.some((skill) => ["Figma", "Adobe XD", "Sketch"].includes(skill)))
    .slice(0, 1)

  // Calcul du budget
  const totalWeeks = phases.reduce((sum, phase) => sum + phase.duration_weeks, 0)
  const avgHourlyRate = 70
  const hoursPerWeek = 35
  const basebudget = totalWeeks * hoursPerWeek * avgHourlyRate

  const budgetMultiplier = {
    simple: 0.7,
    moyenne: 1,
    complexe: 1.5,
  }

  const adjustedBudget = basebudget * budgetMultiplier[analysis.complexity]

  // Génération des dates
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 14) // Début dans 2 semaines
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + totalWeeks * 7)

  return {
    project_analysis: analysis,
    project_plan: { phases },
    team_composition: {
      frontend_developers: {
        count: analysis.complexity === "simple" ? 1 : 2,
        candidates: frontendDevs,
      },
      backend_developers: {
        count: 1,
        candidates: backendDevs,
      },
      ux_designers: {
        count: 1,
        candidates: uxDesigners,
      },
    },
    budget_estimation: {
      minimum: Math.round(adjustedBudget * 0.8),
      maximum: Math.round(adjustedBudget * 1.2),
      breakdown: {
        conception: Math.round(adjustedBudget * 0.2),
        development: Math.round(adjustedBudget * 0.6),
        testing: Math.round(adjustedBudget * 0.2),
      },
    },
    timeline: {
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      milestones: [
        {
          name: "Fin de conception",
          date: new Date(startDate.getTime() + phases[0].duration_weeks * 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          name: "MVP disponible",
          date: new Date(
            startDate.getTime() + (phases[0].duration_weeks + phases[1].duration_weeks * 0.7) * 7 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
        },
        {
          name: "Version finale",
          date: endDate.toISOString().split("T")[0],
        },
      ],
    },
    risks: [
      {
        description: "Retard dans la validation des maquettes",
        impact: "medium",
        mitigation: "Prévoir des sessions de validation régulières",
      },
      {
        description: "Complexité technique sous-estimée",
        impact: "high",
        mitigation: "Ajouter 20% de buffer sur le développement",
      },
      {
        description: "Indisponibilité des prestataires",
        impact: "medium",
        mitigation: "Maintenir une liste de prestataires de backup",
      },
    ],
  }
}
