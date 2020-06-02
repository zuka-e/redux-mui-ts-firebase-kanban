import React from 'react';

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

const PopoverContent: React.FC<{ trigger: any }> = (props) => {
  const { trigger } = props;
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {props.children}
      </Popover>
    </React.Fragment>
  );
};

export default PopoverContent;
