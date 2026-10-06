import { useEffect, useReducer } from 'react'
import { boardReducer } from '../boardReducer'
import { initialBoardState } from '../initialBoardState'
import { loadBoard, saveBoard } from './boardStorage'

export function usePersistedBoard() {
  const [board, dispatch] = useReducer(
    boardReducer,
    initialBoardState,
    (demoBoard) => loadBoard() ?? demoBoard,
  )

  useEffect(() => {
    saveBoard(board)
  }, [board])

  return { board, dispatch }
}
