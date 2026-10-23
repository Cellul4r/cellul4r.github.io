export interface CodeforcesUser {
  handle: string
  avatar?: string
  organization?: string
  rank?: string
  rating?: number
  maxRank?: string
  maxRating?: number
}

export interface RatingChange {
  contestId: number
  contestName: string
  rank: number
  ratingUpdateTimeSeconds: number
  oldRating: number
  newRating: number
}

export interface Problem {
  contestId?: number
  problemsetName?: string
  index: string
  name: string
  rating?: number
  tags: string[]
}

export interface Submission {
  id: number
  verdict?: string
  problem: Problem
}

export interface DistributionPoint { label: string; count: number }
export interface PracticeStatistics {
  solved: number
  difficulty: DistributionPoint[]
  topics: DistributionPoint[]
  unidentified: number
}

export interface RatingPoint extends RatingChange {
  timestamp: number
  change: number
}
