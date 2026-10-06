import type { BoardMove, BoardState } from './types'

export function moveBoardItem(
  state: BoardState,
  move: BoardMove,
): BoardState {
  const source = state.columns[move.sourceColumnId]
  const destination = state.columns[move.destinationColumnId]
  const sourceIndex = source.itemIds.indexOf(move.itemId)

  if (sourceIndex < 0 || !state.items[move.itemId]) return state

  if (source.id === destination.id) {
    const itemIds = [...source.itemIds]
    itemIds.splice(sourceIndex, 1)
    const destinationIndex = Math.max(
      0,
      Math.min(move.destinationIndex, itemIds.length),
    )
    itemIds.splice(destinationIndex, 0, move.itemId)

    return {
      ...state,
      columns: {
        ...state.columns,
        [source.id]: { ...source, itemIds },
      },
    }
  }

  const sourceItemIds = source.itemIds.filter((id) => id !== move.itemId)
  const destinationItemIds = destination.itemIds.filter(
    (id) => id !== move.itemId,
  )
  const destinationIndex = Math.max(
    0,
    Math.min(move.destinationIndex, destinationItemIds.length),
  )
  destinationItemIds.splice(destinationIndex, 0, move.itemId)

  return {
    ...state,
    columns: {
      ...state.columns,
      [source.id]: { ...source, itemIds: sourceItemIds },
      [destination.id]: { ...destination, itemIds: destinationItemIds },
    },
  }
}
