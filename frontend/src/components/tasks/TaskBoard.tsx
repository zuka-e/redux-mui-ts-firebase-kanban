import React from 'react';

import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Card, LinearProgress } from '@material-ui/core';

import TaskList from './TaskList';
import { AddTaskButton } from './AddTaskButton';
import { RootState } from '../../store/rootReducer';
import { ITaskList } from '../Types';

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
  const { boardId } = useParams(); // URLパラメータ取得
  const lists = useSelector(
    (state: RootState) => state.firestore.ordered.lists as ITaskList['id'][]
  );

  if (!isLoaded(lists)) {
    return <LinearProgress variant='query' color='secondary' />;
  }
  return (
    <Grid container>
      {lists.map(
        (list) =>
          list.taskBoardId === boardId && (
            <Grid item lg={2} md={3} sm={4} xs={6} key={list.id}>
              <Card className={classes.root} elevation={7}>
                <TaskList list={list} />
              </Card>
            </Grid>
          )
      )}
      <Grid item lg={2} md={3} sm={4} xs={6}>
        <AddTaskButton list id={boardId} />
      </Grid>
    </Grid>
  );
};

export default TaskBoard;
