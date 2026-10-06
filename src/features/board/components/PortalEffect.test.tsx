import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PortalEffect } from './PortalEffect'

afterEach(() => vi.useRealTimers())

describe('PortalEffect', () => {
  it('centers itself on the moved card and completes after its lifetime', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    const anchor = document.createElement('div')
    anchor.dataset.boardItemId = 'mission'
    anchor.getBoundingClientRect = vi.fn(() => ({
      left: 200,
      top: 100,
      width: 300,
      height: 160,
      right: 500,
      bottom: 260,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    }))
    document.body.append(anchor)

    const { container } = render(
      <PortalEffect itemId="mission" onComplete={onComplete} />,
    )

    expect(container.querySelector('.portal-effect__portal')).toHaveStyle({
      left: '350px',
      top: '180px',
    })

    vi.advanceTimersByTime(1800)
    expect(onComplete).toHaveBeenCalledOnce()

    anchor.remove()
  })
})
