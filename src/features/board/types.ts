import type { CharacterSummary } from '../characters/types'

export type ColumnId = 'todo' | 'doing' | 'done'

export interface BoardItem {
  id: string
  title: string
  character: CharacterSummary
}

export interface BoardColumn {
  id: ColumnId
  title: string
  itemIds: string[]
}

export interface BoardState {
  items: Record<string, BoardItem>
  columns: Record<ColumnId, BoardColumn>
}

export interface BoardMove {
  itemId: string
  sourceColumnId: ColumnId
  destinationColumnId: ColumnId
  destinationIndex: number
}
