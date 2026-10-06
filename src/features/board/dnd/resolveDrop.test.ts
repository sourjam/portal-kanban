import { describe, expect, it } from 'vitest'
import { resolveDrop } from './resolveDrop'
import type { BoardState } from '../types'

const board: BoardState = {
  items: {},
  columns: {
    todo: { id: 'todo', title: 'To Do', itemIds: ['a'] },
    doing: { id: 'doing', title: 'Doing', itemIds: [] },
    done: { id: 'done', title: 'Done', itemIds: [] },
  },
}

describe('resolveDrop', () => {
  it('resolves an empty column to insertion index zero', () => {
    expect(
      resolveDrop({
        board,
        itemId: 'a',
        sourceColumnId: 'todo',
        over: { type: 'column', columnId: 'doing' },
      }),
    ).toEqual({
      itemId: 'a',
      sourceColumnId: 'todo',
      destinationColumnId: 'doing',
      destinationIndex: 0,
    })
  })

  it('returns no move when there is no drop target', () => {
    expect(
      resolveDrop({
        board,
        itemId: 'a',
        sourceColumnId: 'todo',
        over: undefined,
      }),
    ).toBeNull()
  })
})
