interface BoardHeaderProps {
  itemCount: number
  onCreateItem: () => void
}

export function BoardHeader({ itemCount, onCreateItem }: BoardHeaderProps) {
  return (
    <header className="board-header">
      <div className="board-header__identity">
        <span className="board-header__portal" aria-hidden="true" />
        <div>
          <p className="board-header__eyebrow">Interdimensional workflow</p>
          <h1>Portal Board</h1>
          <p className="board-header__subtitle">
            Keep every mission moving across the multiverse.
          </p>
        </div>
      </div>

      <div className="board-header__actions">
        <span className="board-header__total">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <button
          className="button button--primary"
          type="button"
          onClick={onCreateItem}
        >
          <span aria-hidden="true">+</span>
          Add item
        </button>
      </div>
    </header>
  )
}
