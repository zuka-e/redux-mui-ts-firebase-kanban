import firebase from '../../config/firebase';
import { db } from '../../config/firebase';
import { AppThunk } from '../store';
import { currentUser, isSignedIn, isOwnedBy } from '../../models/Auth';
import { Notification, setNotification } from '../appSlice';
import {
  accessStart,
  accessFailure,
  addListSuccess,
  editListSuccess,
  removeListSuccess,
} from '../tasksSlice';

export const addList = (props: {
  taskBoardId: string;
  title: string;
}): AppThunk => async (dispatch) => {
  const { taskBoardId, title } = props;

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  try {
    dispatch(accessStart());
    const listsRef = db
      .collection('boards')
      .doc(taskBoardId)
      .collection('lists');
    const docId = await listsRef
      .add({
        userId: currentUser?.uid,
        taskBoardId: taskBoardId,
        title: title,
        cards: [],
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
  const { taskListId, title } = props;
  const list = getState().tasks.lists[taskListId];
  const boardId = list.taskBoardId;

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  if (!isOwnedBy(list.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
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
  const { taskListId } = props;
  const list = getState().tasks.lists[taskListId];
  const boardId = list.taskBoardId;
  const listsRef = db.collection('boards').doc(boardId).collection('lists');
  const cards = getState().tasks.cards;
  const cardsRef = db.collection('boards').doc(boardId).collection('cards');

  if (!isSignedIn()) {
    dispatch(setNotification(Notification.NotSignedInWarning));
    return;
  }
  if (!isOwnedBy(list.userId)) {
    dispatch(setNotification(Notification.PermissionError));
    return;
  }
  try {
    dispatch(accessStart());
    await listsRef.doc(taskListId).delete();
    Object.values(cards).forEach(
      (card) => card.taskListId === taskListId && cardsRef.doc(card.id).delete()
    );
    dispatch(removeListSuccess({ taskListId: taskListId }));
    dispatch(setNotification(Notification.SuccessfullyDeleted));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};
