import { describe, expect, it } from 'vitest'
import { initialBoardState } from '../initialBoardState'
import { loadBoard, saveBoard } from './boardStorage'

function createStorage() {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe('boardStorage', () => {
  it('round-trips a valid board using the versioned storage envelope', () => {
    const storage = createStorage()

    saveBoard(initialBoardState, storage)

    expect(loadBoard(storage)).toEqual(initialBoardState)
  })

  it('ignores malformed stored board data', () => {
    const storage = createStorage()
    storage.setItem('portal-board:v1', '{"version":1,"board":{"nope":true}}')

    expect(loadBoard(storage)).toBeNull()
  })
})
