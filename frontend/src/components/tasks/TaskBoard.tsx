import React from 'react';

import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Card } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import TaskList from './TaskList';
import { AddTaskButton } from './AddTaskButton';
import { RootState } from '../../store/rootReducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
    },
  })
);

const TaskBoard: React.FC = () => {
  const classes = useStyles();
  const { lists, boards } = useSelector((state: RootState) => state.tasks);
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
            <Card className={classes.root} elevation={7}>
              <TaskList list={list} />
            </Card>
          </Grid>
        );
      })}
      <Grid item lg={2} md={3} sm={4} xs={6}>
        <AddTaskButton board={board} />
      </Grid>
    </Grid>
  );
};

export default TaskBoard;
