import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { RootState } from '../../store/rootReducer';
import { ITaskList } from '../Types';
import TaskCard from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import SelectFilter from './SelectFilter';
import TitleForm from './TitleForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,0.025)',
      },
    },
    header: {
      flex: 'auto',
      fontSize: '1.2em',
      fontWeight: 'bold',
      borderRadius: theme.spacing(0.5),
    },
    board: {
      backgroundColor: theme.palette.background.paper,
    },
    card: {
      '& > p': {
        padding: theme.spacing(1),
      },
    },
  })
);

// 'select'で表示する値の設定
export const TodoFilter = {
  NONE: 'All',
  TODO: 'Todo',
  DONE: 'Done',
} as const;

// TodoFilter.values の union型  "All" | "Todo" | "Done"
type TodoFilter = typeof TodoFilter[keyof typeof TodoFilter];

const TaskList: React.FC<ITaskList> = ({ list }) => {
  const classes = useStyles();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(list.title);
  const [filterQuery, setfilterQuery] = useState<TodoFilter>(TodoFilter.NONE);
  const { cards } = useSelector((state: RootState) => state.tasks);

  // 表示するデータを変更するロジック('filterQuery'の変更は別で行う)
  const filteredCardIds = list.taskCardIds.filter((cardId) => {
    const card = cards[cardId];
    if (filterQuery === TodoFilter.TODO) return !card.done;
    else if (filterQuery === TodoFilter.DONE) return card.done;
    else return true;
  });

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setfilterQuery(event.target.value as TodoFilter); // unknown型から変換
  };

  const toggleTitleForm = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  const handleClickAway = () => {
    setIsEditingTitle(false);
  };

  return (
    <React.Fragment>
      {isEditingTitle ? (
        <TitleForm
          toggleForm={toggleTitleForm}
          handleClickAway={handleClickAway}
          list={list}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
        />
      ) : (
        <Box
          className={classes.card}
          display='flex'
          justifyContent='space-between'
        >
          <Typography
            className={`${classes.root} ${classes.header}`}
            onClick={toggleTitleForm}
          >
            {list.title}
          </Typography>
        </Box>
      )}

      <SelectFilter filterQuery={filterQuery} handleChange={handleChange} />
      {filteredCardIds.map((cardId) => (
        <Box bgcolor='background.paper' mb={1} key={cardId}>
          <Paper className={`${classes.root} ${classes.card}`}>
            <TaskCard card={cards[cardId]} />
          </Paper>
        </Box>
      ))}
      <AddTaskButton list={list} />
    </React.Fragment>
  );
};
export default TaskList;