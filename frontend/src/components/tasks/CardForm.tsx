import React from 'react';

import {
  Box,
  Button,
  IconButton,
  ClickAwayListener,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import { TaskCards } from '../../models/Task';
import { useAppDispatch } from '../../store/store';
import { editCard } from '../../store/firestore/cards';

interface CardFormProps {
  // 任意属性を利用して、複数のフォームに対応させる
  cardId: TaskCards['id']['id'];
  title?: boolean;
  body?: boolean;
  editingTitle?: string;
  setEditingTitle?: React.Dispatch<React.SetStateAction<string>>;
  editingBody?: string;
  setEditingBody?: React.Dispatch<React.SetStateAction<string>>;
  toggleForm: () => void;
  handleClickAway: () => void;
}

const CardForm: React.FC<CardFormProps> = (props) => {
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
  const dispatch = useAppDispatch();

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
    <ClickAwayListener
      mouseEvent='onMouseDown' // マウス押したタイミングで判定
      touchEvent='onTouchStart'
      onClickAway={handleClickAway}
    >
      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          autoFocus
          fullWidth
          multiline={!!body}
          rows={body ? 3 : undefined}
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
