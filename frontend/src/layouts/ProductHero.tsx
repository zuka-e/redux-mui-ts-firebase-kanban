import * as React from 'react';
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
} from '@material-ui/core/styles';
import ProductHeroLayout from './ProductHeroLayout';
import { Grid, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const backgroundImage = 'static/list_paper.jpg';

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: 'center',
    },
    spacing: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(4),
      },
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',
    },
    left: {
      marginRight: theme.spacing(2),
    },
  });

function ProductHero(props: WithStyles<typeof styles>) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      <Typography variant='h2' color='inherit'>
        Upgrade your Sundays
      </Typography>
      <Typography variant='h5' color='inherit' className={classes.spacing}>
        Enjoy secret offers up to -70% off the best luxury hotels every Sunday.
        Enjoy secret offers up to -70% off the best luxury hotels every
        Sunday.Enjoy secret offers up to -70% off the best luxury hotels every
        Sunday.
      </Typography>
      <Grid className={classes.spacing}>
        <Link to={'/login'} className={classes.link}>
          <Button variant='contained' color='primary' className={classes.left}>
            Sign in
          </Button>
        </Link>
        <Link to={'/login'} className={classes.link}>
          <Button variant='contained' color='secondary'>
            Sign up
          </Button>
        </Link>
      </Grid>
    </ProductHeroLayout>
  );
}

export default withStyles(styles)(ProductHero);
