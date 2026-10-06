import type { HTMLAttributes } from 'react'
import { CharacterAvatar } from '../../characters/components/CharacterAvatar'
import type { BoardItem } from '../types'

interface KanbanCardProps {
  item: BoardItem
  isDragging?: boolean
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>
}

export function KanbanCard({
  item,
  isDragging = false,
  dragHandleProps,
}: KanbanCardProps) {
  const { character } = item

  return (
    <article
      className={`kanban-card${isDragging ? ' kanban-card--dragging' : ''}`}
    >
      <div className="kanban-card__topline">
        <span className="kanban-card__label">Mission</span>
        {dragHandleProps ? (
          <button
            className="kanban-card__grip"
            type="button"
            aria-label={`Move ${item.title}`}
            {...dragHandleProps}
          >
            ⠿
          </button>
        ) : (
          <span className="kanban-card__grip" aria-hidden="true">
            ⠿
          </span>
        )}
      </div>

      <h3>{item.title}</h3>

      <div className="kanban-card__character">
        <CharacterAvatar
          src={character.image}
          characterName={character.name}
          size={48}
        />
        <div className="kanban-card__character-copy">
          <strong>{character.name}</strong>
          <span>{character.species}</span>
        </div>
        <span
          className="status-badge"
          data-status={character.status.toLowerCase()}
        >
          {character.status}
        </span>
      </div>
    </article>
  )
}
