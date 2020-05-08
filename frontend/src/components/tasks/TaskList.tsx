import React from 'react';

import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

import { ITaskList } from '../Types';
import TaskCard from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import { RootState } from '../../rootReducer';

const TaskList: React.FC<ITaskList> = ({ list }: ITaskList) => {
  const { cards } = useSelector((state: RootState) => state.task);
  return (
    <React.Fragment>
      <Typography color='textPrimary' gutterBottom>
        {list.title}
      </Typography>
      {list.taskCardIds.map((cardId) => (
        <Box my={1} key={cardId}>
          <TaskCard card={cards[cardId]} />
        </Box>
      ))}
      <AddTaskButton list={list} />
    </React.Fragment>
  );
};
export default TaskList;
