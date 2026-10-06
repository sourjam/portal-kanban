import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreateItemDialog } from './CreateItemDialog'

const characters = [
  {
    id: '1',
    name: 'Rick Sanchez',
    image: 'rick.jpg',
    species: 'Human',
    status: 'Alive' as const,
  },
]

describe('CreateItemDialog', () => {
  it('rejects a whitespace-only title and missing character', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()

    render(
      <CreateItemDialog
        isOpen
        characters={characters}
        characterStatus="success"
        onRetryCharacters={vi.fn()}
        onClose={vi.fn()}
        onCreate={onCreate}
      />,
    )

    await user.type(screen.getByLabelText('Item title'), '   ')
    await user.click(screen.getByRole('button', { name: 'Create item' }))

    expect(screen.getByText('Enter a title.')).toBeInTheDocument()
    expect(screen.getByText('Choose a character.')).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('submits a trimmed title and its selected character', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()

    render(
      <CreateItemDialog
        isOpen
        characters={characters}
        characterStatus="success"
        onRetryCharacters={vi.fn()}
        onClose={vi.fn()}
        onCreate={onCreate}
      />,
    )

    await user.type(screen.getByLabelText('Item title'), '  Repair portal gun  ')
    await user.selectOptions(screen.getByLabelText('Character'), '1')
    await user.click(screen.getByRole('button', { name: 'Create item' }))

    expect(onCreate).toHaveBeenCalledWith({
      title: 'Repair portal gun',
      character: characters[0],
    })
  })
})
