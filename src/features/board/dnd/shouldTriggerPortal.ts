import type { BoardMove } from '../types'

export function shouldTriggerPortal(move: BoardMove): boolean {
  return (
    move.sourceColumnId !== 'done' && move.destinationColumnId === 'done'
  )
}
