import { describe, expect, it } from 'vitest'
import { boardReducer } from './boardReducer'
import type { BoardState } from './types'

const rick = {
  id: '1',
  name: 'Rick Sanchez',
  image: 'rick.jpg',
  species: 'Human',
  status: 'Alive' as const,
}

const emptyBoard: BoardState = {
  items: {},
  columns: {
    todo: { id: 'todo', title: 'To Do', itemIds: [] },
    doing: { id: 'doing', title: 'Doing', itemIds: [] },
    done: { id: 'done', title: 'Done', itemIds: [] },
  },
}

describe('boardReducer', () => {
  it('appends a created item to To Do', () => {
    const item = {
      id: 'new-item',
      title: 'Repair the portal gun',
      character: rick,
    }

    const nextState = boardReducer(emptyBoard, {
      type: 'item/created',
      item,
    })

    expect(nextState.items[item.id]).toEqual(item)
    expect(nextState.columns.todo.itemIds).toEqual([item.id])
  })

  it('moves an item between columns at the requested position', () => {
    const state: BoardState = {
      ...emptyBoard,
      items: {
        first: { id: 'first', title: 'First', character: rick },
        second: { id: 'second', title: 'Second', character: rick },
      },
      columns: {
        ...emptyBoard.columns,
        todo: {
          ...emptyBoard.columns.todo,
          itemIds: ['first', 'second'],
        },
      },
    }

    const nextState = boardReducer(state, {
      type: 'item/moved',
      move: {
        itemId: 'second',
        sourceColumnId: 'todo',
        destinationColumnId: 'doing',
        destinationIndex: 0,
      },
    })

    expect(nextState.columns.todo.itemIds).toEqual(['first'])
    expect(nextState.columns.doing.itemIds).toEqual(['second'])
  })
})
