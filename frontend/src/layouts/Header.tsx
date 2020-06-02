import React from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Menu, MenuItem, Avatar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';

import { isSignedIn } from '../models/Auth';
import { RootState } from '../store/rootReducer';
import PopoverContent from '../components/templates/PopoverContent';
import AccountMenu from '../components/auth/AccountMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    circleButton: {
      borderRadius: '50%',
      minWidth: 'unset',
    },
    title: {
      flexGrow: 1,
      fontWeight: 'bold',
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',
    },
    pink: {
      color: theme.palette.getContrastText(pink[500]),
      backgroundColor: pink[500],
    },
  })
);

const Header: React.FC = () => {
  const classes = useStyles();
  // 'firebase.auth().currenUser'取得のために'useSelector'が必要の模様
  const currentUser = useSelector((state: RootState) => state.firebase.auth);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderSignInLink = () => (
    <Link to={'/login'} className={classes.link}>
      <Button color='inherit' startIcon={<AccountCircleIcon />}>
        Signin
      </Button>
    </Link>
  );

  const renderAccountIcon = () => (
    <PopoverContent
      trigger={
        (
          <Button size='small' className={classes.circleButton}>
            <Avatar
              alt='avatar'
              src={currentUser.photoURL || undefined}
              className={classes.pink}
            >
              {currentUser.photoURL || <PersonIcon />}
            </Avatar>
          </Button>
        ) as object
      }
    >
      <AccountMenu />
    </PopoverContent>
  );

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
          </Menu>
          <Typography className={classes.root} component='p' variant='h4'>
            <Link to={'/'} className={`${classes.title} ${classes.link}`}>
              Title
            </Link>
          </Typography>
          {isSignedIn() ? renderAccountIcon() : renderSignInLink()}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
