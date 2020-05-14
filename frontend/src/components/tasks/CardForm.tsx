import React from 'react';

import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  IconButton,
  ClickAwayListener,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import { ITaskCard } from '../Types';
import { editCard } from '../../store/tasksSlice';

type FormProps = {
  // 任意属性を利用して、複数のフォームに対応させる
  cardId: ITaskCard['taskCardId']['id'];
  title?: ITaskCard['taskCardId']['title'];
  body?: ITaskCard['taskCardId']['body'];
  editingTitle?: string;
  setEditingTitle?: React.Dispatch<React.SetStateAction<string>>;
  editingBody?: string;
  setEditingBody?: React.Dispatch<React.SetStateAction<string>>;
  toggleForm: () => void;
  handleClickAway: () => void;
};

const CardForm: React.FC<FormProps> = (props) => {
  const {
    cardId,
    title,
    body,
    editingTitle,
    setEditingTitle,
    editingBody,
    setEditingBody,
    toggleForm,
    handleClickAway,
  } = props; // 親の状態を変化させるものは、親から受け取る
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (title) {
      // 'title'が'true'(つまり'title'の編集中)の場合
      setEditingTitle?.(e.target.value); // '?.'は、値があるときのみ実行する
    } else if (body) {
      setEditingBody?.(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (title) {
      dispatch(editCard({ taskCardId: cardId, title: editingTitle }));
      toggleForm();
    } else if (body) {
      dispatch(editCard({ taskCardId: cardId, body: editingBody }));
      toggleForm();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          autoFocus
          fullWidth
          multiline={Boolean(body)}
          rows={body && 3}
          variant='outlined'
          helperText={title && '2-20 characters'}
          value={title ? editingTitle : editingBody}
          onChange={handleChange}
        />
        <Button
          color='primary'
          variant='contained'
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Save
        </Button>
        <IconButton aria-label='close' onClick={toggleForm}>
          <CloseIcon />
        </IconButton>
      </Box>
    </ClickAwayListener>
  );
};

export default CardForm;
