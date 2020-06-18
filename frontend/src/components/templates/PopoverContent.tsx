import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';

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

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';
interface PopoverContentProps {
  trigger: any;
  position?: PopoverPosition;
}

const PopoverContent: React.FC<PopoverContentProps> = (props) => {
  const { trigger, position } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  interface PopoverOrigin {
    vertical: 'top' | 'center' | 'bottom' | number;
    horizontal: 'left' | 'center' | 'right' | number;
  }
  let anchorOrigin: PopoverOrigin;
  let transformOrigin: PopoverOrigin;

  switch (position) {
    case 'top':
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'center',
      };
      transformOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
      };
      break;
    case 'right':
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'right',
      };
      transformOrigin = {
        vertical: 'top',
        horizontal: 'left',
      };
      break;
    case 'bottom':
      anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
      };
      transformOrigin = {
        vertical: 'top',
        horizontal: 'center',
      };
      break;
    case 'left':
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'left',
      };
      transformOrigin = {
        vertical: 'top',
        horizontal: 'right',
      };
      break;
    default:
      anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
      };
      transformOrigin = {
        vertical: 'top',
        horizontal: 'center',
      };
      break;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const htmlId = open ? 'menu' : undefined;

  return (
    <React.Fragment>
      <Box aria-describedby={htmlId} onClick={handleClick} aria-label='menu'>
        {trigger}
      </Box>
      <Popover
        className={classes.popover}
        id={htmlId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {props.children}
      </Popover>
    </React.Fragment>
  );
};

export default PopoverContent;
