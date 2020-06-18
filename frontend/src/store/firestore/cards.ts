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
  const boardId = getState().tasks.lists[taskListId].taskBoardId;
  const cardsRef = db.collection('boards').doc(boardId).collection('cards');
  const listsRef = db.collection('boards').doc(boardId).collection('lists');
  // ログインしていなければ処理を中断
  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  try {
    dispatch(accessStart());
    const docRef = await cardsRef.add({
      userId: currentUser?.uid,
      taskListId: taskListId,
      title: title,
      body: '',
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
  const boardId = getState().tasks.lists[listId].taskBoardId;
  const listsRef = db.collection('boards').doc(boardId).collection('lists');

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  // 所有者(データの'userId'が'currentUser'の'uid'と一致)でなければ処理を中断
  if (!isOwnedBy(card.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
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
  const boardId = getState().tasks.lists[listId].taskBoardId;

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  if (!isOwnedBy(card.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
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
  const { taskCardId } = props;
  const card = getState().tasks.cards[taskCardId];
  const listId = card.taskListId;
  const boardId = getState().tasks.lists[listId].taskBoardId;

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  if (!isOwnedBy(card.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
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
  } catch (error) {
    dispatch(accessFailure(error));
  }
  taskListArray.map(async (list) => {
    const docRef = db
      .collection('boards')
      .doc(taskBoardId)
      .collection('lists')
      .doc(list.id);
    await docRef.update({
      cards: list.cards,
    });
  });
  dispatch(setNotification(Notification.SuccessfullyUpdated));
};
