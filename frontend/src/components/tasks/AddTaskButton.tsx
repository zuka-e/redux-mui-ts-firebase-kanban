import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
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

import { addCard, addList } from '../../store/tasksSlice';
import { ITaskList, ITaskBoard } from '../Types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
      borderRadius: theme.spacing(0.5),
    },
    input: {
      '& > * > input': {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(0.5),
      },
    },
  })
);

interface Props {
  board?: ITaskBoard['taskBoardId'];
  list?: ITaskList['taskBordId'];
}

export const AddTaskButton: React.FC<Props> = (props) => {
  const { board, list } = props;
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  // 入力内容保持
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  // 'Card'('List'がないときは'List')を追加し、フィールドも閉じる
  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault(); // 'form submission canceled'防止
    if (title === '') return; // title空欄時は処理を行わない
    if (list) {
      dispatch(addCard({ taskListId: list.id, title: title }));
    } else if (board) {
      dispatch(addList({ taskBoardId: board.id, title: title }));
    }
    setTitle('');
    setIsEditing(false);
  };
  // 'Card'追加用フィールドの開閉
  const handleClick = () => {
    setIsEditing(!isEditing);
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
          className={!list ? classes.card : undefined}
          boxShadow={!list ? 1 : undefined}
          component='form' // CSS加工しつつフォームタグに
          onSubmit={handleSubmit} // returnキーの挙動
        >
          <TextField
            className={classes.input}
            variant='outlined'
            autoFocus
            placeholder='Enter a title.'
            helperText='2-20 characters'
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
            Add
          </Button>
          <IconButton aria-label='close' onClick={handleClick}>
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
        <Button startIcon={<AddIcon />} size='small' onClick={handleClick}>
          {list ? 'Add new card' : 'Add new list'}
        </Button>
      </Box>
    );
  }
};
