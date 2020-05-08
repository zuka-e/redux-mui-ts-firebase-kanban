import { ITaskBoard, ITaskList, ITaskCard } from '../Types';

// 表示確認用データ
export const taskBoards: ITaskBoard = {
  'board-1': {
    id: 'board-1',
    title: 'b',
    taskListIds: ['list-1', 'list-3', 'list-4'],
  },
};

export const taskLists: ITaskList = {
  'list-1': {
    taskBoardId: 'board-1',
    id: 'list-1',
    title: 'list-title1',
    taskCardIds: ['card-1', 'card-2', 'card-4'],
  },
  'list-3': {
    taskBoardId: 'board-1',
    id: 'list-3',
    title: 'list-title3',
    taskCardIds: [],
  },
  'list-4': {
    taskBoardId: 'board-1',
    id: 'list-4',
    title: 'list-title4',
    taskCardIds: ['card-3'],
  },
};

export const taskCards: ITaskCard = {
  'card-1': {
    taskListId: 'list-1',
    id: 'card-1',
    title: 'Card-title-1',
    done: false,
    body: 'Card-body-1',
  },
  'card-2': {
    taskListId: 'list-1',
    id: 'card-2',
    title: 'Card-title-2',
    done: true,
    body: 'Card-body-2',
  },
  'card-3': {
    taskListId: 'list-4',
    id: 'card-3',
    title: 'Card-title-3',
    done: false,
    body: 'Card-body-3',
  },
  'card-4': {
    taskListId: 'list-1',
    id: 'card-4',
    title: 'Card-title-4',
    done: true,
    body: 'Card-body-4',
  },
};
