// Tipos del dominio — se completarán en Fase 1 cuando existan los tipos de Supabase

export type VoteChoice = 'a' | 'b'

export type DilemmaType = 'quick' | 'context' | 'justification'

export type DilemmaStatus = 'draft' | 'active' | 'archived'

export type UserTier = 'free' | 'premium'

export type MoralDimension =
  | 'individualism'
  | 'collectivism'
  | 'pragmatism'
  | 'idealism'
  | 'empathy'

export const MAX_DAILY_VOTES = 5
export const MAX_JUSTIFICATION_LENGTH = 140
export const MORAL_DIMENSIONS: MoralDimension[] = [
  'individualism',
  'collectivism',
  'pragmatism',
  'idealism',
  'empathy',
]
