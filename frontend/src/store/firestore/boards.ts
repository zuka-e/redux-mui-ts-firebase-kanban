import firebase from '../../config/firebase';
import { db } from '../../config/firebase';
import { AppThunk } from '../store';
import { currentUser, isSignedIn, isOwnedBy } from '../../models/Auth';
import { Notification, setNotification } from '../appSlice';
import {
  accessStart,
  accessFailure,
  addBoardSuccess,
  removeBoardSuccess,
  editBoardSuccess,
} from '../tasksSlice';

export const addBoard = (props: { title: string }): AppThunk => async (
  dispatch
) => {
  const { title } = props;

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  try {
    dispatch(accessStart());
    const docId = await db
      .collection('boards')
      .add({
        userId: currentUser?.uid,
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
  const { taskBoardId } = props;
  const board = getState().tasks.boards[taskBoardId];
  const docRef = db.collection('boards').doc(taskBoardId);
  const listsRef = docRef.collection('lists');
  const cardsRef = docRef.collection('cards');
  const { lists, cards } = getState().tasks;

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
    await docRef.delete();
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
    dispatch(setNotification(Notification.SuccessfullyDeleted));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};

export const editBoard = (props: {
  taskBoardId: string;
  title: string;
}): AppThunk => async (dispatch, getState) => {
  const { taskBoardId, title } = props;
  const board = getState().tasks.boards[taskBoardId];
  const docRef = db.collection('boards').doc(taskBoardId);

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
    await docRef.update({
      title: title,
      updatedAt: firebase.firestore.Timestamp.now(),
    });
    dispatch(editBoardSuccess({ taskBoardId: taskBoardId, title: title }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};
