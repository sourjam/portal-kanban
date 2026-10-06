import type { CharacterPage, CharacterSummary } from '../types'
import { charactersQuery } from './characterQuery'

const endpoint = 'https://rickandmortyapi.com/graphql'

interface RawCharacter {
  id: string
  name: string
  image: string
  species: string
  status: string
}

interface RawResponse {
  data?: {
    characters?: {
      info: CharacterPage['pageInfo']
      results: RawCharacter[]
    }
  }
  errors?: Array<{ message?: string }>
}

function normalizeCharacter(character: RawCharacter): CharacterSummary {
  const status =
    character.status === 'Alive' || character.status === 'Dead'
      ? character.status
      : 'unknown'

  return {
    id: character.id,
    name: character.name,
    image: character.image,
    species: character.species,
    status,
  }
}

export async function fetchCharacters({
  page,
  signal,
}: {
  page: number
  signal?: AbortSignal
}): Promise<CharacterPage> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: charactersQuery, variables: { page } }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Character request failed with status ${response.status}.`)
  }

  const payload = (await response.json()) as RawResponse

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? 'The character request failed.')
  }

  const result = payload.data?.characters
  if (!result || !Array.isArray(result.results)) {
    throw new Error('The character response was missing expected data.')
  }

  return {
    characters: result.results.map(normalizeCharacter),
    pageInfo: result.info,
  }
}
