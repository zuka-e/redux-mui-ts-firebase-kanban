import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { ITaskCard } from '../Types';

const TaskCard: React.FC<ITaskCard> = ({ card }: ITaskCard) => {
  return (
    <Card>
      <CardContent>
        <Typography color='textSecondary'>{card.title}</Typography>
      </CardContent>
    </Card>
  );
};
export default TaskCard;
