import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { KanbanBoard } from '../components/KanbanBoard'
import { KanbanCard } from '../components/KanbanCard'
import { columnOrder } from '../initialBoardState'
import type { BoardMove, BoardState } from '../types'
import { projectBoard } from './projectBoard'
import { resolveDrop } from './resolveDrop'
import { shouldTriggerPortal } from './shouldTriggerPortal'
import { SortableKanbanColumn } from './SortableKanbanColumn'
import {
  isBoardDndData,
  type BoardDndData,
  type DragSession,
} from './types'

interface DndKanbanBoardProps {
  board: BoardState
  onMoveItem: (move: BoardMove) => void
  onItemEnteredDone?: (move: BoardMove) => void
}

export function DndKanbanBoard({
  board,
  onMoveItem,
  onItemEnteredDone,
}: DndKanbanBoardProps) {
  const [dragSession, setDragSession] = useState<DragSession | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const visibleBoard = useMemo(
    () =>
      dragSession
        ? projectBoard(board, dragSession.projectedMove)
        : board,
    [board, dragSession],
  )

  const activeItem = dragSession
    ? board.items[dragSession.itemId]
    : undefined

  const resolveEventDrop = (over: BoardDndData | undefined) => {
    if (!dragSession) return null

    return resolveDrop({
      board: visibleBoard,
      itemId: dragSession.itemId,
      sourceColumnId: dragSession.originColumnId,
      over,
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current
    if (!isBoardDndData(data) || data.type !== 'item') return

    const originIndex = board.columns[data.columnId].itemIds.indexOf(data.itemId)
    if (originIndex < 0) return

    setDragSession({
      itemId: data.itemId,
      originColumnId: data.columnId,
      originIndex,
      projectedMove: {
        itemId: data.itemId,
        sourceColumnId: data.columnId,
        destinationColumnId: data.columnId,
        destinationIndex: originIndex,
      },
    })
  }

  const handleDragOver = (event: DragOverEvent) => {
    const overData = event.over?.data.current
    const move = resolveEventDrop(
      isBoardDndData(overData) ? overData : undefined,
    )
    if (!move) return

    setDragSession((current) => {
      if (!current) return current
      const previous = current.projectedMove
      if (
        previous.destinationColumnId === move.destinationColumnId &&
        previous.destinationIndex === move.destinationIndex
      ) {
        return current
      }

      return { ...current, projectedMove: move }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const overData = event.over?.data.current
    const finalMove = resolveEventDrop(
      isBoardDndData(overData) ? overData : undefined,
    )

    if (finalMove && dragSession) {
      onMoveItem(finalMove)
      if (shouldTriggerPortal(finalMove)) {
        onItemEnteredDone?.(finalMove)
      }
    }

    setDragSession(null)
  }

  const handleDragCancel = (_event: DragCancelEvent) => {
    setDragSession(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <KanbanBoard>
        {columnOrder.map((columnId) => {
          const column = visibleBoard.columns[columnId]
          const items = column.itemIds.flatMap((id) =>
            visibleBoard.items[id] ? [visibleBoard.items[id]] : [],
          )

          return (
            <SortableKanbanColumn
              key={column.id}
              column={column}
              items={items}
            />
          )
        })}
      </KanbanBoard>

      <DragOverlay>
        {activeItem ? <KanbanCard item={activeItem} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
