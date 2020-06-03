import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import TitleForm from './TitleForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  id?: string;
}

const AddTaskButton: React.FC<Props> = (props) => {
  const { card, list, board, id } = props;
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  // 'Card'追加用フィールドの開閉
  const toggleForm = () => {
    setIsEditing(!isEditing);
  };
  // 要素外クリック時もフィールドを閉じる
  const handleClickAway = () => {
    setIsEditing(false);
  };

  // 'Button'を押すと編集中になり、以下を表示
  return (
    <React.Fragment>
      {isEditing ? (
        <TitleForm
          method={'POST'}
          card={card} // 値のあるデータならtrue
          list={list} // 値のあるデータならtrue
          board={board} // 値のあるデータならtrue
          id={id}
          currentValue={''}
          toggleForm={toggleForm}
          handleClickAway={handleClickAway}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
        />
      ) : (
        <Button
          className={!card ? classes.button : undefined}
          startIcon={<AddIcon />}
          size='small'
          onClick={toggleForm}
        >
          Add new {card ? 'card' : list ? 'list' : 'board'}
        </Button>
      )}
    </React.Fragment>
  );
};

export default AddTaskButton;
