import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CharacterAvatar } from './CharacterAvatar'

describe('CharacterAvatar', () => {
  it('shows a skeleton until the avatar image loads', () => {
    const { container } = render(
      <CharacterAvatar
        src="rick.jpg"
        characterName="Rick Sanchez"
        size={48}
      />,
    )

    const avatar = container.querySelector('.character-avatar')
    const image = container.querySelector('img')

    expect(avatar).toHaveAttribute('data-state', 'loading')
    expect(container.querySelector('.character-avatar__skeleton')).toBeInTheDocument()

    fireEvent.load(image!)

    expect(avatar).toHaveAttribute('data-state', 'loaded')
    expect(container.querySelector('.character-avatar__skeleton')).not.toBeInTheDocument()
  })

  it('replaces a failed image with a stable fallback', () => {
    const { container } = render(
      <CharacterAvatar
        src="missing.jpg"
        characterName="Rick Sanchez"
        size={48}
      />,
    )

    fireEvent.error(container.querySelector('img')!)

    expect(container.querySelector('.character-avatar')).toHaveAttribute(
      'data-state',
      'error',
    )
    expect(container.getElementsByClassName('character-avatar__fallback')[0]).toHaveTextContent('R')
  })
})
