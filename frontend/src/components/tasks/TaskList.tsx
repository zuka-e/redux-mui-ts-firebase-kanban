import React from 'react';

import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

import { ITaskList } from '../Types';
import TaskCard from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import { RootState } from '../../store/rootReducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer', // マウスポインターを指にする
      '&:hover': {
        borderRadius: '5px',
        border: `1px solid ${theme.palette.info.main}`,
      },
    },
  })
);

const TaskList: React.FC<ITaskList> = ({ list }) => {
  const classes = useStyles();
  const { cards } = useSelector((state: RootState) => state.task);

  return (
    <React.Fragment>
      <Typography color='textPrimary' gutterBottom>
        {list.title}
      </Typography>
      {list.taskCardIds.map((cardId) => (
        <Box className={classes.root} my={1} key={cardId}>
          <TaskCard card={cards[cardId]} />
        </Box>
      ))}
      <AddTaskButton list={list} />
    </React.Fragment>
  );
};
export default TaskList;
