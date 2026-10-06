import type { BoardState, ColumnId } from './types'

export const columnOrder: ColumnId[] = ['todo', 'doing', 'done']

export function createEmptyBoardState(): BoardState {
  return {
    items: {},
    columns: {
      todo: { id: 'todo', title: 'To Do', itemIds: [] },
      doing: { id: 'doing', title: 'Doing', itemIds: [] },
      done: { id: 'done', title: 'Done', itemIds: [] },
    },
  }
}

export const initialBoardState: BoardState = {
  items: {
    'portal-gun': {
      id: 'portal-gun',
      title: 'Calibrate the portal gun',
      character: {
        id: '1',
        name: 'Rick Sanchez',
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        species: 'Human',
        status: 'Alive',
      },
    },
    'mega-seeds': {
      id: 'mega-seeds',
      title: 'Collect Mega Seeds',
      character: {
        id: '2',
        name: 'Morty Smith',
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        species: 'Human',
        status: 'Alive',
      },
    },
    'garage-security': {
      id: 'garage-security',
      title: 'Upgrade garage security',
      character: {
        id: '3',
        name: 'Summer Smith',
        image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
        species: 'Human',
        status: 'Alive',
      },
    },
    'citadel-report': {
      id: 'citadel-report',
      title: 'File the Citadel incident report',
      character: {
        id: '8',
        name: 'Adjudicator Rick',
        image: 'https://rickandmortyapi.com/api/character/avatar/8.jpeg',
        species: 'Human',
        status: 'Dead',
      },
    },
  },
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      itemIds: ['portal-gun', 'mega-seeds'],
    },
    doing: {
      id: 'doing',
      title: 'Doing',
      itemIds: ['garage-security'],
    },
    done: {
      id: 'done',
      title: 'Done',
      itemIds: ['citadel-report'],
    },
  },
}
