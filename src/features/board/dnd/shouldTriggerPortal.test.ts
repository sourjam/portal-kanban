import { describe, expect, it } from 'vitest'
import { shouldTriggerPortal } from './shouldTriggerPortal'
import type { BoardMove } from '../types'

function move(
  sourceColumnId: BoardMove['sourceColumnId'],
  destinationColumnId: BoardMove['destinationColumnId'],
): BoardMove {
  return {
    itemId: 'mission',
    sourceColumnId,
    destinationColumnId,
    destinationIndex: 0,
  }
}

describe('shouldTriggerPortal', () => {
  it('celebrates entering Done but not reordering within Done', () => {
    expect(shouldTriggerPortal(move('doing', 'done'))).toBe(true)
    expect(shouldTriggerPortal(move('done', 'done'))).toBe(false)
  })
})
