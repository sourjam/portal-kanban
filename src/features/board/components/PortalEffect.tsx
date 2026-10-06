import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'

interface PortalEffectProps {
  itemId: string
  onComplete: () => void
}

type ParticleStyle = CSSProperties & {
  '--particle-angle': string
}

export function PortalEffect({ itemId, onComplete }: PortalEffectProps) {
  const portalRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const anchor = Array.from(
      document.querySelectorAll<HTMLElement>('[data-board-item-id]'),
    ).find((element) => element.dataset.boardItemId === itemId)
    const portal = portalRef.current
    if (!portal) return

    const rect = anchor?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

    portal.style.left = `${x}px`
    portal.style.top = `${y}px`
    portal.dataset.positioned = 'true'
  }, [itemId])

  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 1800)
    return () => window.clearTimeout(timeout)
  }, [onComplete])

  return (
    <div className="portal-effect" aria-hidden="true">
      <div className="portal-effect__wash" />
      <div
        ref={portalRef}
        className="portal-effect__portal"
        data-positioned="false"
      >
        <span className="portal-effect__ring portal-effect__ring--outer" />
        <span className="portal-effect__ring portal-effect__ring--middle" />
        <span className="portal-effect__ring portal-effect__ring--inner" />
        <span className="portal-effect__core" />
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            className="portal-effect__particle"
            style={
              {
                '--particle-angle': `${index * 36}deg`,
              } as ParticleStyle
            }
          />
        ))}
      </div>
    </div>
  )
}
