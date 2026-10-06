import type { ReactNode } from 'react'

interface KanbanBoardProps {
  children: ReactNode
}

export function KanbanBoard({ children }: KanbanBoardProps) {
  return (
    <div className="kanban-board" aria-label="Kanban board">
      {children}
    </div>
  )
}
