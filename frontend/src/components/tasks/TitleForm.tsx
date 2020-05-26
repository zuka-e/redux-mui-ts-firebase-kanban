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

import { ITaskList } from '../Types';
import { useAppDispatch } from '../../store/store';
import { editList } from '../../store/tasksSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  toggleForm: () => void;
  handleClickAway: () => void;
  list: ITaskList['taskListId'];
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
}

const TitleForm: React.FC<FormProps> = (props) => {
  const {
    toggleForm,
    handleClickAway,
    list,
    editingTitle,
    setEditingTitle,
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
    setEditingTitle(list.title);
    toggleForm();
  };

  // 'submit'時に行う処理
  const onSubmit = (data: FormData) => {
    dispatch(editList({ taskListId: list.id, title: data.title }));
    toggleForm();
  };

  return (
    <ClickAwayListener
      mouseEvent='onMouseDown' // マウス押したタイミングで判定
      touchEvent='onTouchStart'
      onClickAway={handleClickAway}
    >
      <Box component='form' my={1} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={classes.input}
          name='title'
          autoFocus
          fullWidth
          variant='outlined'
          label={list.title} // 現在のタイトル表示
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
          Save
        </Button>
        <IconButton size='small' aria-label='close' onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </ClickAwayListener>
  );
};
export default TitleForm;
