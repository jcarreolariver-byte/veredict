import type { VoteChoice } from './verdict'

export interface VoteRequest {
  dilemmaId: string
  choice: VoteChoice
  justification?: string
}

export interface VoteResponse {
  success: boolean
  votesA: number
  votesB: number
}

export interface JustificationRequest {
  dilemmaId: string
  voteId: string
  text: string
}

export interface JustificationResponse {
  id: string
  text: string
  createdAt: string
}
