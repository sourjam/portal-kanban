import { moveBoardItem } from '../moveBoardItem'
import type { BoardMove, BoardState } from '../types'

export function projectBoard(board: BoardState, move: BoardMove): BoardState {
  return moveBoardItem(board, move)
}
