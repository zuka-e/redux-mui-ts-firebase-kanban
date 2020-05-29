import React from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Typography, Button } from '@material-ui/core';

const Error404 = () => {
  const history = useHistory();

  return (
    <Container maxWidth='md'>
      <h1>404 Page Not Found</h1>
      <Typography component='p' variant='h6' color='textSecondary' paragraph>
        There was no page what you were looking for.
      </Typography>
      <Button
        variant='contained'
        color='primary'
        onClick={() => history.goBack()}
      >
        Go Back
      </Button>
    </Container>
  );
};

export default Error404;
