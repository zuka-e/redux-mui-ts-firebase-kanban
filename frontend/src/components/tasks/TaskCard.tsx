import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { ITaskCard } from '../Types';

const useStyles = makeStyles({
  root: {
    margin: '5px 0',
  },
});

const TaskCard: React.FC<ITaskCard> = ({ card }: ITaskCard) => {
  const classes = useStyles();
  return (
    <Card className={classes.root} key={card.id}>
      <CardContent>
        <Typography color='textSecondary'>{card.title}</Typography>
      </CardContent>
    </Card>
  );
};
export default TaskCard;
