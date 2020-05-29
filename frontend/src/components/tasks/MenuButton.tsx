import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ListMenu from './ListMenu';
import BoardMenu from './BoardMenu';
import { Button } from '@material-ui/core';

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

interface Props {
  board?: boolean;
  list?: boolean;
  id: string;
  variant?: 'text' | 'outlined' | 'contained';
}

const MenuButton: React.FC<Props> = (props) => {
  const { board, list, id, variant } = props;
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
  const htmlId = open ? 'list-menu' : undefined;

  return (
    <React.Fragment>
      {variant ? (
        <Button
          variant={variant}
          aria-describedby={htmlId}
          onClick={handleClick}
          aria-label='menu'
        >
          {props.children}
        </Button>
      ) : (
        <IconButton // ポップオーバーさせるボタン
          aria-describedby={htmlId}
          size='small'
          onClick={handleClick}
          aria-label='menu'
        >
          <MoreVertIcon />
        </IconButton>
      )}

      <Popover
        className={classes.popover}
        id={htmlId}
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
        {list && <ListMenu listId={id} handleClose={handleClose} />}
        {board && <BoardMenu boardId={id} handleClose={handleClose} />}
      </Popover>
    </React.Fragment>
  );
};

export default MenuButton;
