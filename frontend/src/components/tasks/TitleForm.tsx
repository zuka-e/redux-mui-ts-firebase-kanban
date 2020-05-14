import React from 'react';

import { useDispatch } from 'react-redux';
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

import { editList } from '../../store/tasksSlice';
import { ITaskList } from '../Types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(1, 0.5, 0.5),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.primary.main}`,
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
  const dispatch = useDispatch();

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
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        component='form'
        className={classes.card}
        boxShadow={1}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          name='title'
          autoFocus
          fullWidth
          variant='outlined'
          label={list.title} // 現在のタイトル表示
          placeholder='Enter a title'
          value={editingTitle}
          helperText={errors?.title?.message || '2-20 characters'}
          FormHelperTextProps={{ variant: 'standard' }}
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
        <IconButton aria-label='close' onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </ClickAwayListener>
  );
};
export default TitleForm;
