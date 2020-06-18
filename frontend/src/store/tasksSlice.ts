import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import firebase from '../config/firebase';
import { currentUser } from '../models/Auth';
import { TaskCards, TaskLists, TaskBoards } from '../models/Task';

interface TasksState {
  cards: TaskCards;
  lists: TaskLists;
  boards: TaskBoards;
  loading: boolean;
  error: any;
}
const initialState: TasksState = {
  cards: {},
  lists: {},
  boards: {},
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    accessStart(state) {
      state.loading = true;
      state.error = null;
    },
    accessFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    // awaitに続くコードが成功(Success)時に行う処理
    getDataSuccess(
      state,
      action: PayloadAction<{
        cards: TaskCards;
        lists: TaskLists;
        boards: TaskBoards;
      }>
    ) {
      const { cards, lists, boards } = action.payload;
      state.cards = cards;
      state.lists = lists;
      state.boards = boards;
      state.loading = false;
      state.error = null;
    },

    addCardSuccess(
      state,
      action: PayloadAction<{
        taskListId: string;
        id: string;
        title: string;
      }>
    ) {
      if (!!!currentUser) return;
      const { taskListId, id, title } = action.payload;
      const newCard = {
        // 'currentUser'がいない('undefined'になる)場合、'addCard()'側でブロックする
        userId: currentUser.uid,
        taskListId: taskListId,
        id: id,
        title: title,
        done: false,
        body: '',
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      };
      state.cards = { ...state.cards, [id]: newCard };
      state.lists[taskListId].cards.push(newCard);
      state.loading = false;
      state.error = null;
    },

    removeCardSuccess(state, action: PayloadAction<{ taskCardId: string }>) {
      const cardId = action.payload.taskCardId;
      const listId = state.cards[cardId].taskListId;
      delete state.cards[cardId];
      state.lists[listId].cards.filter((card) => card.id !== cardId);
      state.loading = false;
      state.error = null;
    },

    editCardSuccess(
      state,
      action: PayloadAction<{
        taskCardId: string;
        title?: string;
        body?: string;
      }>
    ) {
      const { taskCardId, title, body } = action.payload;
      const card = state.cards[taskCardId];
      const listId = card.taskListId;
      const cardOfList = state.lists[listId].cards.find(
        (card) => card.id === taskCardId
      );
      if (cardOfList) {
        if (title) {
          card.title = title;
          cardOfList.title = title;
        }
        if (body) {
          card.body = body;
          cardOfList.body = body;
        }
        card.updatedAt = firebase.firestore.Timestamp.now();
        cardOfList.updatedAt = card.updatedAt;
      }
      state.loading = false;
      state.error = null;
    },

    toggleCardSuccess(state, action: PayloadAction<{ taskCardId: string }>) {
      const { taskCardId } = action.payload;
      const card = state.cards[taskCardId];
      const listId = card.taskListId;
      const cardOfList = state.lists[listId].cards.find(
        (card) => card.id === taskCardId
      );
      card.done = !card.done;
      if (cardOfList) cardOfList.done = !card.done;
      state.loading = false;
      state.error = null;
    },

    addListSuccess: (
      state,
      action: PayloadAction<{ taskBoardId: string; id: string; title: string }>
    ) => {
      if (!!!currentUser) return;
      const { taskBoardId, id, title } = action.payload;
      const newList = {
        userId: currentUser.uid,
        taskBoardId: taskBoardId,
        id: id,
        title: title,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
        cards: [],
      };
      state.lists = { ...state.lists, [id]: newList };
      state.loading = false;
      state.error = null;
    },

    editListSuccess(
      state,
      action: PayloadAction<{
        taskListId: string;
        title: string;
      }>
    ) {
      const { taskListId, title } = action.payload;
      const list = state.lists[taskListId];
      list.title = title;
      list.updatedAt = firebase.firestore.Timestamp.now();
      state.loading = false;
      state.error = null;
    },

    removeListSuccess(state, action: PayloadAction<{ taskListId: string }>) {
      const { taskListId } = action.payload;
      delete state.lists[taskListId];
      // オブジェクト型での条件付き処理
      Object.values(state.cards).forEach(
        (card) => card.taskListId === taskListId && delete state.cards[card.id]
      );
      state.loading = false;
      state.error = null;
    },

    addBoardSuccess: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      if (!!!currentUser) return;
      const { id, title } = action.payload;
      const newBoard = {
        userId: currentUser.uid,
        id: id,
        title: title,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      };
      state.boards = { ...state.boards, [id]: newBoard };
      state.loading = false;
      state.error = null;
    },

    removeBoardSuccess(state, action: PayloadAction<{ taskBoardId: string }>) {
      const { taskBoardId } = action.payload;
      delete state.lists[taskBoardId];
      // オブジェクト型での条件付き処理
      Object.values(state.lists).forEach((list) => {
        if (list.taskBoardId === taskBoardId) {
          Object.values(state.cards).forEach(
            (card) => card.taskListId === list.id && delete state.cards[card.id]
          );
          list.taskBoardId === taskBoardId && delete state.lists[list.id];
        }
      });
      state.loading = false;
      state.error = null;
    },

    editBoardSuccess(
      state,
      action: PayloadAction<{
        taskBoardId: string;
        title: string;
      }>
    ) {
      const { taskBoardId, title } = action.payload;
      const board = state.boards[taskBoardId];
      board.title = title;
      board.updatedAt = firebase.firestore.Timestamp.now();
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  accessStart,
  accessFailure,
  getDataSuccess,
  addCardSuccess,
  removeCardSuccess,
  editCardSuccess,
  toggleCardSuccess,
  addListSuccess,
  editListSuccess,
  removeListSuccess,
  addBoardSuccess,
  removeBoardSuccess,
  editBoardSuccess,
} = tasksSlice.actions;

export default tasksSlice;
