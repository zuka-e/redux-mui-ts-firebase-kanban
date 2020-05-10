import React, { useState } from 'react';

import { Card, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { ITaskCard } from '../Types';
import OpenCardDetails from './OpenCardDetails';

const TaskCard: React.FC<ITaskCard> = ({ card }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <OpenCardDetails card={card} open={open} setOpen={setOpen}>
        <CardContent onClick={() => setOpen(true)}>
          <Typography color='textSecondary'>{card.title}</Typography>
        </CardContent>
      </OpenCardDetails>
    </Card>
  );
};
export default TaskCard;
