import React, { useState, useRef, useEffect, useContext } from 'react';

import { useSelector } from 'react-redux';
import { useDrag, DragSourceMonitor, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import { ItemTypes, DragItem } from '../../models/DragItem';
import { TaskCards, TaskLists } from '../../models/Task';
import { RootState } from '../../store/rootReducer';
import { DragContext } from '../../context/DragContext';
import OpenCardDetails from './OpenCardDetails';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,0.025)',
      },
      '& > p': {
        padding: theme.spacing(1),
      },
    },
    dragAndHover: {
      opacity: 0.5,
      backgroundColor: 'rgb(0,0,0,0.5)',
    },
  })
);

export interface TaskCardProps {
  card: TaskCards['id'];
  index: number;
  listIndex: number;
}

const TaskCard: React.FC<TaskCardProps> = (props) => {
  const { card, index, listIndex } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { dragDispatch } = useContext(DragContext);
  const lists = useSelector(
    (state: RootState) => state.firestore.data.lists as TaskLists
  );
  const ref = useRef<HTMLDivElement>(null);

  const [, drag, preview] = useDrag({
    item: {
      type: ItemTypes.CARD,
      data: card,
      index: index,
      listIndex: listIndex,
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  useEffect(() => {
    // drag時の元のイメージをなくす、CustomDragLayerで設定
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    // drop領域にhoverしているときも常に入れ替え(moveCard)実行
    hover(item: DragItem) {
      if (!ref.current) return;

      const dragListIndex = item.listIndex;
      const hoverListIndex = listIndex;
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragListIndex === hoverListIndex) return;

      const listId = card.taskListId;
      const boardId = lists[listId].taskBoardId;
      dragDispatch({
        type: 'MOVE_CARD',
        payload: {
          dragListIndex,
          hoverListIndex,
          dragIndex,
          hoverIndex,
          boardId,
        },
      });
      // Mutations are good here to avoid index searches.
      item.index = hoverIndex;
      item.listIndex = hoverListIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  drag(drop(ref));

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <Paper
      ref={ref}
      className={`${classes.root} ${isOver && classes.dragAndHover}`}
    >
      <OpenCardDetails card={card} open={open} setOpen={setOpen}>
        <Typography color='textSecondary' onClick={handleClick}>
          {card.title}
        </Typography>
      </OpenCardDetails>
    </Paper>
  );
};
export default TaskCard;
