# Change Log

## Unreleased

Changes are listed in implementation order.

### 1. Project setup

- Created a Vite application with React and TypeScript.
- Added Oxlint and standard development, build, preview, and lint scripts.
- Renamed the package to `healthie-prework`.
- Preserved the interview guide PDF in the repository root.

### 2. Frontend specification

- Added `docs/frontend-spec.md`.
- Documented requirements, component boundaries, state shape, GraphQL integration, drag-and-drop behavior, accessibility, responsive behavior, testing, persistence, and visual tokens.
- Updated the specification as implementation decisions changed.

### 3. Static Kanban board

- Added a three-column board: To Do, Doing, and Done.
- Added reusable page header, column header, column, and card components.
- Added seeded demo items in `src/features/board/initialBoardState.ts`.
- Added a normalized board shape:
  - Items are stored in an ID-indexed record.
  - Columns store ordered item ID arrays.
- Added Rick and Morty-inspired semantic color tokens.
- Added responsive horizontal column scrolling for narrow screens.

### 4. Character API and item creation

- Added a native `fetch` client for the Rick and Morty GraphQL endpoint.
- Kept the GraphQL query and transport logic in separate modules.
- Added `useCharacters` for request loading, success, error, cancellation, and retry state.
- Added an Add item dialog with required title and character fields.
- Added inline validation for blank or whitespace-only titles and missing characters.
- New items are assigned client-side UUIDs and appended to To Do.

Technical decision:

- Native `fetch` sends the GraphQL query. Apollo or urql was not added because the app currently has one read-only query and does not require normalized API caching.

Gotcha:

- React Strict Mode can start the mount request twice in development. The first request is aborted during effect cleanup so stale results cannot update state.

### 5. Test setup

- Added Vitest, jsdom, React Testing Library, user-event, and jest-dom matchers.
- Added focused tests for:
  - Board reducer transitions
  - Valid and invalid item creation
  - End-to-end component-level Add item flow
  - GraphQL response mapping
- Added automatic DOM cleanup and localStorage cleanup between tests.

### 6. Drag and drop

- Added `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
- Isolated dnd-kit imports under `src/features/board/dnd/`.
- Kept reducer actions and board types independent of dnd-kit event types.
- Added pointer and keyboard sensors and dedicated card drag handles.
- Added same-column reordering, cross-column movement, empty-column targets, and a drag overlay.
- Added live cross-column previews using transient projected state.
- The committed board is updated once on drop; cancellation discards the projection.

Technical detail:

- `projectBoard` derives the visible board from committed state plus a `BoardMove`.
- `resolveDrop` converts card or column targets into a library-independent move command.

Gotcha:

- Updating committed state during `onDragOver` would require rollback handling and could trigger target oscillation as the DOM changes. The implementation instead keeps a separate drag session and projected move.

### 7. Avatar loading states

- Added a reusable `CharacterAvatar` component.
- Added a shimmer skeleton while avatar images load.
- Added a character-initial fallback for failed images.
- Kept fixed avatar dimensions to prevent card layout shift.
- Disabled extended animation for reduced-motion users.

### 8. Board persistence and demo controls

- Added versioned localStorage persistence under `portal-board:v1`.
- Added validation for stored item, character, column, and ordering data.
- Missing, malformed, or outdated storage falls back to the seeded demo board.
- Board changes, item creation, and drag-and-drop positions are persisted.
- Added fixed top-right demo controls:
  - New board creates and persists an empty board.
  - Reset board restores and persists the seeded demo data.

Gotcha:

- Storage access can fail because of browser policy or quota. Read and write failures are caught so the in-memory board remains usable.

### 9. Portal completion effect

- Added a portal effect when a card moves from To Do or Doing into Done.
- Reordering an item already in Done does not trigger the effect.
- Added rotating rings, particles, and a temporary green board palette.
- The effect is non-interactive, lasts 1.8 seconds, and remains outside persisted board state.
- Repeated completions remount and restart the effect.

Bug fix:

- The first implementation centered the portal on the drag overlay's release coordinates. This shifted the portal based on where the pointer was released.
- The final implementation waits for the moved card to render, measures its final DOM rectangle in a layout effect, and centers the portal on the card before paint.
- The portal is hidden until its anchor measurement completes to prevent a visible position jump.

### 10. Playwright drag-and-drop coverage

- Added Playwright with an isolated Chromium project and Vite web server configuration.
- Added a real-pointer cross-column test that moves a card into Done, verifies the portal, reloads, and verifies persistence.
- Added a same-column reorder test that verifies card order and confirms the portal does not appear.
- Mocked the unrelated character API request to keep drag tests deterministic.

Gotcha:

- Playwright's HTML5 `dragTo` is not appropriate for dnd-kit's pointer sensor. The tests use `page.mouse` with incremental movement.
- Restricted Vitest discovery to `src/**/*.test.{ts,tsx}` so it does not try to execute Playwright specifications.

### Future roadmap: mobile board interaction

The following mobile findings and suggestions are documented but not implemented:

- The current `minmax(300px, 82vw)` mobile column sizing leaves adjacent columns visibly cut off.
- Replace the partial-column layout with a full-width horizontal pager using `grid-auto-columns: calc(100vw - 32px)` and mandatory scroll snapping.
- Add To Do, Doing, and Done tabs that scroll to a column and reflect the currently visible column.
- Hide the native horizontal scrollbar while retaining touch scrolling.
- Move demo controls into normal header flow or a compact menu on narrow screens to prevent title overlap.
- Replace the combined pointer behavior with separate mouse, touch, and keyboard sensors.
- Use long-press activation for touch dragging, with an activation delay and movement tolerance.
- Disable scroll snapping during an active drag and support edge-triggered horizontal scrolling to reach off-screen columns.
- Add a non-drag **Move to column** card action as a reliable touch and WCAG 2.5.7 fallback.
- Add mobile Playwright coverage for column paging, touch dragging, empty-column drops, drag cancellation, and the Move action.

### Current verification

- 16 Vitest tests passing across 10 test files.
- 2 Playwright tests passing in Chromium.
- Lint passing.
- TypeScript and production build passing.
