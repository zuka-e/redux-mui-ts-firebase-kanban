import React, { useEffect } from 'react';

import { Switch, Route } from 'react-router-dom';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import Home from '../components/tasks/Home';
import TaskBoard from '../components/tasks/TaskBoard';
import { useAppDispatch } from '../store/store';
import { fetchData } from '../store/tasksSlice';
import NotFound404 from '../components/pages/NotFound404';
import Login from '../components/pages/Login';
import { LinearProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { ITaskBoard, ITaskList, ITaskCard } from '../models/Task';
import { RootState } from '../store/rootReducer';

const Routes: React.FC = () => {
  const dispatch = useAppDispatch();
  const boards = useSelector(
    (state: RootState) => state.firestore.ordered.boards as ITaskBoard['id'][]
  );
  const lists = useSelector(
    (state: RootState) => state.firestore.ordered.lists as ITaskList['id'][]
  );
  const cards = useSelector(
    (state: RootState) => state.firestore.ordered.cards as ITaskCard['id'][]
  );

  // 初回アクセス時、データ取得
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Firestoreとリアルタイム同期
  useFirestoreConnect([
    {
      collection: 'boards',
      orderBy: ['createdAt', 'asc'],
      storeAs: 'boards', // stateアクセス時の名前
    },
    {
      // 上位のコレクション指定せずアクセス可能
      // コレクショングループ用のセキュリティルールも必要
      collectionGroup: 'lists',
      orderBy: ['createdAt', 'asc'],
      storeAs: 'lists',
    },
    {
      collectionGroup: 'cards',
      orderBy: ['createdAt', 'desc'],
      storeAs: 'cards',
    },
  ]);

  if (!isLoaded(cards) || !isLoaded(lists) || !isLoaded(boards)) {
    return <LinearProgress variant='query' color='secondary' />;
  }

  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/boards/:boardId'>
        <TaskBoard />
      </Route>
      <Route exact path='/login'>
        <Login />
      </Route>
      <Route path='/'>
        <NotFound404 />
      </Route>
    </Switch>
  );
};

export default Routes;
