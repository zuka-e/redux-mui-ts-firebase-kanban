import React from 'react';

import { Switch, Route } from 'react-router-dom';

import Home from '../components/Home';
import TaskBoard from '../components/tasks/TaskBoard';

const Content: React.FC = () => {
  return (
    <Switch>
      <Route path='/boards/:boardId'>
        <TaskBoard />
      </Route>
    </Switch>
  );
};

export default Content;
