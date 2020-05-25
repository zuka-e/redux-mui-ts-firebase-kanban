import React from 'react';

import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { Grid, Box, Typography, LinearProgress } from '@material-ui/core';

import { RootState } from '../store/rootReducer';
import { AddTaskButton } from './tasks/AddTaskButton';
import { ITaskBoard } from './Types';

const Home: React.FC = () => {
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
            <Link to={`/boards/${board.id}`} style={{ textDecoration: 'none' }}>
              <Box m={1} p={1} borderRadius={5} bgcolor='secondary.main'>
                <Typography
                  component='p'
                  variant='h5'
                  color='textSecondary'
                  gutterBottom
                >
                  {board.title}
                </Typography>
              </Box>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Home;
