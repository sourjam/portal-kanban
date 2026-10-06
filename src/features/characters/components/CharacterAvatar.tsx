import { useState } from 'react'

interface CharacterAvatarProps {
  src: string
  characterName: string
  size: number
}

type ImageStatus = 'loading' | 'loaded' | 'error'

export function CharacterAvatar({
  src,
  characterName,
  size,
}: CharacterAvatarProps) {
  const [imageState, setImageState] = useState<{
    src: string
    status: ImageStatus
  }>({ src, status: 'loading' })
  const status = imageState.src === src ? imageState.status : 'loading'
  const fallbackLetter = characterName.trim().charAt(0).toUpperCase() || '?'

  return (
    <span
      className="character-avatar"
      data-state={status}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {status === 'loading' && (
        <span className="character-avatar__skeleton" />
      )}
      {status === 'error' && (
        <span className="character-avatar__fallback">{fallbackLetter}</span>
      )}
      <img
        className="character-avatar__image"
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onLoad={() => setImageState({ src, status: 'loaded' })}
        onError={() => setImageState({ src, status: 'error' })}
      />
    </span>
  )
}
