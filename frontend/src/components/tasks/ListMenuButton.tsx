import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ListMenu from './ListMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      '& > .MuiPopover-paper': {
        width: '300px',
        border: `1px solid ${theme.palette.info.light}`,
      },
    },
  })
);

const ListMenuButton: React.FC<{ listId: string }> = ({ listId }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'list-menu' : undefined;

  return (
    <React.Fragment>
      <IconButton // ポップオーバーさせるボタン
        aria-describedby={id}
        size='small'
        onClick={handleClick}
        aria-label='menu'
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        className={classes.popover}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ListMenu listId={listId} handleClose={handleClose} />
      </Popover>
    </React.Fragment>
  );
};

export default ListMenuButton;
