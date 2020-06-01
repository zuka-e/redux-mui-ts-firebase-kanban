import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SubjectIcon from '@material-ui/icons/Subject';

import { ITaskCard } from '../../models/Task';
import { isOwnedBy } from '../../models/Auth';
import { useAppDispatch } from '../../store/store';
import { toggleCard } from '../../store/tasksSlice';
import CardForm from './CardForm';
import PopoverButton from '../templates/PopoverButton';
import DeleteButton from './DeleteButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    text: {
      whiteSpace: 'pre-wrap', // 入力されたスペースをそのまま表示
      cursor: 'pointer', // 指型ポインター
    },
  })
);

const CardDetails: React.FC<ITaskCard> = ({ card }) => {
  const classes = useStyles();
  // 子のフォームを再レンダーしても値を保持するため、状態を持たせる
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [editingTitle, setEditingTitle] = useState(card.title);
  const [editingBody, setEditingBody] = useState(card.body);
  const dispatch = useAppDispatch();

  // 'onChange'では'state'変更不可時にも操作できてしまう
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(toggleCard({ taskCardId: card.id }));
  };
  // 'title'用フォームの表示切り替え
  const toggleTitleForm = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  // 'body'用フォームの表示切り替え
  const toggleBodyForm = () => {
    setIsEditingBody(!isEditingBody);
  };

  // フォームの外をクリックしたときの挙動(編集状態を中止)
  const handleClickAway = () => {
    setIsEditingTitle(false);
    setIsEditingBody(false);
  };

  return (
    <Card>
      <CardContent>
        <FormControlLabel // 'label'のある'checkbox'
          control={<Checkbox checked={card.done} onClick={handleClick} />}
          disabled={!isOwnedBy(card.userId)}
          label={card.done ? 'Finished!' : 'Unfinished.'}
        />
      </CardContent>
      <CardContent>
        <IconButton size='small' onClick={toggleTitleForm}>
          <AssignmentIcon />
        </IconButton>
        {isEditingTitle && isOwnedBy(card.userId) ? ( // 編集かどうかで表示の分岐
          <CardForm // 状態を変化させるために必要な要素を渡す
            cardId={card.id}
            title
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            toggleForm={toggleTitleForm}
            handleClickAway={handleClickAway}
          />
        ) : (
          <Typography
            className={classes.text}
            variant='h5'
            component='p'
            onClick={toggleTitleForm}
          >
            {card.title}
          </Typography>
        )}
      </CardContent>
      <CardContent>
        <IconButton size='small' onClick={toggleBodyForm}>
          <SubjectIcon />
        </IconButton>
        {isEditingBody && isOwnedBy(card.userId) ? ( // 編集中かどうかで表示の分岐
          <CardForm
            cardId={card.id}
            body
            editingBody={editingBody}
            setEditingBody={setEditingBody}
            toggleForm={toggleBodyForm}
            handleClickAway={handleClickAway}
          />
        ) : (
          <Typography
            className={classes.text}
            color='textPrimary'
            onClick={toggleBodyForm}
          >
            {card.body}
          </Typography>
        )}
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }} disableSpacing>
        {isOwnedBy(card.userId) && (
          <PopoverButton type='danger' buttonText='Delete'>
            <DeleteButton card id={card.id} />
          </PopoverButton>
        )}
      </CardActions>
    </Card>
  );
};

export default CardDetails;
