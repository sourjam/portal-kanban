import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties } from 'react'
import { KanbanCard } from '../components/KanbanCard'
import type { BoardItem, ColumnId } from '../types'

interface SortableKanbanCardProps {
  item: BoardItem
  columnId: ColumnId
}

export function SortableKanbanCard({
  item,
  columnId,
}: SortableKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { type: 'item', itemId: item.id, columnId },
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.22 : undefined,
    zIndex: isDragging ? 2 : undefined,
  }

  return (
    <li ref={setNodeRef} style={style} data-board-item-id={item.id}>
      <KanbanCard
        item={item}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </li>
  )
}
