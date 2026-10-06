import { useCallback, useState } from 'react'
import { BoardHeader } from '../features/board/components/BoardHeader'
import { CreateItemDialog } from '../features/board/components/CreateItemDialog'
import { DemoBoardControls } from '../features/board/components/DemoBoardControls'
import { PortalEffect } from '../features/board/components/PortalEffect'
import { DndKanbanBoard } from '../features/board/dnd/DndKanbanBoard'
import {
  createEmptyBoardState,
  initialBoardState,
} from '../features/board/initialBoardState'
import { usePersistedBoard } from '../features/board/persistence/usePersistedBoard'
import { useCharacters } from '../features/characters/useCharacters'

export function KanbanPage() {
  const { board, dispatch } = usePersistedBoard()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [portalEvent, setPortalEvent] = useState<{
    id: number
    itemId: string
  } | null>(null)
  const { characters, status, error, retry } = useCharacters()
  const endPortalEffect = useCallback(() => setPortalEvent(null), [])

  return (
    <main
      className={`page-shell${portalEvent ? ' page-shell--portal-active' : ''}`}
    >
      <BoardHeader
        itemCount={Object.keys(board.items).length}
        onCreateItem={() => setIsCreateOpen(true)}
      />
      <DndKanbanBoard
        board={board}
        onMoveItem={(move) => dispatch({ type: 'item/moved', move })}
        onItemEnteredDone={(move) =>
          setPortalEvent((current) => ({
            id: (current?.id ?? 0) + 1,
            itemId: move.itemId,
          }))
        }
      />
      <DemoBoardControls
        onNewBoard={() =>
          dispatch({ type: 'board/replaced', board: createEmptyBoardState() })
        }
        onResetBoard={() =>
          dispatch({ type: 'board/replaced', board: initialBoardState })
        }
      />
      {portalEvent && (
        <PortalEffect
          key={portalEvent.id}
          itemId={portalEvent.itemId}
          onComplete={endPortalEffect}
        />
      )}
      <CreateItemDialog
        isOpen={isCreateOpen}
        characters={characters}
        characterStatus={status === 'idle' ? 'loading' : status}
        characterError={error ?? undefined}
        onRetryCharacters={retry}
        onClose={() => setIsCreateOpen(false)}
        onCreate={({ title, character }) => {
          dispatch({
            type: 'item/created',
            item: {
              id: crypto.randomUUID(),
              title,
              character,
            },
          })
          setIsCreateOpen(false)
        }}
      />
    </main>
  )
}
