import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCharacters } from './fetchCharacters'

afterEach(() => vi.unstubAllGlobals())

describe('fetchCharacters', () => {
  it('maps a successful GraphQL response into application data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            characters: {
              info: { count: 826, pages: 42, next: 2, prev: null },
              results: [
                {
                  id: '1',
                  name: 'Rick Sanchez',
                  image: 'rick.jpg',
                  species: 'Human',
                  status: 'Alive',
                },
              ],
            },
          },
        }),
        { status: 200 },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchCharacters({ page: 1 })).resolves.toEqual({
      characters: [
        {
          id: '1',
          name: 'Rick Sanchez',
          image: 'rick.jpg',
          species: 'Human',
          status: 'Alive',
        },
      ],
      pageInfo: { count: 826, pages: 42, next: 2, prev: null },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/graphql',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
