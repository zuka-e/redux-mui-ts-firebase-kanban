import React from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { TaskCards } from '../../models/Task';
import CardDetails from './CardDetails';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      border: `2px solid ${theme.palette.info.light}`,
      borderRadius: theme.spacing(0.5),
      '& > *': { boxShadow: 'none' }, // 直下の'paper'の影を消す
    },
    //'Dialog'閉ボタン
    button: {
      top: 0,
      right: 0,
      position: 'absolute',
    },
  })
);

interface OpenCardButtonProps {
  card: TaskCards['id'];
  open: boolean; // 'Dialog'開閉状態は親が持つ
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const OpenCardButton: React.FC<OpenCardButtonProps> = (props) => {
  const { card, open, setOpen } = props;
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {props.children} {/* 'setOpen'は、子が行う */}
      {/* 表示する内容を、<Dialog>内に記述 */}
      <Dialog fullWidth maxWidth={false} open={open} onClose={handleClose}>
        <DialogContent className={classes.root}>
          <IconButton
            className={classes.button}
            aria-label='close'
            onClick={handleClose}
          >
            <CloseIcon fontSize='large' />
          </IconButton>
          <CardDetails card={card} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
export default OpenCardButton;
