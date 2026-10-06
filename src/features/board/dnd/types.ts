import type { BoardMove, ColumnId } from '../types'

export type BoardDndData =
  | {
      type: 'item'
      itemId: string
      columnId: ColumnId
    }
  | {
      type: 'column'
      columnId: ColumnId
    }

export interface DragSession {
  itemId: string
  originColumnId: ColumnId
  originIndex: number
  projectedMove: BoardMove
}

export function isBoardDndData(value: unknown): value is BoardDndData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<BoardDndData>

  return (
    (candidate.type === 'item' || candidate.type === 'column') &&
    typeof candidate.columnId === 'string' &&
    (candidate.type !== 'item' || typeof candidate.itemId === 'string')
  )
}
