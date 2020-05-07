import React from 'react';

import Typography from '@material-ui/core/Typography';

import { ITaskList } from '../Types';
import TaskCard from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import { taskCards } from './initial-data';

const TaskList: React.FC<ITaskList> = ({ list }: ITaskList) => {
  return (
    <React.Fragment>
      <Typography color='textPrimary' gutterBottom>
        {list.title}
      </Typography>
      {list.taskCards.map((cardId) => (
        <TaskCard card={taskCards[cardId]} />
      ))}
      <AddTaskButton list={list} />
    </React.Fragment>
  );
};
export default TaskList;
