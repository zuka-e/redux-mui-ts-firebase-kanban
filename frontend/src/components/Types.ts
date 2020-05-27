export interface ITaskBoard {
  [taskBoardId: string]: {
    id: string;
    title: string;
  };
}
export interface ITaskList {
  [taskListId: string]: {
    taskBoardId: string;
    id: string;
    title: string;
  };
}
export interface ITaskCard {
  [taskCardId: string]: {
    taskListId: string;
    id: string;
    title: string;
    body: string;
    done: boolean;
  };
}
