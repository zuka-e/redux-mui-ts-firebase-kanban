import React from 'react';

import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import { Backdrop, CircularProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/List';

import { TaskBoardsArray } from '../models/Task';
import { isSignedIn } from '../models/Auth';
import { RootState } from '../store/rootReducer';
import PopoverContent from '../components/templates/PopoverContent';
import AccountMenu from '../components/auth/AccountMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    drawer: {
      width: '250px',
    },
    listHeader: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    flexIcon: {
      margin: 'auto 0',
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
  const [state, setState] = React.useState(false);

  // 'firebase.auth().currenUser'取得のために'useSelector'が必要の模様
  const currentUser = useSelector((state: RootState) => state.firebase.auth);
  const boards = useSelector(
    (state: RootState) => state.firestore.ordered.boards as TaskBoardsArray
  );

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState(open);
  };

  const renderDrawerContent = () => (
    <div className={classes.drawer}>
      <List
        component='nav'
        aria-labelledby='menu-header'
        subheader={
          <ListSubheader
            className={classes.listHeader}
            component='div'
            id='menu-header'
          >
            <IconButton
              className={classes.flexIcon}
              size='small'
              onClick={toggleDrawer(false)}
            >
              <MenuIcon />
            </IconButton>
            Main menu
            <div style={{ height: '30px', width: '30px' }} />
          </ListSubheader>
        }
      >
        <Divider />
        <List disablePadding>
          <PopoverContent
            position='right'
            trigger={
              <ListItem button>
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary='Board list' />
              </ListItem>
            }
          >
            <List
              disablePadding
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {boards.map((board) => (
                <Link
                  to={`/boards/${board.id}`}
                  className={classes.link}
                  key={board.id}
                >
                  <ListItem button>
                    <ListItemText primary={board.title} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </PopoverContent>
        </List>
      </List>
    </div>
  );

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
        <Button size='small' className={classes.circleButton}>
          <Avatar
            alt='avatar'
            src={currentUser.photoURL || undefined}
            className={classes.pink}
          >
            {currentUser.photoURL || <PersonIcon />}
          </Avatar>
        </Button>
      }
    >
      <AccountMenu />
    </PopoverContent>
  );

  if (!isLoaded(boards)) {
    return (
      <Backdrop className={classes.backdrop} open={!isLoaded(boards)}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

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
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor='left' open={state} onClose={toggleDrawer(false)}>
            {renderDrawerContent()}
          </Drawer>
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
