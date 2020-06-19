import firebase from '../../config/firebase';
import { db } from '../../config/firebase';
import { AppThunk } from '../store';
import { currentUser, isSignedIn, isOwnedBy } from '../../models/Auth';
import { TaskListsArray } from '../../models/Task';
import { Notification, setNotification } from '../appSlice';
import {
  accessStart,
  accessFailure,
  addCardSuccess,
  removeCardSuccess,
  editCardSuccess,
  toggleCardSuccess,
} from '../tasksSlice';

export const addCard = (props: {
  // キーワード引数のように振る舞う
  taskListId: string;
  title: string;
}): AppThunk => async (dispatch, getState) => {
  const { taskListId, title } = props;
  // storeからデータ取得
  const list = getState().tasks.lists[taskListId];
  // ログインしていなければ処理を中断
  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  // listの変更を伴うため所有が必要
  if (!isOwnedBy(list.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
    const boardId = list.taskBoardId;
    const cardsRef = db.collection('boards').doc(boardId).collection('cards');
    const listsRef = db.collection('boards').doc(boardId).collection('lists');
    const docRef = await cardsRef.add({
      userId: currentUser?.uid,
      taskListId: taskListId,
      title: title,
      body: '',
      done: false,
      createdAt: firebase.firestore.Timestamp.now(),
      updatedAt: firebase.firestore.Timestamp.now(),
    });
    const doc = await docRef.get();
    await listsRef.doc(taskListId).update({
      cards: firebase.firestore.FieldValue.arrayUnion({
        id: doc.id,
        ...doc.data(),
      }),
    });
    dispatch(
      addCardSuccess({ taskListId: taskListId, id: doc.id, title: title })
    );
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const removeCard = (props: { taskCardId: string }): AppThunk => async (
  dispatch,
  getState
) => {
  const { taskCardId } = props;
  const card = getState().tasks.cards[taskCardId];
  const listId = card.taskListId;
  const list = getState().tasks.lists[listId];

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  // 所有者(データの'userId'が'currentUser'の'uid'と一致)でなければ処理を中断
  if (!isOwnedBy(card.userId) || !isOwnedBy(list.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
    const boardId = list.taskBoardId;
    const listsRef = db.collection('boards').doc(boardId).collection('lists');
    const docRef = db
      .collection('boards')
      .doc(boardId)
      .collection('cards')
      .doc(taskCardId);
    await docRef.delete();
    const newCards = getState().tasks.lists[listId].cards.filter(
      (card) => card.id !== taskCardId
    );
    await listsRef.doc(listId).update({
      cards: newCards,
      updatedAt: firebase.firestore.Timestamp.now(),
    });
    dispatch(removeCardSuccess({ taskCardId: taskCardId }));
    dispatch(setNotification(Notification.SuccessfullyDeleted));
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
  const { taskCardId, title, body } = props;
  const card = getState().tasks.cards[taskCardId];
  const listId = card.taskListId;
  const list = getState().tasks.lists[listId];

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  if (!isOwnedBy(card.userId) || !isOwnedBy(list.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
    const boardId = list.taskBoardId;
    const docRef = db
      .collection('boards')
      .doc(boardId)
      .collection('cards')
      .doc(taskCardId);
    const listsRef = db.collection('boards').doc(boardId).collection('lists');
    if (title) {
      await docRef.update({
        title: title,
        updatedAt: firebase.firestore.Timestamp.now(),
      });
      const newCardsOfList = list.cards.map((card) =>
        card.id === taskCardId
          ? {
              ...card,
              title: title,
              updatedAt: firebase.firestore.Timestamp.now(),
            }
          : card
      );
      await listsRef.doc(listId).update({
        cards: newCardsOfList,
      });
    }
    if (body) {
      await docRef.update({
        body: body,
        updatedAt: firebase.firestore.Timestamp.now(),
      });
      const newCardsOfList = list.cards.map((card) =>
        card.id === taskCardId
          ? {
              ...card,
              body: body,
              updatedAt: firebase.firestore.Timestamp.now(),
            }
          : card
      );
      await listsRef.doc(listId).update({
        cards: newCardsOfList,
      });
    }
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
  const { taskCardId } = props;
  const card = getState().tasks.cards[taskCardId];
  const listId = card.taskListId;
  const list = getState().tasks.lists[listId];

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  if (!isOwnedBy(card.userId) || !isOwnedBy(list.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
    const boardId = list.taskBoardId;
    const docRef = db
      .collection('boards')
      .doc(boardId)
      .collection('cards')
      .doc(taskCardId);
    const listsRef = db.collection('boards').doc(boardId).collection('lists');
    await docRef.update({
      done: !card.done,
    });
    const newCardsOfList = list.cards.map((card) =>
      card.id === taskCardId
        ? {
            ...card,
            done: !card.done,
            updatedAt: firebase.firestore.Timestamp.now(),
          }
        : card
    );
    await listsRef.doc(listId).update({
      cards: newCardsOfList,
    });
    dispatch(toggleCardSuccess({ taskCardId: taskCardId }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const sortCard = (props: {
  taskBoardId: string;
  taskListArray: TaskListsArray;
}): AppThunk => async (dispatch, getState) => {
  const { taskBoardId, taskListArray } = props;
  const board = getState().tasks.boards[taskBoardId];

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  if (!isOwnedBy(board.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
    taskListArray.map(async (list) => {
      const docRef = db
        .collection('boards')
        .doc(taskBoardId)
        .collection('lists')
        .doc(list.id);
      await docRef.update({
        cards: list.cards,
      });
      dispatch(setNotification(Notification.SuccessfullyUpdated));
    });
  } catch (error) {
    dispatch(accessFailure(error));
  }
};
