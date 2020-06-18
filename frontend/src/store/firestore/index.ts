import {
  TaskCards,
  TaskLists,
  TaskBoards,
  TaskCardsArray,
  TaskListsArray,
  TaskBoardsArray,
} from '../../models/Task';
import { db } from '../../config/firebase';
import { AppThunk } from '../store';
import { accessStart, getDataSuccess, accessFailure } from '../tasksSlice';

// 初回データの取得
export const fetchData = (): AppThunk => async (dispatch) => {
  try {
    const cardsArray: TaskCardsArray = []; // DBから取得するデータの配列
    const listsArray: TaskListsArray = [];
    const boardsArray: TaskBoardsArray = [];
    dispatch(accessStart());
    await db
      .collectionGroup('cards')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // idを加えて配列に追加、型アサーションを付与
          cardsArray.push({ id: doc.id, ...doc.data() } as TaskCards['id']);
        });
      });
    // TaskCardsArray (配列) から TaskCards (オブジェクト) への変換
    // 例) [{id: '1', title: 'a'}, {...}] -> {'1': {id: '1', title: 'a'}, '2': {...}}
    // reduce(): 反復処理でaccumulator(acc)に結果を蓄積し最終結果を返す、初期値={}
    const cards = cardsArray.reduce((acc, card) => {
      acc[card.id] = card;
      return acc;
    }, {} as TaskCards);

    await db
      .collectionGroup('lists')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          listsArray.push({ id: doc.id, ...doc.data() } as TaskLists['id']);
        });
      });
    const lists = listsArray.reduce((acc, list) => {
      acc[list.id] = list;
      return acc;
    }, {} as TaskLists);

    await db
      .collection('boards')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          boardsArray.push({ id: doc.id, ...doc.data() } as TaskBoards['id']);
        });
      });
    const boards = boardsArray.reduce((acc, board) => {
      acc[board.id] = board;
      return acc;
    }, {} as TaskBoards);
    dispatch(getDataSuccess({ cards, lists, boards }));
  } catch (error) {
    dispatch(accessFailure(error));
  }
};
