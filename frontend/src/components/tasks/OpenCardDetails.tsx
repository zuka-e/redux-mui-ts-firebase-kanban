import React from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { IconButton, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { ITaskCard } from '../Types';
import CardDetails from './CardDetails';

const useStyles = makeStyles((theme: Theme) =>
  // モーダル位置
  createStyles({
    root: {
      top: '50px',
      left: '5%',
      position: 'absolute',
      width: '90%',
      backgroundColor: theme.palette.background.paper,
      border: `2px solid ${theme.palette.info.main}`,
      padding: theme.spacing(1, 1, 2),
      '& > *': { boxShadow: 'none' }, // 直下の'paper'の影を消す
    },
    button: {
      //モーダル閉ボタン
      top: 0,
      right: 0,
      position: 'absolute',
    },
  })
);

interface Props {
  card: ITaskCard['taskCardId'];
  open: boolean; // モーダル開始は親に依存
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const OpenCardButton: React.FC<Props> = (props) => {
  const { card, open, setOpen } = props;
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {props.children} {/* 利用の際は、モーダル開始のロジックを子に記述 */}
      {/* 表示する内容を、<Modal>以下に記述 */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        <Paper className={classes.root}>
          <CardDetails card={card} />
          <IconButton
            className={classes.button}
            aria-label='close'
            onClick={handleClose}
          >
            <CloseIcon fontSize='large' />
          </IconButton>
        </Paper>
      </Modal>
    </React.Fragment>
  );
};
export default OpenCardButton;
