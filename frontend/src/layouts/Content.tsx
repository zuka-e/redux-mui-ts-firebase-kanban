import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
}));

const Content: React.FC = () => {
  const classes = useStyles();
  return (
    <Switch>
      <Route exact path='/'>
        <Grid container spacing={5} className={classes.root}>
          {/* content */}
        </Grid>
      </Route>
    </Switch>
  );
};

export default Content;
