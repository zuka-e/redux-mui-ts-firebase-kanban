import React, { useState, useRef, useEffect, useContext } from 'react';

import { useSelector } from 'react-redux';
import {
  useDrag,
  DragSourceMonitor,
  useDrop,
  DropTargetMonitor,
  XYCoord,
} from 'react-dnd';
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
    },
    card: {
      '& > p': {
        padding: theme.spacing(1),
      },
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

  const [{ isDragging }, drag, preview] = useDrag({
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

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    // drop領域にhoverしているときも常に入れ替え(moveCard)実行
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragListIndex = item.listIndex;
      const hoverListIndex = listIndex;
      const dragIndex = item.index;
      const hoverIndex = index;
      // TaskCard コンポーネントでドラッグ可能領域を設定している-> cardsが0だとdrop不可

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragListIndex === hoverListIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      // moveCard(dragListIndex, hoverListIndex, dragIndex, hoverIndex);
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
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.listIndex = hoverListIndex;
    },
  });
  drag(drop(ref));

  const handleClick = () => {
    setOpen(true);
  };

  const opacity = isDragging ? 0 : 1;
  return (
    <Paper
      className={`${classes.root} ${classes.card}`}
      ref={ref}
      style={{ opacity }}
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
