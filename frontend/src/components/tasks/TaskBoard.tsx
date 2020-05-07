import React from 'react';

import { Link, useParams } from 'react-router-dom';
import { Grid, Box } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';

import { ITaskBoard, ITaskList, ITaskCard } from '../Types';

// 表示確認用データ
const taskBoards: ITaskBoard = {
  'board-1': {
    id: 'board-1',
    title: 'b',
    taskLists: ['list-1', 'list-3', 'list-4'],
  },
};

const taskLists: ITaskList = {
  'list-1': {
    taskBoard: 'board-1',
    id: 'list-1',
    title: 'list-title1',
    taskCards: ['card-1', 'card-2', 'card-4'],
  },
  'list-3': {
    taskBoard: 'board-1',
    id: 'list-3',
    title: 'list-title3',
    taskCards: [],
  },
  'list-4': {
    taskBoard: 'board-1',
    id: 'list-4',
    title: 'list-title4',
    taskCards: ['card-3'],
  },
};

const taskCards: ITaskCard = {
  'card-1': {
    taskList: 'list-1',
    id: 'card-1',
    title: 'Card-title-1',
    done: false,
    body: 'Card-body-1',
  },
  'card-2': {
    taskList: 'list-1',
    id: 'card-2',
    title: 'Card-title-2',
    done: true,
    body: 'Card-body-2',
  },
  'card-3': {
    taskList: 'list-4',
    id: 'card-3',
    title: 'Card-title-3',
    done: false,
    body: 'Card-body-3',
  },
  'card-4': {
    taskList: 'list-1',
    id: 'card-4',
    title: 'Card-title-4',
    done: true,
    body: 'Card-body-4',
  },
};

interface Props {
  // 任意のprops
  list?: {
    taskBoard: string;
    id: string;
    title: string;
    taskCards: string[];
  };
}

const AddTaskButton: React.FC<Props> = ({ list }) => {
  const buttonText = list ? 'Add another list' : 'Add another card';

  return (
    <Box component='div' pt={1}>
      <Button startIcon={<AddIcon />} size='small'>
        {buttonText}
      </Button>
    </Box>
  );
};

const useStyles = makeStyles({
  root: {
    margin: '5px 0',
  },
});

const TaskBoard: React.FC = () => {
  const classes = useStyles();
  const { boardId } = useParams(); // URLパラメータ取得
  const board = taskBoards[boardId]; // taskBoardsの(IDとしての)キーを指定
  if (!board) {
    // 存在しない boardId パラメータを受け取った場合
    return (
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        Board not fonud.&nbsp;
        <Link to='/'>HOME</Link>
      </Alert>
    );
  }
  return (
    <Grid container>
      {board.taskLists.map((listId) => {
        const list = taskLists[listId];
        return (
          <Grid item lg={2} md={3} sm={4} xs={6} key={list.id}>
            <Box m={1} borderRadius={5} p={1} bgcolor='secondary.main'>
              <Typography color='textPrimary' gutterBottom>
                {list.title}
              </Typography>
              {list.taskCards.map((cardId) => {
                const card = taskCards[cardId];
                return (
                  <Card className={classes.root} key={card.id}>
                    <CardContent>
                      <Typography color='textSecondary'>
                        {card.title}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
              <AddTaskButton list={list} />
            </Box>
          </Grid>
        );
      })}
      <Grid item lg={2} md={3} sm={4} xs={6}>
        <AddTaskButton />
      </Grid>
    </Grid>
  );
};

export default TaskBoard;
