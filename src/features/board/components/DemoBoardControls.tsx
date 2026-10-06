interface DemoBoardControlsProps {
  onNewBoard: () => void
  onResetBoard: () => void
}

export function DemoBoardControls({
  onNewBoard,
  onResetBoard,
}: DemoBoardControlsProps) {
  return (
    <aside className="demo-controls" aria-label="Demo board controls">
      <span className="demo-controls__label">Demo</span>
      <button type="button" onClick={onNewBoard}>
        New board
      </button>
      <span className="demo-controls__divider" aria-hidden="true" />
      <button type="button" onClick={onResetBoard}>
        Reset board
      </button>
    </aside>
  )
}
