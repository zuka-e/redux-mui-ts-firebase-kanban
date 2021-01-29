import * as React from 'react';
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // content on image
      flexDirection: 'column',
      position: 'relative',
      [theme.breakpoints.up('sm')]: {
        minHeight: '95vh',
        maxHeight: 1300,
      },
    },
    tagline: { color: theme.palette.common.white },
    backdrop: {
      // backgroundImageStyle
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.black,
      opacity: 0.25,
      zIndex: -1,
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      zIndex: -2,
    },
  });

interface ProductHeroLayoutProps {
  backgroundClassName: string;
}

function ProductHeroLayout(
  props: WithStyles<typeof styles> &
    React.HTMLAttributes<HTMLDivElement> &
    ProductHeroLayoutProps
) {
  const { backgroundClassName, children, classes } = props;

  return (
    // contents on image
    // <section className={classes.root}>
    <Grid container component='section' className={classes.root}>
      <Container maxWidth='md'>
        <Grid item sm={7} md={6} className={classes.tagline}>
          <img
            // image over heading
            src='/static/themes/onepirate/productHeroWonder.png'
            alt='wonder'
            width='147'
            height='80'
          />
          {children}
          {/* background image */}
          <div className={classes.backdrop} />
          <div className={`${classes.background} ${backgroundClassName}`} />
        </Grid>
      </Container>
    </Grid>
    // {/* // </section> */}
  );
}

export default withStyles(styles)(ProductHeroLayout);
