import { useState } from 'react'
import { CharacterPicker } from '../../characters/components/CharacterPicker'
import type { CharacterSummary } from '../../characters/types'

interface CreateItemDialogProps {
  isOpen: boolean
  characters: CharacterSummary[]
  characterStatus: 'loading' | 'success' | 'error'
  characterError?: string
  onRetryCharacters: () => void
  onClose: () => void
  onCreate: (input: {
    title: string
    character: CharacterSummary
  }) => void
}

export function CreateItemDialog({
  isOpen,
  characters,
  characterStatus,
  characterError,
  onRetryCharacters,
  onClose,
  onCreate,
}: CreateItemDialogProps) {
  const [title, setTitle] = useState('')
  const [selectedCharacterId, setSelectedCharacterId] = useState('')
  const [wasSubmitted, setWasSubmitted] = useState(false)

  if (!isOpen) return null

  const trimmedTitle = title.trim()
  const selectedCharacter = characters.find(
    (character) => character.id === selectedCharacterId,
  )

  const resetAndClose = () => {
    setTitle('')
    setSelectedCharacterId('')
    setWasSubmitted(false)
    onClose()
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) resetAndClose()
    }}>
      <section
        className="create-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-item-title"
      >
        <div className="create-dialog__header">
          <div>
            <p className="create-dialog__eyebrow">New mission</p>
            <h2 id="create-item-title">Add an item</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close add item dialog"
            onClick={resetAndClose}
          >
            ×
          </button>
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            setWasSubmitted(true)

            if (!trimmedTitle || !selectedCharacter) return

            onCreate({ title: trimmedTitle, character: selectedCharacter })
            setTitle('')
            setSelectedCharacterId('')
            setWasSubmitted(false)
          }}
        >
          <div className="form-field">
            <label className="form-field__label" htmlFor="item-title">
              Item title
            </label>
            <input
              id="item-title"
              value={title}
              autoFocus
              aria-invalid={wasSubmitted && !trimmedTitle}
              aria-describedby={
                wasSubmitted && !trimmedTitle ? 'title-error' : undefined
              }
              placeholder="e.g. Repair the portal gun"
              onChange={(event) => setTitle(event.target.value)}
            />
            {wasSubmitted && !trimmedTitle && (
              <span className="form-field__error" id="title-error">
                Enter a title.
              </span>
            )}
          </div>

          <CharacterPicker
            characters={characters}
            selectedId={selectedCharacterId}
            status={characterStatus}
            errorMessage={characterError}
            hasError={wasSubmitted && !selectedCharacter}
            onChange={setSelectedCharacterId}
            onRetry={onRetryCharacters}
          />

          <div className="create-dialog__actions">
            <button
              className="button button--secondary"
              type="button"
              onClick={resetAndClose}
            >
              Cancel
            </button>
            <button
              className="button button--primary"
              type="submit"
              disabled={characterStatus !== 'success'}
            >
              Create item
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
