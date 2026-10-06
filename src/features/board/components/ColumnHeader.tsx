import type { ColumnId } from '../types'

interface ColumnHeaderProps {
  columnId: ColumnId
  title: string
  itemCount: number
}

export function ColumnHeader({
  columnId,
  title,
  itemCount,
}: ColumnHeaderProps) {
  return (
    <header className="column-header" data-column={columnId}>
      <div className="column-header__title-group">
        <span className="column-header__marker" aria-hidden="true" />
        <h2 id={`column-${columnId}-title`}>{title}</h2>
      </div>
      <span
        className="column-header__count"
        aria-label={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      >
        {itemCount}
      </span>
    </header>
  )
}
