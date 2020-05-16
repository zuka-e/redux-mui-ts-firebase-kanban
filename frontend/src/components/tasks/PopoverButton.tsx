import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      // ポップオーバーで現れる部分のクラス名
      '& > .MuiPopover-paper': {
        padding: theme.spacing(1.5),
      },
    },
    info: {
      color: theme.palette.info.main,
      backgroundColor: '#fafbfc',
      border: `1px solid ${theme.palette.info.main}`,
      '&:hover': {
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.info.main,
      },
    },
    warning: {
      color: theme.palette.warning.dark,
      backgroundColor: '#fafbfc',
      border: `1px solid ${theme.palette.warning.dark}`,
      '&:hover': {
        color: '#fff',
        backgroundColor: theme.palette.warning.dark,
      },
    },
    danger: {
      color: theme.palette.error.dark,
      backgroundColor: '#fafbfc',
      border: `1px solid ${theme.palette.error.dark}`,
      '&:hover': {
        color: '#fff',
        backgroundColor: theme.palette.error.dark,
      },
    },
  })
);

interface PopoverProps {
  type?: 'info' | 'warning' | 'danger';
  buttonText: string;
}

// ポップオーバーのみ(表示内容は'props.children'以下)
const PopoverButton: React.FC<PopoverProps> = (props) => {
  const { type, buttonText } = props;
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
  const htmlId = open ? 'popover' : undefined;

  return (
    <div>
      <Button // 'type'スタイルの分岐
        className={
          type === 'info'
            ? classes.info
            : type === 'warning'
            ? classes.warning
            : type === 'danger'
            ? classes.danger
            : undefined
        }
        variant='outlined'
        aria-describedby={htmlId}
        onClick={handleClick}
        aria-label={buttonText}
      >
        {open ? 'CLOSE' : buttonText}
      </Button>
      <Popover
        className={classes.paper}
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
    </div>
  );
};

export default PopoverButton;
