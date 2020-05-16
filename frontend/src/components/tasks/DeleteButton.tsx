import React from 'react';

import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';

import { removeCard, removeList } from '../../store/tasksSlice';

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

interface DeleteProps {
  message?: string;
  target: 'list' | 'card';
  id: string;
}

const DeleteButton: React.FC<DeleteProps> = (props) => {
  const { message, target, id } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleRemove = () => {
    if (target === 'list') {
      dispatch(removeList({ taskListId: id }));
    } else if (target === 'card') {
      dispatch(removeCard({ taskCardId: id }));
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
