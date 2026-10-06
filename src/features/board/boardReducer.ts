import { moveBoardItem } from './moveBoardItem'
import type { BoardItem, BoardMove, BoardState } from './types'

export type BoardAction =
  | {
      type: 'item/created'
      item: BoardItem
    }
  | {
      type: 'item/moved'
      move: BoardMove
    }
  | {
      type: 'board/replaced'
      board: BoardState
    }

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  switch (action.type) {
    case 'item/created':
      return {
        items: {
          ...state.items,
          [action.item.id]: action.item,
        },
        columns: {
          ...state.columns,
          todo: {
            ...state.columns.todo,
            itemIds: [...state.columns.todo.itemIds, action.item.id],
          },
        },
      }
    case 'item/moved':
      return moveBoardItem(state, action.move)
    case 'board/replaced':
      return action.board
  }
}
