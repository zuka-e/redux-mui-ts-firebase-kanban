import React from 'react';

import { useDragLayer, XYCoord } from 'react-dnd';
import { withStyles, Box, Grid } from '@material-ui/core';

import { ItemTypes } from '../../models/DragItem';
import TaskCard from './TaskCard';

const getItemStyles = (currentOffset: XYCoord | null): React.CSSProperties => {
  if (!currentOffset) {
    return { display: 'none' };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return { transform: transform, WebkitTransform: transform };
};

const CustomDragLayer: React.FC = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  const renderItem = () => {
    switch (itemType) {
      case ItemTypes.CARD:
        return (
          <Box mx={2}>
            <TaskCard
              card={item.data}
              index={item.index}
              listIndex={item.listIndex}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }
  return (
    <CustomDragLayerWrapper>
      <div style={getItemStyles(currentOffset)}>
        <Grid container>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <div style={{ transform: 'rotate(5deg)' }}>{renderItem()}</div>
          </Grid>
        </Grid>
      </div>
    </CustomDragLayerWrapper>
  );
};

export default CustomDragLayer;

const CustomDragLayerWrapper = withStyles({
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 100,
    height: '100%',
    width: '100%',
  },
})(Box);
