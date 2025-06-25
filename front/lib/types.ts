// Types pour la structure JSON du projet
export interface Prestataire {
  id: number
  nom: string
  description: string
  email: string
  telephone: string
  note: number
}

export interface Prestation {
  id: number
  titre: string
  description: string
  prix: number
  duree_estimee: number
}

export interface Match {
  prestataire: Prestataire
  prestation: Prestation
  score: number
  score_total: number
}

export interface PrestationAvecMatches {
  titre: string
  metier: string
  matches: Match[]
}

export interface Projet {
  plan: number
  label: string
  description: string
  budget: [number, number]
  duree: [number, number]
  prestations: PrestationAvecMatches[]
}

// Types pour l'interface utilisateur
export interface ProjectAnalysis {
  type: string
  complexity: "simple" | "moyenne" | "complexe"
  estimated_duration: string
  key_features: string[]
}

export interface Phase {
  name: string
  duration_weeks: number
  deliverables: string[]
  required_profiles: string[]
}

export interface Candidate {
  id: string
  name: string
  skills: string[]
  hourly_rate: number
  availability: string
  matching_score: number
}

export interface TeamRole {
  count: number
  candidates: Candidate[]
}

export interface BudgetBreakdown {
  conception: number
  development: number
  testing: number
}

export interface BudgetEstimation {
  minimum: number
  maximum: number
  breakdown: BudgetBreakdown
}

export interface Milestone {
  name: string
  date: string
}

export interface Timeline {
  start_date: string
  end_date: string
  milestones: Milestone[]
}

export interface Risk {
  description: string
  impact: "low" | "medium" | "high"
  mitigation: string
}

export interface ProjectPlan {
  project_analysis: ProjectAnalysis
  project_plan: {
    phases: Phase[]
  }
  team_composition: {
    [key: string]: TeamRole
  }
  budget_estimation: BudgetEstimation
  timeline: Timeline
  risks: Risk[]
}

export interface Condition {
  id: number
  condition_prestation_id: number
  nom: string
  remplie: boolean
}

export interface ProjetPrestationDetail {
  id: number
  prestation: {
    titre: string
    description: string
    prix: number
    duree_estimee: number
    id: number
    prestataire_id: number
  }
  prestataire: {
    id: number
    nom: string
    description: string
    email: string
    telephone: string
    note: number
  }
  statut: string
  conditions: Condition[]
}

export interface ProjetDetail {
  titre: string
  description: string
  id: number
  date_creation: string
  client_id: number
  projets_prestations: ProjetPrestationDetail[]
}
