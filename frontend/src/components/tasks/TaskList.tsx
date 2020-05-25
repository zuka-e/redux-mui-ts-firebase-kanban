import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { RootState } from '../../store/rootReducer';
import { ITaskCard, ITaskList } from '../Types';
import TaskCard from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import SelectFilter from './SelectFilter';
import TitleForm from './TitleForm';
import ListMenuButton from './ListMenuButton';

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
  const cards = useSelector(
    (state: RootState) => state.firestore.ordered.cards as ITaskCard['id'][]
  );

  // 表示するデータを変更するロジック('filterQuery'の変更は別で行う)
  const filteredCards = cards.filter((card) => {
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
  if (!isLoaded(cards)) {
    return <LinearProgress variant='query' color='secondary' />;
  }
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
          <ListMenuButton listId={list.id} />
        </Box>
      )}

      <SelectFilter filterQuery={filterQuery} handleChange={handleChange} />
      {filteredCards.map(
        (card) =>
          card.taskListId === list.id && (
            <Box
              bgcolor='background.paper'
              borderRadius={4}
              mb={1}
              key={card.id}
            >
              <Paper className={`${classes.root} ${classes.card}`}>
                <TaskCard card={card} />
              </Paper>
            </Box>
          )
      )}
      ))}
      <AddTaskButton list={list} />
    </React.Fragment>
  );
};
export default TaskList;
