import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITaskCard, ITaskList, ITaskBoard } from '../components/Types';
import {
  taskCards,
  taskLists,
  taskBoards,
} from '../components/tasks/initial-data';

interface State {
  cardNum: number;
  cards: ITaskCard;
  listNum: number;
  lists: ITaskList;
  boardNum: number;
  boards: ITaskBoard;
}

const initialState: State = {
  cardNum: 4,
  cards: taskCards,
  listNum: 5,
  lists: taskLists,
  boardNum: 1,
  boards: taskBoards,
};

const tasksSlice = createSlice({
  name: 'tesks',
  initialState,
  reducers: {
    addCard(
      state: State,
      action: PayloadAction<{ taskListId: string; title: string }>
    ) {
      // 'taskListId'は'map()'以下の'list'から取得, 'title'は入力する
      const { taskListId, title } = action.payload;
      const id = (state.cardNum += 1);
      const taskCardId = `card-${id}`;
      const newCard = {
        taskListId: taskListId,
        id: taskCardId,
        title: title,
        done: false,
        body: '',
      };
      state.cards = { ...state.cards, [taskCardId]: newCard }; // 連想配列(オブジェクト)の追加
      state.lists[taskListId].taskCardIds.push(taskCardId); // 配列(Array<>)の追加
    },

    removeCard(state: State, action: PayloadAction<{ taskCardId: string }>) {
      const cardId = action.payload.taskCardId;
      const listId = state.cards[cardId].taskListId;
      delete state.cards[cardId]; // 'card'自体の削除
      const newCardIds = state.lists[listId].taskCardIds.filter(
        (id) => id !== cardId
      );
      state.lists[listId].taskCardIds = newCardIds; // 'list'からの参照を削除
    },

    editCard(
      state: State,
      action: PayloadAction<{
        taskCardId: string;
        title?: string;
        body?: string;
      }>
    ) {
      const { taskCardId, title, body } = action.payload;
      const card = state.cards[taskCardId];
      if (title) card.title = title;
      if (body) card.body = body;
    },

    toggleCard(state: State, action: PayloadAction<{ taskCardId: string }>) {
      const { taskCardId } = action.payload;
      const card = state.cards[taskCardId];
      card.done = !card.done;
    },

    addList: (
      state: State,
      action: PayloadAction<{ taskBoardId: string; title: string }>
    ) => {
      const { taskBoardId, title } = action.payload;
      const id = (state.listNum += 1);
      const taskListId = `list-${id}`;
      const newList = {
        taskBoardId: taskBoardId,
        id: taskListId,
        title: title,
        taskCardIds: [],
      };
      state.lists = { ...state.lists, [taskListId]: newList };
      state.boards[taskBoardId].taskListIds.push(taskListId);
    },

    editList(
      state: State,
      action: PayloadAction<{
        taskListId: string;
        title: string;
      }>
    ) {
      const { taskListId, title } = action.payload;
      const list = state.lists[taskListId];
      list.title = title;
    },
  },
});

export const {
  addCard,
  removeCard,
  editCard,
  toggleCard,
  addList,
  editList,
} = tasksSlice.actions;

export default tasksSlice;
