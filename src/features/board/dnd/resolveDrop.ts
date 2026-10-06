import type { BoardMove, BoardState, ColumnId } from '../types'
import type { BoardDndData } from './types'

interface ResolveDropInput {
  board: BoardState
  itemId: string
  sourceColumnId: ColumnId
  over?: BoardDndData
}

export function resolveDrop({
  board,
  itemId,
  sourceColumnId,
  over,
}: ResolveDropInput): BoardMove | null {
  if (!over) return null

  const destination = board.columns[over.columnId]
  if (!destination) return null

  const destinationIndex =
    over.type === 'item'
      ? destination.itemIds.indexOf(over.itemId)
      : destination.itemIds.length

  if (destinationIndex < 0) return null

  return {
    itemId,
    sourceColumnId,
    destinationColumnId: destination.id,
    destinationIndex,
  }
}
