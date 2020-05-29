import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITaskCard, ITaskList, ITaskBoard } from '../components/Types';
import firebase from '../config/firebase';
import { db } from '../config/firebase';
import { AppThunk } from './store';

interface State {
  cards: ITaskCard;
  lists: ITaskList;
  boards: ITaskBoard;
  loading: boolean;
  error: any;
}
const initialState: State = {
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
    accessFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // awaitに続くコードが成功(Success)時に行う処理
    getDataSuccess(
      state,
      action: PayloadAction<{
        cards: ITaskCard;
        lists: ITaskList;
        boards: ITaskBoard;
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
      const { taskListId, id, title } = action.payload;
      const newCard = {
        taskListId: taskListId,
        id: id,
        title: title,
        done: false,
        body: '',
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      };
      state.cards = { ...state.cards, [id]: newCard };
      state.loading = false;
      state.error = null;
    },

    removeCardSuccess(state, action: PayloadAction<{ taskCardId: string }>) {
      const cardId = action.payload.taskCardId;
      delete state.cards[cardId];
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
      if (title) card.title = title;
      if (body) card.body = body;
      card.updatedAt = firebase.firestore.Timestamp.now();
      state.loading = false;
      state.error = null;
    },

    toggleCardSuccess(state, action: PayloadAction<{ taskCardId: string }>) {
      const { taskCardId } = action.payload;
      const card = state.cards[taskCardId];
      card.done = !card.done;
      state.loading = false;
      state.error = null;
    },

    addListSuccess: (
      state,
      action: PayloadAction<{ taskBoardId: string; id: string; title: string }>
    ) => {
      const { taskBoardId, id, title } = action.payload;
      const newList = {
        taskBoardId: taskBoardId,
        id: id,
        title: title,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
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
      const cards = state.cards;
      // オブジェクト型での条件付き処理
      Object.values(cards).forEach(
        (card) => card.taskListId === taskListId && delete state.cards[card.id]
      );
      state.loading = false;
      state.error = null;
    },

    addBoardSuccess: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const { id, title } = action.payload;
      const newBoard = {
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
      const { lists, cards } = state;
      // オブジェクト型での条件付き処理
      Object.values(lists).forEach((list) => {
        if (list.taskBoardId === taskBoardId) {
          Object.values(cards).forEach(
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

const cardsArray: ITaskCard['id'][] = []; // 取得データの配列
const listsArray: ITaskList['id'][] = [];
const boardsArray: ITaskBoard['id'][] = [];

// 初回データの取得
export const fetchData = (): AppThunk => async (dispatch) => {
  try {
    dispatch(accessStart());
    await db
      .collectionGroup('cards')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // idを加えて配列に追加、型アサーションを付与
          cardsArray.push({ id: doc.id, ...doc.data() } as ITaskCard['id']);
        });
      });
    // ITaskCard['id'][] (配列) から ITaskCard (オブジェクト) への変換
    // 例) [{id: '1', title: 'a'}, {...}] -> {'1': {id: '1', title: 'a'}, '2': {...}}
    // reduce(): 反復処理でaccumulator(acc)に結果を蓄積し最終結果を返す、初期値={}
    const cards = cardsArray.reduce((acc, card) => {
      acc[card.id] = card;
      return acc;
    }, {} as ITaskCard);

    await db
      .collectionGroup('lists')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          listsArray.push({ id: doc.id, ...doc.data() } as ITaskList['id']);
        });
      });
    const lists = listsArray.reduce((acc, list) => {
      acc[list.id] = list;
      return acc;
    }, {} as ITaskList);

    await db
      .collection('boards')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          boardsArray.push({ id: doc.id, ...doc.data() } as ITaskBoard['id']);
        });
      });
    const boards = boardsArray.reduce((acc, board) => {
      acc[board.id] = board;
      return acc;
    }, {} as ITaskBoard);
    dispatch(getDataSuccess({ cards, lists, boards }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const addCard = (props: {
  // キーワード引数のように振る舞う
  taskListId: string;
  title: string;
}): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(accessStart());
    const { taskListId, title } = props;
    // storeからデータ取得
    const boardId = getState().tasks.lists[taskListId].taskBoardId;
    const cardsRef = db.collection('boards').doc(boardId).collection('cards');
    const docId = await cardsRef
      .add({
        taskListId: taskListId,
        title: title,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      })
      .then((docRef) => docRef.id);
    dispatch(
      addCardSuccess({ taskListId: taskListId, id: docId, title: title })
    );
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const removeCard = (props: { taskCardId: string }): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const { taskCardId } = props;
    dispatch(accessStart());
    const listId = getState().tasks.cards[taskCardId].taskListId;
    const boardId = getState().tasks.lists[listId].taskBoardId;
    const docRef = db
      .collection('boards')
      .doc(boardId)
      .collection('cards')
      .doc(taskCardId);
    await docRef.delete();
    dispatch(removeCardSuccess({ taskCardId: taskCardId }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

interface editCardProps {
  taskCardId: string;
  title?: string;
  body?: string;
}
export const editCard = (props: editCardProps): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(accessStart());
    const { taskCardId, title, body } = props;
    const listId = getState().tasks.cards[taskCardId].taskListId;
    const boardId = getState().tasks.lists[listId].taskBoardId;
    const docRef = db
      .collection('boards')
      .doc(boardId)
      .collection('cards')
      .doc(taskCardId);
    title &&
      (await docRef.update({
        title: title,
        updatedAt: firebase.firestore.Timestamp.now(),
      }));
    body &&
      (await docRef.update({
        body: body,
        updatedAt: firebase.firestore.Timestamp.now(),
      }));
    dispatch(
      editCardSuccess({ taskCardId: taskCardId, title: title, body: body })
    );
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const toggleCard = (props: { taskCardId: string }): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(accessStart());
    const { taskCardId } = props;
    const card = getState().tasks.cards[taskCardId];
    const listId = card.taskListId;
    const boardId = getState().tasks.lists[listId].taskBoardId;
    const docRef = db
      .collection('boards')
      .doc(boardId)
      .collection('cards')
      .doc(taskCardId);
    await docRef.update({
      done: !card.done,
    });
    dispatch(toggleCardSuccess({ taskCardId: taskCardId }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const addList = (props: {
  taskBoardId: string;
  title: string;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(accessStart());
    const { taskBoardId, title } = props;
    const listsRef = db
      .collection('boards')
      .doc(taskBoardId)
      .collection('lists');
    const docId = await listsRef
      .add({
        taskBoardId: taskBoardId,
        title: title,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      })
      .then((docRef) => docRef.id);
    dispatch(
      addListSuccess({ taskBoardId: taskBoardId, id: docId, title: title })
    );
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const editList = (props: {
  taskListId: string;
  title: string;
}): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(accessStart());
    const { taskListId, title } = props;
    const boardId = getState().tasks.lists[taskListId].taskBoardId;
    const docRef = db
      .collection('boards')
      .doc(boardId)
      .collection('lists')
      .doc(taskListId);
    await docRef.update({
      title: title,
      updatedAt: firebase.firestore.Timestamp.now(),
    });
    dispatch(editListSuccess({ taskListId: taskListId, title: title }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const removeList = (props: { taskListId: string }): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const { taskListId } = props;
    dispatch(accessStart());
    const boardId = getState().tasks.lists[taskListId].taskBoardId;
    const listsRef = db.collection('boards').doc(boardId).collection('lists');
    await listsRef.doc(taskListId).delete();
    const cards = getState().tasks.cards;
    const cardsRef = db.collection('boards').doc(boardId).collection('cards');
    Object.values(cards).forEach(
      (card) => card.taskListId === taskListId && cardsRef.doc(card.id).delete()
    );
    dispatch(removeListSuccess({ taskListId: taskListId }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const addBoard = (props: { title: string }): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(accessStart());
    const { title } = props;
    const docId = await db
      .collection('boards')
      .add({
        title: title,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
      })
      .then((docRef) => docRef.id);
    dispatch(addBoardSuccess({ id: docId, title: title }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const removeBoard = (props: { taskBoardId: string }): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const { taskBoardId } = props;
    dispatch(accessStart());
    const docRef = db.collection('boards').doc(taskBoardId);
    await docRef.delete();
    const listsRef = docRef.collection('lists');
    const cardsRef = docRef.collection('cards');
    const { lists, cards } = getState().tasks;
    Object.values(lists).forEach((list) => {
      if (list.taskBoardId === taskBoardId) {
        Object.values(cards).forEach(
          (card) =>
            card.taskListId === list.id && cardsRef.doc(card.id).delete()
        );
        listsRef.doc(list.id).delete();
      }
    });
    dispatch(removeBoardSuccess({ taskBoardId: taskBoardId }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const editBoard = (props: {
  taskBoardId: string;
  title: string;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(accessStart());
    const { taskBoardId, title } = props;
    const docRef = db.collection('boards').doc(taskBoardId);
    await docRef.update({
      title: title,
      updatedAt: firebase.firestore.Timestamp.now(),
    });
    dispatch(editBoardSuccess({ taskBoardId: taskBoardId, title: title }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};
