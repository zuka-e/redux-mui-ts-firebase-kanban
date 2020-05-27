export interface ITaskBoard {
  [taskBoardId: string]: {
    id: string;
    title: string;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
}
export interface ITaskList {
  [taskListId: string]: {
    taskBoardId: string;
    id: string;
    title: string;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
}
export interface ITaskCard {
  [taskCardId: string]: {
    taskListId: string;
    id: string;
    title: string;
    body: string;
    done: boolean;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
}
