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

import { ITaskBoard } from '../../models/Task';
import { isSignedIn } from '../../models/Auth';
import { RootState } from '../../store/rootReducer';
import AddTaskButton from './AddTaskButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',
    },
    flexEnd: {
      justifyContent: 'flex-end',
    },
  })
);

const Home: React.FC = () => {
  const classes = useStyles();
  const boards = useSelector(
    (state: RootState) => state.firestore.ordered.boards as ITaskBoard['id'][]
  );

  if (!isLoaded(boards)) {
    return <LinearProgress variant='query' color='secondary' />;
  }

  return (
    <Grid container>
      {boards.map((board) => {
        return (
          <Grid item lg={3} sm={4} xs={6} key={board.id}>
            <Link to={`/boards/${board.id}`} className={classes.link}>
              <Card className={classes.paper} elevation={7}>
                <Typography
                  component='p'
                  variant='h5'
                  color='textSecondary'
                  gutterBottom
                >
                  {board.title}
                </Typography>
                <CardActions className={classes.flexEnd}>
                  <UpdateIcon style={{ margin: 'auto 3px' }} />
                  {moment(board.updatedAt.toDate().toString()).calendar()}
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

export default Home;
