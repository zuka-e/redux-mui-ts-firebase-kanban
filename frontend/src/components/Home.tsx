import React from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Box, Typography } from '@material-ui/core';

import { RootState } from '../store/rootReducer';
import { boardOrder } from './tasks/initial-data';

const Home: React.FC = () => {
  const { boards } = useSelector((state: RootState) => state.task);
  return (
    <Grid container>
      {boardOrder.map((boardID) => {
        const board = boards[boardID];
        return (
          <Grid item lg={3} sm={4} xs={6} key={board.id}>
            <Link to={`/boards/${board.id}`} style={{ textDecoration: 'none' }}>
              <Box m={1} p={1} borderRadius={5} bgcolor='secondary.main'>
                <Typography
                  component='p'
                  variant='h4'
                  color='inherit'
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
