import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import { useDispatch } from 'react-redux';
import { removeCard } from '../../store/tasksSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      // ポップオーバーで現れる部分のクラス名
      '& > .MuiPopover-paper': {
        border: '1px solid #cb2431',
      },
    },
    typography: {
      padding: theme.spacing(2),
    },
    fullWidth: {
      width: '95%',
    },
    closeBtn: {
      padding: 0,
      marginLeft: '8px',
    },
    dangerBtn: {
      color: '#cb2431',
      backgroundColor: '#fafbfc',
      border: '1px solid #cb2431',
      margin: '0 2.5% 3px',
      '&:hover': {
        color: '#fff',
        backgroundColor: '#cb2431',
      },
    },
  })
);

// ポップオーバーコンポーネント
const DeleteCardButton: React.FC<{ cardId: string }> = ({ cardId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    dispatch(removeCard({ taskCardId: cardId }));
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button // ポップオーバーさせるボタン
        className={classes.dangerBtn}
        variant='outlined'
        startIcon={<DeleteIcon />}
        aria-describedby={id}
        onClick={handleClick}
        aria-label='delete'
      >
        Delete
      </Button>
      <Popover
        className={classes.paper}
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
        <Typography className={classes.typography}>
          Are you sure to delete?
          <IconButton
            className={classes.closeBtn}
            aria-describedby={id}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
        <Button // ポップオーバー表示後のボタン
          className={`${classes.dangerBtn} ${classes.fullWidth}`}
          variant='outlined'
          fullWidth
          onClick={handleRemove}
        >
          Delete
        </Button>
      </Popover>
    </div>
  );
};

export default DeleteCardButton;
