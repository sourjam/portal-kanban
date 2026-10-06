export interface CharacterSummary {
  id: string
  name: string
  image: string
  species: string
  status: 'Alive' | 'Dead' | 'unknown'
}

export interface CharacterPage {
  characters: CharacterSummary[]
  pageInfo: {
    count: number
    pages: number
    next: number | null
    prev: number | null
  }
}

export type CharacterRequestStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
