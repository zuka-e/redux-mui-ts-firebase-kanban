import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    display: 'flex',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  linkGroup: {
    marginRight: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRight: '1px solid',
  },
  copyRight: {
    opacity: '0.8',
  },
}));

function Copyright() {
  return (
    <React.Fragment>
      {`© ${process.env.REACT_APP_PROJECT_NAME}`}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container>
        <Grid container direction='column' alignItems='center'>
          <Grid item>
            <Link
              to='/terms'
              className={`${classes.link} ${classes.linkGroup}`}
            >
              Terms
            </Link>
            <Link to='/privacy' className={classes.link}>
              Privacy
            </Link>
          </Grid>
          <Grid item className={classes.copyRight}>
            <Copyright />
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
