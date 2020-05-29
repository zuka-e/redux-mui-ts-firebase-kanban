import React, { useContext } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';

import { ThemeContext, themes } from './ThemeProvider';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      flex: 'auto',
      fontWeight: 'bold',
      color: 'inherit',
      textDecoration: 'none',
    },
  })
);

const Header: React.FC = () => {
  const context = useContext(ThemeContext);

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
            aria-controls='menu'
            aria-haspopup='true'
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <CloseIcon />
            </MenuItem>
            {themes.map((theme, index) => (
              <MenuItem key={index} onClick={() => context.toggleTheme(theme)}>
                {theme}
              </MenuItem>
            ))}
          </Menu>
          <Link to={'/'} className={classes.title}>
            <Typography component='p' variant='h4'>
              Title
            </Typography>
          </Link>
          <Button color='inherit'>(Login)</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
