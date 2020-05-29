import React, { useEffect } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Card, CardHeader } from '@material-ui/core';

import ui, { uiConfig } from '../config/firebaseui';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginTop: '2%',
    },
    alignCenter: {
      textAlign: 'center',
    },
  })
);

const Login = () => {
  const classes = useStyles();

  useEffect(() => {
    ui.start('#auth-container', uiConfig);
  });

  return (
    <Grid container justify='center' className={classes.content}>
      <Grid item lg={4} md={6} sm={8} xs={10}>
        <Card id='auth-container'>
          <CardHeader
            className={classes.alignCenter}
            title='Sign in'
            subheader='You can also create an account'
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
