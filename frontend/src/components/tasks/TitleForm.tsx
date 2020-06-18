import React from 'react';

import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  IconButton,
  ClickAwayListener,
  Box,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import { useAppDispatch } from '../../store/store';
import {
  editList,
  addCard,
  addList,
  addBoard,
  editCard,
  editBoard,
} from '../../store/tasksSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formPaper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
      borderRadius: theme.spacing(0.5),
    },
    input: {
      '& > .MuiFormLabel-root.Mui-focused': {
        color: theme.palette.text.secondary,
      },
      '& > * > input': {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(0.5),
      },
    },
  })
);

// フォームで利用したいデータ名
const FormData = {
  title: 'title',
} as const;

type FormData = typeof FormData;

interface FormProps {
  method: 'POST' | 'PATCH';
  card?: boolean;
  list?: boolean;
  board?: boolean;
  id?: string;
  currentValue: string;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  toggleForm: () => void;
  handleClickAway: () => void;
}

const TitleForm: React.FC<FormProps> = (props) => {
  const {
    method,
    card,
    list,
    board,
    id,
    currentValue,
    editingTitle,
    setEditingTitle,
    toggleForm,
    handleClickAway,
  } = props;
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm<FormData>();
  const dispatch = useAppDispatch();

  // バリデーションの種類とエラーメッセージ
  const validation = {
    required: `The ${FormData.title} is required`,
    minLength: {
      value: 2,
      message: `The ${FormData.title} must be 2-20 characters`,
    },
    maxLength: {
      value: 20,
      message: `The ${FormData.title} must be 2-20 characters`,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  // 編集を破棄する
  const handleClose = () => {
    setEditingTitle(currentValue);
    toggleForm();
  };

  // 'submit'時に行う処理
  const onSubmit = (data: FormData) => {
    if (currentValue === data.title) {
      toggleForm();
      return;
    }
    if (method === 'POST') {
      if (card && id) {
        dispatch(addCard({ taskListId: id, title: data.title }));
      } else if (list && id) {
        dispatch(addList({ taskBoardId: id, title: data.title }));
      } else if (board) {
        dispatch(addBoard({ title: data.title }));
      }
    } else if (method === 'PATCH') {
      if (card && id) {
        dispatch(editCard({ taskCardId: id, title: data.title }));
      } else if (list && id) {
        dispatch(editList({ taskListId: id, title: data.title }));
      } else if (board && id) {
        dispatch(editBoard({ taskBoardId: id, title: data.title }));
      }
    }
    setEditingTitle('');
    toggleForm();
  };

  return (
    <ClickAwayListener
      mouseEvent='onMouseDown' // マウス押したタイミングで判定
      touchEvent='onTouchStart'
      onClickAway={handleClickAway}
    >
      <Box
        className={method === 'POST' && !card ? classes.formPaper : undefined}
        boxShadow={method === 'POST' && !card ? 1 : undefined}
        component='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          className={classes.input}
          name='title'
          autoFocus
          fullWidth
          variant='outlined'
          label={currentValue || undefined} // 現在のタイトル表示
          InputLabelProps={{ margin: 'dense' }} // classes.inputに対応
          placeholder='Enter a title'
          value={editingTitle}
          helperText={errors?.title?.message || '2-20 characters'}
          error={Boolean(errors.title)}
          inputRef={register(validation)}
          onChange={handleChange}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          size='small'
          startIcon={<SaveIcon />}
        >
          {method === 'POST' ? 'Add' : 'Save'}
        </Button>
        <IconButton size='small' aria-label='close' onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </ClickAwayListener>
  );
};
export default TitleForm;
