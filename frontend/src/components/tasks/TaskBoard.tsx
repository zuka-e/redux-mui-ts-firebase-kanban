import React, { useState, useContext } from 'react';

import { useSelector } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';
import { useParams, Redirect } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  Typography,
  Button,
  Hidden,
  Tooltip,
  Fab,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import { TaskBoards, TaskListsArray } from '../../models/Task';
import { isSignedIn, isOwnedBy } from '../../models/Auth';
import { RootState } from '../../store/rootReducer';
import { DragContext } from '../../context/DragContext';
import { useAppDispatch } from '../../store/store';
import { sortCard } from '../../store/firestore/cards';
import CustomDragLayer from './CustomDragLayer';
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
    boardHeader: {
      flex: 'auto',
      padding: theme.spacing(1),
    },
    title: {
      width: 'fit-content',
      fontSize: '2.125rem',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
      borderRadius: theme.spacing(1),
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,0.05)',
      },
    },
    fab: {
      position: 'fixed',
      bottom: '15px',
      right: '15px',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    taskList: {
      minWidth: '375px',
    },
    scrollbar: {
      overflowX: 'hidden',
      overflowY: 'hidden',
      '&:hover': {
        overflowX: 'auto',
        overflowY: 'auto',
      },
      '&::-webkit-scrollbar': {
        width: '5px',
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
  const { state, dragDispatch } = useContext(DragContext);
  const dispatch = useAppDispatch();
  const { boardId } = useParams<{ boardId: string }>(); // URLパラメータ取得
  const boards = useSelector(
    (state: RootState) => state.firestore.data.boards as TaskBoards
  );
  const initialListsArray = useSelector(
    (state: RootState) => state.firestore.ordered.lists as TaskListsArray
  );

  const sortedListsArray = state.listsArray.filter(
    (list) => list.taskBoardId === boardId
  );

  const handleSortStart = () => {
    dragDispatch({ type: 'DRAG_START' });
  };

  const handleSortDone = () => {
    dispatch(
      sortCard({
        taskBoardId: boardId as string,
        taskListArray: sortedListsArray,
      })
    );
    dragDispatch({ type: 'DRAG_END' });
  };

  const handleSortCancel = () => {
    dragDispatch({ type: 'DRAG_CANCEL', payload: { initialListsArray } });
  };

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

  if (isEmpty(boards) || isEmpty(boards[boardId])) {
    return <Redirect to='/' />;
  }
  return (
    <Grid container>
      <Grid container justify='space-between' wrap='nowrap'>
        <Grid item className={`${classes.scrollbar} ${classes.boardHeader}`}>
          {isEditingTitle && isOwnedBy(boards[boardId].userId) ? (
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
          ) : (
            <Typography
              className={classes.title}
              component='h1'
              color='textSecondary'
              onClick={toggleTitleForm}
            >
              {boards[boardId].title}
            </Typography>
          )}
        </Grid>
        {isOwnedBy(boards[boardId].userId) && (
          <Grid item>
            <PopoverContent trigger={<ResponsiveMenuButton />}>
              <BoardMenu boardId={boardId} />
            </PopoverContent>
          </Grid>
        )}
      </Grid>
      <Grid container wrap='nowrap' className={classes.scrollbar}>
        <CustomDragLayer />
        {sortedListsArray.map((list, i) => (
          <Grid item key={list.id} className={classes.taskList}>
            <Card
              className={classes.paper}
              elevation={7}
              onDragStart={handleSortStart}
            >
              <TaskList list={list} listIndex={i} />
            </Card>
          </Grid>
        ))}
        {isSignedIn() && (
          <Grid item className={classes.taskList}>
            <AddTaskButton list id={boardId} />
          </Grid>
        )}
        {state.isSorting && isOwnedBy(boards[boardId].userId) && (
          <div className={classes.fab}>
            <Tooltip title='Done the sort' placement='top'>
              <Fab color='primary' aria-label='done' onClick={handleSortDone}>
                <DoneIcon />
              </Fab>
            </Tooltip>
            <Tooltip title='Cancel' placement='top'>
              <Fab aria-label='Cancel' onClick={handleSortCancel}>
                <CancelIcon />
              </Fab>
            </Tooltip>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default TaskBoard;
