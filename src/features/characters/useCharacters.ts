import { useCallback, useEffect, useState } from 'react'
import { fetchCharacters } from './api/fetchCharacters'
import type { CharacterRequestStatus, CharacterSummary } from './types'

interface CharactersState {
  status: CharacterRequestStatus
  characters: CharacterSummary[]
  error: string | null
}

export function useCharacters() {
  const [requestVersion, setRequestVersion] = useState(0)
  const [state, setState] = useState<CharactersState>({
    status: 'loading',
    characters: [],
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    void fetchCharacters({ page: 1, signal: controller.signal })
      .then((page) => {
        setState({
          status: 'success',
          characters: page.characters,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return

        setState({
          status: 'error',
          characters: [],
          error:
            error instanceof Error
              ? error.message
              : 'Characters could not be loaded.',
        })
      })

    return () => controller.abort()
  }, [requestVersion])

  const retry = useCallback(() => {
    setState((current) => ({ ...current, status: 'loading', error: null }))
    setRequestVersion((version) => version + 1)
  }, [])

  return { ...state, retry }
}
