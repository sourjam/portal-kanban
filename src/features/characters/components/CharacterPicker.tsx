import type {
  CharacterRequestStatus,
  CharacterSummary,
} from '../types'

interface CharacterPickerProps {
  characters: CharacterSummary[]
  selectedId: string
  status: Exclude<CharacterRequestStatus, 'idle'>
  errorMessage?: string
  hasError?: boolean
  onChange: (characterId: string) => void
  onRetry: () => void
}

export function CharacterPicker({
  characters,
  selectedId,
  status,
  errorMessage,
  hasError = false,
  onChange,
  onRetry,
}: CharacterPickerProps) {
  if (status === 'error') {
    return (
      <div className="form-field">
        <span className="form-field__label">Character</span>
        <div className="request-error" role="alert">
          <span>{errorMessage ?? 'Characters could not be loaded.'}</span>
          <button className="button button--secondary" type="button" onClick={onRetry}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor="item-character">
        Character
      </label>
      <select
        id="item-character"
        value={selectedId}
        disabled={status === 'loading'}
        aria-invalid={hasError}
        aria-describedby={hasError ? 'character-error' : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">
          {status === 'loading' ? 'Loading characters…' : 'Choose a character'}
        </option>
        {characters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name} — {character.species}
          </option>
        ))}
      </select>
      {hasError && (
        <span className="form-field__error" id="character-error">
          Choose a character.
        </span>
      )}
    </div>
  )
}
