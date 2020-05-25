import React from 'react';

import { Switch, Route } from 'react-router-dom';

import Home from '../components/Home';
import TaskBoard from '../components/tasks/TaskBoard';
import { useFirestoreConnect } from 'react-redux-firebase';

const Content: React.FC = () => {
  useFirestoreConnect([
    {
      collection: 'boards',
      storeAs: 'boards',
    },
    {
      collectionGroup: 'lists',
      storeAs: 'lists',
    },
    {
      collectionGroup: 'cards',
      storeAs: 'cards',
    },
  ]);

  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/boards/:boardId'>
        <TaskBoard />
      </Route>
    </Switch>
  );
};

export default Content;
