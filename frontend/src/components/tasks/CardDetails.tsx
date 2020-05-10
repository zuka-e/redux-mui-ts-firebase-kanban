import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SubjectIcon from '@material-ui/icons/Subject';

import { ITaskCard } from '../Types';
import { toggleCard } from '../../store/tasksSlice';
import CardForm from './CardForm';
import DeleteCardButton from './DeleteCardButton';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      justifyContent: 'flex-end',
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
  const dispatch = useDispatch();

  // 'TaskCard.done'の切り替え
  const handleCheck = () => {
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
      <CardActions>
        <FormControlLabel // 'label'のある'checkbox'
          control={<Checkbox checked={card.done} onChange={handleCheck} />}
          label={card.done ? 'Finished!' : 'Unfinished.'}
        />
      </CardActions>
      <CardContent>
        <AssignmentIcon />
        {isEditingTitle ? ( // 編集かどうかで条件分岐
          <CardForm // 状態を変化させるために必要な要素を渡す
            cardId={card.id}
            title={card.title}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            toggleForm={toggleTitleForm}
            handleClickAway={handleClickAway}
          />
        ) : (
          <Typography variant='h5' component='div' onClick={toggleTitleForm}>
            {card.title}
          </Typography>
        )}
      </CardContent>
      <CardContent>
        <SubjectIcon />
        {isEditingBody ? ( // 編集中かどうかで条件分岐
          <CardForm
            cardId={card.id}
            body={card.body}
            editingBody={editingBody}
            setEditingBody={setEditingBody}
            toggleForm={toggleBodyForm}
            handleClickAway={handleClickAway}
          />
        ) : (
          <Typography color='textPrimary' onClick={toggleBodyForm}>
            {card.body}
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.root} disableSpacing>
        <DeleteCardButton cardId={card.id} />
      </CardActions>
    </Card>
  );
};

export default CardDetails;
