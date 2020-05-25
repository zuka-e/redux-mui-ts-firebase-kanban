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

import { addCard, addList, addBoard } from '../../store/tasksSlice';

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
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(0.5),
      },
    },
    button: {
      justifyContent: 'flex-start',
      width: `calc(100% - ${theme.spacing(2)}px)`,
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: 'rgb(0,0,0,0.1)',
    },
  })
);

interface Props {
  card?: boolean;
  list?: boolean;
  board?: boolean;
  boardId?: string;
  listId?: string;
}

export const AddTaskButton: React.FC<Props> = (props) => {
  const { card, list, board, boardId, listId } = props;
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
    if (card && listId) {
      dispatch(addCard({ taskListId: listId, title: title }));
    } else if (list && boardId) {
      dispatch(addList({ taskBoardId: boardId, title: title }));
    } else if (board) {
      dispatch(addBoard({ title: title }));
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
      <ClickAwayListener
        mouseEvent='onMouseDown' // マウス押したタイミングで判定
        touchEvent='onTouchStart'
        onClickAway={handleClickAway}
      >
        <Box // 'List'追加時フォームの'Card'との差別化
          className={!card ? classes.card : undefined}
          boxShadow={!card ? 1 : undefined}
          component='form' // CSS加工しつつフォームタグに
          onSubmit={handleSubmit} // returnキーの挙動
        >
          <TextField
            className={classes.input}
            variant='outlined'
            fullWidth
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
          <IconButton size='small' aria-label='close' onClick={handleClick}>
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
      <Button
        className={!card ? classes.button : undefined}
        startIcon={<AddIcon />}
        size='small'
        fullWidth={Boolean(!card)}
        onClick={handleClick}
      >
        Add new {card ? 'card' : list ? 'list' : 'board'}
      </Button>
    );
  }
};
