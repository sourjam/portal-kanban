# Portal Board

A frontend-only Kanban board built with React and TypeScript. Cards can be reordered within columns or dragged between To Do, Doing, and Done with a live placement preview. Rick and Morty characters are loaded from the public GraphQL API and assigned to cards. Moving a card into Done triggers a portal animation and temporary color-scheme change.

## Requirements

- Node.js 20.19 or newer
- npm
- Internet access for the Rick and Morty API and character images

## Install and run

```bash
git clone <repository-url>
cd healthie-prework
npm install
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

## Available commands

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build
npm run lint      # Run Oxlint
npm test          # Run Vitest unit and component tests
npm run test:e2e  # Run Playwright tests
```

Install Playwright's Chromium build before running end-to-end tests for the first time:

```bash
npx playwright install chromium
```

## Application behavior

- Board state is saved in localStorage under `portal-board:v1`.
- **New board** starts with empty columns.
- **Reset board** restores the seeded demo data.
- The character picker loads the first page of characters from `https://rickandmortyapi.com/graphql`.
- Drag-and-drop supports pointer and keyboard input.
