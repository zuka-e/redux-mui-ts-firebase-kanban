import React from 'react';

import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  Typography,
  LinearProgress,
  CardActions,
} from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import moment from 'moment';

import { TaskBoardsArray } from '../../models/Task';
import { isSignedIn } from '../../models/Auth';
import { RootState } from '../../store/rootReducer';
import AddTaskButton from './AddTaskButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
    },
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',
    },
    header: {
      fontSize: '1.5em',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
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
    cmtime: {
      display: 'flex',
      justifyContent: 'flex-end',
      color: theme.palette.text.hint,
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
  })
);

const TaskBoardIndex: React.FC = () => {
  const classes = useStyles();
  const boards = useSelector(
    (state: RootState) => state.firestore.ordered.boards as TaskBoardsArray
  );

  if (!isLoaded(boards)) {
    return <LinearProgress variant='query' color='secondary' />;
  }

  return (
    <Grid container className={classes.root}>
      {boards.map((board) => {
        return (
          <Grid item lg={3} sm={4} xs={6} key={board.id}>
            <Link to={`/boards/${board.id}`} className={classes.link}>
              <Card className={classes.paper} elevation={7}>
                <Typography
                  className={`${classes.header} ${classes.scrollbar}`}
                  color='textSecondary'
                  gutterBottom
                >
                  {board.title}
                </Typography>
                <CardActions className={classes.cmtime}>
                  <UpdateIcon style={{ margin: 'auto 3px' }} />
                  {moment(board.updatedAt.toDate()).calendar()}
                </CardActions>
              </Card>
            </Link>
          </Grid>
        );
      })}
      {isSignedIn() && (
        <Grid item lg={3} sm={4} xs={6}>
          <AddTaskButton board />
        </Grid>
      )}
    </Grid>
  );
};

export default TaskBoardIndex;
