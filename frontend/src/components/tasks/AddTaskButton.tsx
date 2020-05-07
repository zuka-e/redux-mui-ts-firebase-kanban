import React from 'react';

import { Box, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

interface Props {
  // 任意のprops
  list?: {
    taskBoard: string;
    id: string;
    title: string;
    taskCards: string[];
  };
}

export const AddTaskButton: React.FC<Props> = ({ list }: Props) => {
  const buttonText = list ? 'Add another list' : 'Add another card';
  return (
    <Box component='div' pt={1}>
      <Button startIcon={<AddIcon />} size='small'>
        {buttonText}
      </Button>
    </Box>
  );
};
