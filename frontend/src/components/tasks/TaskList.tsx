import React, { useState } from 'react';

import { useDrop } from 'react-dnd';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { ItemTypes, DragItem } from '../../models/DragItem';
import { TaskLists } from '../../models/Task';
import { isOwnedBy } from '../../models/Auth';
import TaskCard from './TaskCard';
import AddTaskButton from './AddTaskButton';
import LabeledSelect from '../templates/LabeledSelect';
import TitleForm from './TitleForm';
import PopoverContent from '../templates/PopoverContent';
import ListMenu from './ListMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      cursor: 'pointer',
      fontSize: '1.2em',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      width: 'calc(100% - 30px)',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(0.5),
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,0.025)',
      },
    },
    menuButton: {
      position: 'absolute',
      top: '4px',
      right: 0,
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

export interface TaskListProps {
  list: TaskLists['id'];
  listIndex: number;
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    dragListIndex: number,
    hoverListIndex: number
  ) => void;
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const { list, listIndex, moveCard } = props;
  const classes = useStyles();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(list.title);
  const [filterQuery, setfilterQuery] = useState<TodoFilter>(TodoFilter.NONE);

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item: DragItem) {
      const dragListIndex = item.listIndex;
      const hoverListIndex = listIndex;
      const dragIndex = item.index;
      const hoverIndex = 0;
      if (dragListIndex === hoverListIndex) {
        return;
      }
      moveCard(dragListIndex, hoverListIndex, dragIndex, hoverIndex);
      item.index = hoverIndex;
      item.listIndex = hoverListIndex;
    },
  });

  // 表示するデータを変更するロジック('filterQuery'の変更は別で行う)
  const filteredCards = list.cards.filter((card) => {
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
    <div ref={drop}>
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
        <Box position='relative'>
          <Typography
            className={`${classes.header} ${classes.scrollbar}`}
            onClick={toggleTitleForm}
          >
            {list.title}
          </Typography>
          {isOwnedBy(list.userId) && (
            <PopoverContent
              trigger={
                <IconButton size='small' className={classes.menuButton}>
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
        {filteredCards.map((card, i) => (
          <Box
            bgcolor='background.paper'
            borderRadius={4}
            mb={1}
            key={card.id} // i だとmonitor機能しない(isDragging変化しない)
          >
            <TaskCard
              card={card}
              index={i}
              listIndex={listIndex}
              moveCard={moveCard}
            />
          </Box>
        ))}
      </Box>
      {isOwnedBy(list.userId) && <AddTaskButton card id={list.id} />}
    </div>
  );
};
export default TaskList;
