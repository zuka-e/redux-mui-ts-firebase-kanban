import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { useParams, Link, Redirect } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  LinearProgress,
  Typography,
  Box,
  Button,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { ITaskBoard, ITaskList } from '../../models/Task';
import { isSignedIn, isOwnedBy } from '../../models/Auth';
import { RootState } from '../../store/rootReducer';
import TaskList from './TaskList';
import TitleForm from './TitleForm';
import AddTaskButton from './AddTaskButton';
import PopoverContent from '../templates/PopoverContent';
import BoardMenu from './BoardMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
    },
    title: {
      width: 'fit-content',
      padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
      margin: `0 ${theme.spacing(1)}px`,
      borderRadius: theme.spacing(1),
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,0.05)',
      },
    },
    flexEnd: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: `auto ${theme.spacing(1)}px`,
    },
  })
);

const TaskBoard: React.FC = () => {
  const classes = useStyles();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const { boardId } = useParams(); // URLパラメータ取得
  const boards = useSelector(
    (state: RootState) => state.firestore.data.boards as ITaskBoard
  );
  const lists = useSelector(
    (state: RootState) => state.firestore.ordered.lists as ITaskList['id'][]
  );

  const toggleTitleForm = () => {
    setIsEditingTitle(!isEditingTitle);
    setEditingTitle(editingTitle || boards[boardId].title);
  };

  const handleClickAway = () => {
    setIsEditingTitle(false);
  };

  if (!isLoaded(lists) || !isLoaded(boards)) {
    return <LinearProgress variant='query' color='secondary' />;
  }

  if (isEmpty(boards) || isEmpty(boards[boardId])) {
    return (
      <Alert severity='error'>
        <Redirect to='/' />
        <AlertTitle>Error</AlertTitle>
        Board not fonud.&nbsp;
        <Link to='/'>HOME</Link>
      </Alert>
    );
  }
  return (
    <Grid container>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item sm={5} xs={9}>
          {isEditingTitle && isOwnedBy(boards[boardId].userId) ? (
            <Box mx={1}>
              <TitleForm
                method={'PATCH'}
                board
                id={boardId}
                currentValue={boards[boardId].title}
                toggleForm={toggleTitleForm}
                handleClickAway={handleClickAway}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
              />
            </Box>
          ) : (
            <Typography
              className={classes.title}
              component='h1'
              variant='h4'
              color='textSecondary'
              onClick={toggleTitleForm}
            >
              {boards[boardId].title}
            </Typography>
          )}
        </Grid>
        {isOwnedBy(boards[boardId].userId) && (
          <Grid className={classes.flexEnd} item xs={2}>
            <PopoverContent trigger={<Button variant='outlined'>menu</Button>}>
              <BoardMenu boardId={boardId} />
            </PopoverContent>
          </Grid>
        )}
      </Grid>
      {lists.map(
        (list) =>
          list.taskBoardId === boardId && (
            <Grid item lg={2} md={3} sm={4} xs={6} key={list.id}>
              <Card className={classes.paper} elevation={7}>
                <TaskList list={list} />
              </Card>
            </Grid>
          )
      )}
      {isSignedIn() && (
        <Grid item lg={2} md={3} sm={4} xs={6}>
          <AddTaskButton list id={boardId} />
        </Grid>
      )}
    </Grid>
  );
};

export default TaskBoard;
