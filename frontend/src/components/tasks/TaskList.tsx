import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

import { RootState } from '../../store/rootReducer';
import { ITaskList } from '../Types';
import TaskCard from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import SelectFilter from './SelectFilter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer', // マウスポインターを指にする
      '&:hover': {
        borderRadius: '5px',
        border: `1px solid ${theme.palette.info.main}`,
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
  const [filterQuery, setfilterQuery] = useState<TodoFilter>(TodoFilter.NONE);
  const { cards } = useSelector((state: RootState) => state.task);

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

  return (
    <React.Fragment>
      <Typography color='textPrimary' gutterBottom>
        {list.title}
      </Typography>
      <SelectFilter filterQuery={filterQuery} handleChange={handleChange} />
      {/* 表示する'card'を絞込後のものにする */}
      {filteredCardIds.map((cardId) => (
        <Box className={classes.root} my={1} key={cardId}>
          <TaskCard card={cards[cardId]} />
        </Box>
      ))}
      <AddTaskButton list={list} />
    </React.Fragment>
  );
};
export default TaskList;
