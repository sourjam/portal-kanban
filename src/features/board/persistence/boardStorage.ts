import type {
  BoardColumn,
  BoardItem,
  BoardState,
  ColumnId,
} from '../types'

const storageKey = 'portal-board:v1'
const storageVersion = 1
const columnIds: ColumnId[] = ['todo', 'doing', 'done']

export interface BoardStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isBoardItem(value: unknown, expectedId: string): value is BoardItem {
  if (!isRecord(value) || !isRecord(value.character)) return false

  const character = value.character
  return (
    value.id === expectedId &&
    typeof value.title === 'string' &&
    typeof character.id === 'string' &&
    typeof character.name === 'string' &&
    typeof character.image === 'string' &&
    typeof character.species === 'string' &&
    (character.status === 'Alive' ||
      character.status === 'Dead' ||
      character.status === 'unknown')
  )
}

function isBoardColumn(
  value: unknown,
  expectedId: ColumnId,
): value is BoardColumn {
  return (
    isRecord(value) &&
    value.id === expectedId &&
    typeof value.title === 'string' &&
    Array.isArray(value.itemIds) &&
    value.itemIds.every((id) => typeof id === 'string')
  )
}

function isBoardState(value: unknown): value is BoardState {
  if (!isRecord(value)) return false

  const items = value.items
  const columns = value.columns
  if (!isRecord(items) || !isRecord(columns)) return false

  const itemsAreValid = Object.entries(items).every(([id, item]) =>
    isBoardItem(item, id),
  )
  const columnsAreValid = columnIds.every((id) =>
    isBoardColumn(columns[id], id),
  )
  if (!itemsAreValid || !columnsAreValid) return false

  const referencedIds = columnIds.flatMap((id) => {
    const column = columns[id] as BoardColumn
    return column.itemIds
  })
  const uniqueReferencedIds = new Set(referencedIds)
  const itemIds = Object.keys(items)

  return (
    uniqueReferencedIds.size === referencedIds.length &&
    itemIds.length === referencedIds.length &&
    referencedIds.every((id) => id in items)
  )
}

export function loadBoard(
  storage: BoardStorage = window.localStorage,
): BoardState | null {
  try {
    const storedValue = storage.getItem(storageKey)
    if (!storedValue) return null

    const envelope: unknown = JSON.parse(storedValue)
    if (
      !isRecord(envelope) ||
      envelope.version !== storageVersion ||
      !isBoardState(envelope.board)
    ) {
      return null
    }

    return envelope.board
  } catch {
    return null
  }
}

export function saveBoard(
  board: BoardState,
  storage: BoardStorage = window.localStorage,
): void {
  try {
    storage.setItem(
      storageKey,
      JSON.stringify({ version: storageVersion, board }),
    )
  } catch {
    // Storage can be unavailable or full; the in-memory board remains usable.
  }
}
