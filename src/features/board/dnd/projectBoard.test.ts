import { describe, expect, it } from 'vitest'
import { projectBoard } from './projectBoard'
import type { BoardState } from '../types'

const character = {
  id: '1',
  name: 'Rick Sanchez',
  image: 'rick.jpg',
  species: 'Human',
  status: 'Alive' as const,
}

const board: BoardState = {
  items: {
    a: { id: 'a', title: 'A', character },
    b: { id: 'b', title: 'B', character },
    c: { id: 'c', title: 'C', character },
  },
  columns: {
    todo: { id: 'todo', title: 'To Do', itemIds: ['a', 'b'] },
    doing: { id: 'doing', title: 'Doing', itemIds: ['c'] },
    done: { id: 'done', title: 'Done', itemIds: [] },
  },
}

describe('projectBoard', () => {
  it('previews a cross-column move without mutating the committed board', () => {
    const projected = projectBoard(board, {
      itemId: 'b',
      sourceColumnId: 'todo',
      destinationColumnId: 'doing',
      destinationIndex: 0,
    })

    expect(projected.columns.todo.itemIds).toEqual(['a'])
    expect(projected.columns.doing.itemIds).toEqual(['b', 'c'])
    expect(board.columns.todo.itemIds).toEqual(['a', 'b'])
    expect(board.columns.doing.itemIds).toEqual(['c'])
  })
})
