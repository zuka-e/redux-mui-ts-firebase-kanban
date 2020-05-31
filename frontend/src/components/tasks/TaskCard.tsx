import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';

import { ITaskCard } from '../../models/Task';
import OpenCardDetails from './OpenCardDetails';

const TaskCard: React.FC<ITaskCard> = ({ card }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <OpenCardDetails card={card} open={open} setOpen={setOpen}>
      <Typography color='textSecondary' onClick={handleClick}>
        {card.title}
      </Typography>
    </OpenCardDetails>
  );
};
export default TaskCard;
