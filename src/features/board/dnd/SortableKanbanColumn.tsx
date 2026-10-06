import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KanbanColumn } from '../components/KanbanColumn'
import type { BoardColumn, BoardItem } from '../types'
import { SortableKanbanCard } from './SortableKanbanCard'

interface SortableKanbanColumnProps {
  column: BoardColumn
  items: BoardItem[]
}

export function SortableKanbanColumn({
  column,
  items,
}: SortableKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${column.id}`,
    data: { type: 'column', columnId: column.id },
  })

  return (
    <SortableContext
      items={column.itemIds}
      strategy={verticalListSortingStrategy}
    >
      <KanbanColumn
        column={column}
        itemCount={items.length}
        containerRef={setNodeRef}
        isDropTarget={isOver}
      >
        {items.map((item) => (
          <SortableKanbanCard
            key={item.id}
            item={item}
            columnId={column.id}
          />
        ))}
      </KanbanColumn>
    </SortableContext>
  )
}
