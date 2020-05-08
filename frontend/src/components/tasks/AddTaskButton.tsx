import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Button,
  TextField,
  IconButton,
  ClickAwayListener,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';

import { addCard, addList } from '../../store/tasksSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      backgroundColor: '#fff',
      borderRadius: '4px',
      marginBottom: theme.spacing(1),
    },
  })
);

interface Props {
  // 任意のprops
  list?: {
    taskBoardId: string;
    id: string;
    title: string;
    taskCardIds: string[];
  };
}

export const AddTaskButton: React.FC<Props> = ({ list }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const classes = useStyles();
  const buttonText = list ? 'Add new card' : 'Add new list';

  // 入力内容保持
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  // 'Card'('List'がないときは'List')を追加し、フィールドも閉じる
  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    if (title === '') return; // title空欄時は処理を行わない
    e.preventDefault(); // 'form submission canceled'防止
    if (list) {
      dispatch(addCard({ taskListId: list.id, title: title }));
    } else {
      dispatch(addList({ taskBoardId: 'board-1', title: title }));
    }
    setTitle('');
    setIsEditing(false);
  };
  // 'Card'追加用フィールドを閉じる
  const handleClose = () => {
    setIsEditing(false);
  };
  // 要素外クリック時もフィールドを閉じる
  const handleClickAway = () => {
    setIsEditing(false);
  };

  // 'Card'追加用フィールドを表示する関数(表示有無は'React.FC'内で変更)
  const renderNewCardInput = () => {
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box // 'List'追加時フォームの'Card'との差別化
          component='form' // CSS加工しつつフォームタグに
          onSubmit={handleSubmit} // returnキーの挙動
          m={!list ? 1 : 'auto'}
          p={!list ? 1 : 'auto'}
          borderRadius={!list ? 5 : 'inherit'}
          bgcolor={!list ? 'secondary.main' : 'inherit'}
        >
          <TextField
            className={classes.input}
            label='Input a title.' // 説明テキスト
            variant='outlined'
            defaultValue={title} // 'state'保持
            onChange={handleChange}
          />
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Save
          </Button>
          <IconButton aria-label='close' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </ClickAwayListener>
    );
  };

  if (isEditing) {
    // 'Button'を押すと編集中になり、以下を表示
    return renderNewCardInput();
  } else {
    return (
      <Box component='div' pt={1}>
        <Button
          startIcon={<AddIcon />}
          size='small'
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {buttonText}
        </Button>
      </Box>
    );
  }
};
