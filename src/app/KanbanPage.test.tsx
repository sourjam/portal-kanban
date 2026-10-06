import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { KanbanPage } from './KanbanPage'

function stubCharacterRequest() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            characters: {
              info: { count: 1, pages: 1, next: null, prev: null },
              results: [
                {
                  id: '5',
                  name: 'Jerry Smith',
                  image: 'jerry.jpg',
                  species: 'Human',
                  status: 'Alive',
                },
              ],
            },
          },
        }),
        { status: 200 },
      ),
    ),
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('KanbanPage', () => {
  it('opens the form and appends a valid item to To Do', async () => {
    stubCharacterRequest()
    const user = userEvent.setup()

    render(<KanbanPage />)

    await user.click(screen.getByRole('button', { name: 'Add item' }))
    expect(screen.getByRole('dialog', { name: 'Add an item' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Item title'), 'Call the Galactic Federation')
    await user.selectOptions(await screen.findByLabelText('Character'), '5')
    await user.click(screen.getByRole('button', { name: 'Create item' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const todoColumn = screen.getByRole('region', { name: /to do/i })
    expect(
      within(todoColumn).getByRole('heading', {
        name: 'Call the Galactic Federation',
      }),
    ).toBeInTheDocument()
    expect(within(todoColumn).getByLabelText('3 items')).toBeInTheDocument()
  })

  it('starts a persisted empty board and can restore the demo board', async () => {
    stubCharacterRequest()
    const user = userEvent.setup()
    const { unmount } = render(<KanbanPage />)

    await user.click(screen.getByRole('button', { name: 'New board' }))
    expect(
      screen.queryByRole('heading', { name: 'Calibrate the portal gun' }),
    ).not.toBeInTheDocument()

    unmount()
    render(<KanbanPage />)
    expect(
      screen.queryByRole('heading', { name: 'Calibrate the portal gun' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset board' }))
    expect(
      screen.getByRole('heading', { name: 'Calibrate the portal gun' }),
    ).toBeInTheDocument()
  })
})
