export interface TaskBoards {
  [taskBoardId: string]: {
    userId: string;
    id: string;
    title: string;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
}
export interface TaskLists {
  [taskListId: string]: {
    userId: string;
    taskBoardId: string;
    id: string;
    title: string;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
    cards: TaskCards['id'][];
  };
}
export interface TaskCards {
  [taskCardId: string]: {
    userId: string;
    taskListId: string;
    id: string;
    title: string;
    body: string;
    done: boolean;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
}

export type TaskBoardsArray = TaskBoards['id'][];
export type TaskListsArray = TaskLists['id'][];
export type TaskCardsArray = TaskCards['id'][];
