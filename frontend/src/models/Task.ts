export interface ITaskBoard {
  [taskBoardId: string]: {
    userId: string;
    id: string;
    title: string;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
}
export interface ITaskList {
  [taskListId: string]: {
    userId: string;
    taskBoardId: string;
    id: string;
    title: string;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
}
export interface ITaskCard {
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

export const boardsArray: ITaskBoard['id'][] = []; // DBから取得するデータの配列
export const listsArray: ITaskList['id'][] = [];
export const cardsArray: ITaskCard['id'][] = [];
