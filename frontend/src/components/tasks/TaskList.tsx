import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { RootState } from '../../store/rootReducer';
import { ITaskCard, ITaskList } from '../../models/Task';
import { isSignedIn, isOwnedBy } from '../../models/Auth';
import TaskCard from './TaskCard';
import AddTaskButton from './AddTaskButton';
import LabeledSelect from '../templates/LabeledSelect';
import TitleForm from './TitleForm';
import PopoverContent from '../templates/PopoverContent';
import ListMenu from './ListMenu';

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
    scrollbar: {
      overflowX: 'hidden',
      overflowY: 'hidden',
      '&:hover': {
        overflowX: 'auto',
        overflowY: 'auto',
      },
      '&::-webkit-scrollbar': {
        width: '5px',
        height: '1px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#eee',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#ccc',
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
  const filterCards = () => {
    const filteredCards = cards.filter((card) => {
      if (filterQuery === TodoFilter.TODO) return !card.done;
      else if (filterQuery === TodoFilter.DONE) return card.done;
      else return true;
    });
    return filteredCards;
  };

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
      {isEditingTitle && isOwnedBy(list.userId) ? (
        <TitleForm
          method={'PATCH'}
          list
          id={list.id}
          currentValue={list.title}
          toggleForm={toggleTitleForm}
          handleClickAway={handleClickAway}
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
          {isOwnedBy(list.userId) && (
            <PopoverContent
              trigger={
                <IconButton size='small'>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListMenu listId={list.id} />
            </PopoverContent>
          )}
        </Box>
      )}

      <LabeledSelect
        label='Filter'
        options={TodoFilter}
        selectedValue={filterQuery}
        handleChange={handleChange}
      />
      <Box className={classes.scrollbar} maxHeight='250px'>
        {filterCards().map(
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
      </Box>
      {/* 'boards[list.boardId].userId'が'curretUser.uid'と異なっても'create'可 */}
      {/* つまり他のユーザーの'board'に'list'及び'card'が作成可能 */}
      {isSignedIn() && <AddTaskButton card id={list.id} />}
    </React.Fragment>
  );
};
export default TaskList;
