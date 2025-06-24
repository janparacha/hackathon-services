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
