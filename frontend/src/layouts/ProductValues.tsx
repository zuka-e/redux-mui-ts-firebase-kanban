import * as React from 'react';
import {
  withStyles,
  Theme,
  createStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Paper, Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
      backgroundColor: theme.palette.secondary.light,
    },
    container: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(8),
      position: 'relative',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      padding: theme.spacing(4, 5),
    },
    image: {
      width: '100%',
    },
    title: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
      fontWeight: 'bold',
      fontSize: '2.25em',
    },
  });

function ProductValues(props: WithStyles<typeof styles>) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <h2 style={{ textAlign: 'center', fontSize: '4em' }}>Values</h2>
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Paper elevation={16} className={classes.item}>
              <img
                className={classes.image}
                src='static/calender_note.jpg'
                alt='suitcase'
              />
              <h3 className={classes.title}>The luxury hotels</h3>
              <Typography variant='h5'>
                {
                  'From the latest trendy hotel to the iconic palace with XXL pool'
                }
                {
                  ', go for a mini-vacation just a few subway stops away from your home.'
                }
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={8} className={classes.item}>
              <img
                className={classes.image}
                src='static/calender_note.jpg'
                alt='graph'
              />
              <h3 className={classes.title}>New experiences</h3>
              <Typography variant='h5'>
                {
                  'Privatize a pool, take a Japanese bath or wake up in 900m2 of garden… '
                }
                {'your Sundays will not be alike.'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={8} className={classes.item}>
              <img
                className={classes.image}
                src='static/list_paper.jpg'
                alt='clock'
              />
              <h3 className={classes.title}>Exclusive rates</h3>
              <Typography variant='h5'>
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

export default withStyles(styles)(ProductValues);
