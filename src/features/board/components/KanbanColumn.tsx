import type { ReactNode, Ref } from 'react'
import type { BoardColumn } from '../types'
import { ColumnHeader } from './ColumnHeader'

interface KanbanColumnProps {
  column: BoardColumn
  itemCount: number
  children: ReactNode
  containerRef?: Ref<HTMLElement>
  isDropTarget?: boolean
}

export function KanbanColumn({
  column,
  itemCount,
  children,
  containerRef,
  isDropTarget = false,
}: KanbanColumnProps) {
  return (
    <section
      ref={containerRef}
      className={`kanban-column${isDropTarget ? ' kanban-column--over' : ''}`}
      data-column={column.id}
      aria-labelledby={`column-${column.id}-title`}
    >
      <ColumnHeader
        columnId={column.id}
        title={column.title}
        itemCount={itemCount}
      />

      {itemCount > 0 ? (
        <ul className="kanban-column__items">{children}</ul>
      ) : (
        <div className="kanban-column__empty">
          <span aria-hidden="true">◎</span>
          <p>Drop a mission here</p>
        </div>
      )}
    </section>
  )
}
