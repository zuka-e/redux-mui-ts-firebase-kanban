import React, { useState, useEffect } from 'react';

import produce from 'immer';
import { useSelector } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';
import { useParams, Redirect } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  Typography,
  Box,
  Button,
  Hidden,
  Tooltip,
  Fab,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import { ITaskBoard, ITaskList } from '../../models/Task';
import { isSignedIn, isOwnedBy } from '../../models/Auth';
import { RootState } from '../../store/rootReducer';
import { useAppDispatch } from '../../store/store';
import { sortCard } from '../../store/tasksSlice';
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
    title: {
      width: 'fit-content',
      padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
      borderRadius: theme.spacing(1),
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,0.05)',
      },
    },
    fab: {
      position: 'absolute',
      bottom: '15px',
      right: '15px',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    flexAuto: {
      display: 'flex',
      flex: 'auto',
      margin: `auto ${theme.spacing(1)}px`,
      overflow: 'overlay',
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
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useAppDispatch();
  const { boardId } = useParams(); // URLパラメータ取得
  const boards = useSelector(
    (state: RootState) => state.firestore.data.boards as ITaskBoard
  );
  const lists = useSelector(
    (state: RootState) => state.firestore.ordered.lists as ITaskList['id'][]
  );
  const [sortedLists, setSortedLists] = useState<ITaskList['id'][]>(lists);

  useEffect(() => {
    setSortedLists(lists.filter((list) => list.taskBoardId === boardId));
  }, [boardId, lists]);

  const moveCard = (
    dragListIndex: number,
    hoverListIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => {
    setSortedLists(
      produce(sortedLists, (draft) => {
        const dragged = draft[dragListIndex].cards[dragIndex];
        draft[dragListIndex].cards.splice(dragIndex, 1);
        draft[hoverListIndex].cards.splice(hoverIndex, 0, dragged);
      })
    );
  };

  const handleSortStart = () => {
    setIsDragging(true);
  };

  const handleSortDone = () => {
    dispatch(
      sortCard({ taskBoardId: boardId as string, taskListArray: sortedLists })
    );
    setIsDragging(false);
  };

  const handleSortCancel = () => {
    setIsDragging(false);
    setSortedLists(lists.filter((list) => list.taskBoardId === boardId));
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
      <Hidden mdUp xsDown>
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
      <Grid container justify='space-between'>
        <Grid item className={classes.flexAuto}>
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
      <CustomDragLayer />
      {sortedLists.map((list, i) => (
        <Grid item lg={2} md={3} sm={4} xs={6} key={list.id}>
          <Card
            className={classes.paper}
            elevation={7}
            onDragStart={handleSortStart}
          >
            <TaskList list={list} listIndex={i} moveCard={moveCard} />
          </Card>
        </Grid>
      ))}
      {isSignedIn() && (
        <Grid item lg={2} md={3} sm={4} xs={6}>
          <AddTaskButton list id={boardId} />
        </Grid>
      )}
      {isDragging && isOwnedBy(boards[boardId].userId) && (
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
  );
};

export default TaskBoard;
