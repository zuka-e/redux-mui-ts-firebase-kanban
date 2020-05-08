import React from 'react';

import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Grid, Box } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import TaskList from './TaskList';
import { AddTaskButton } from './AddTaskButton';
import { RootState } from '../../store/rootReducer';

const TaskBoard: React.FC = () => {
  const { lists, boards } = useSelector((state: RootState) => state.task);
  const { boardId } = useParams(); // URLパラメータ取得
  const board = boards[boardId];
  if (!board) {
    // 存在しない boardId パラメータを受け取った場合
    return (
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        Board not fonud.&nbsp;
        <Link to='/'>HOME</Link>
      </Alert>
    );
  }
  return (
    <Grid container>
      {board.taskListIds.map((listId) => {
        const list = lists[listId];
        return (
          <Grid item lg={2} md={3} sm={4} xs={6} key={list.id}>
            <Box m={1} p={1} borderRadius={5} bgcolor='secondary.main'>
              <TaskList list={list} />
            </Box>
          </Grid>
        );
      })}
      <Grid item lg={2} md={3} sm={4} xs={6}>
        <AddTaskButton />
      </Grid>
    </Grid>
  );
};

export default TaskBoard;
