import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';

import { useAppDispatch } from '../../store/store';
import { removeCard, removeList, removeBoard } from '../../store/tasksSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      padding: theme.spacing(1),
      borderBottom: `1px solid ${theme.palette.error.dark}`,
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

interface DeleteButtonProps {
  message?: string;
  card?: boolean;
  list?: boolean;
  board?: boolean;
  id: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { message, card, list, board, id } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleRemove = () => {
    if (card) {
      dispatch(removeCard({ taskCardId: id }));
    } else if (list) {
      dispatch(removeList({ taskListId: id }));
    } else if (board) {
      dispatch(removeBoard({ taskBoardId: id }));
    }
  };

  return (
    <React.Fragment>
      {message && (
        <Typography className={classes.message}>{message}</Typography>
      )}
      <Box my={1} display='flex' justifyContent='space-around'>
        <Typography variant='h5' component='p' color='error'>
          Are you sure to delete?
        </Typography>
      </Box>
      <Button
        className={classes.danger}
        variant='outlined'
        fullWidth
        onClick={handleRemove}
      >
        Delete
      </Button>
    </React.Fragment>
  );
};

export default DeleteButton;
