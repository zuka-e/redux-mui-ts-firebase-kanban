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
  Hidden,
  Tooltip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
      borderRadius: theme.spacing(1),
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,0.05)',
      },
    },
    flexAuto: {
      display: 'flex',
      flex: 'auto',
      margin: `auto ${theme.spacing(1)}px`,
    },
    flexEnd: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: `auto ${theme.spacing(1)}px`,
    },
    scrollbar: {
      overflowX: 'hidden',
      '&:hover': {
        overflowX: 'auto',
      },
      '&::-webkit-scrollbar': {
        height: '1px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#eee',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#ccc',
      },
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

  const ResponsiveMenuButton = () => (
    // 画面サイズによって何れかを表示する
    <React.Fragment>
      <Hidden smDown>
        <Button variant='outlined'>Menu</Button>
      </Hidden>
      <Hidden mdUp>
        <Tooltip title='Menu' placement='bottom'>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </Hidden>
    </React.Fragment>
  );

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
      <Grid container justify='space-between' wrap='nowrap'>
        <Grid item className={`${classes.flexAuto} ${classes.scrollbar}`}>
          {isEditingTitle && isOwnedBy(boards[boardId].userId) ? (
            <Box mt={1}>
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
          <Grid item className={classes.flexEnd} style={{ marginTop: '4px' }}>
            <PopoverContent trigger={<ResponsiveMenuButton />}>
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
