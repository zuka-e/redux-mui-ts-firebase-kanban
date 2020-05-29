import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import CloseIcon from '@material-ui/icons/Close';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';

import DeleteButton from './DeleteButton';
import { Box } from '@material-ui/core';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

// メニューでできる操作を表したオブジェクト
const Item = {
  HOME: 'home',
  DELETE: 'delete',
} as const;

type Item = typeof Item[keyof typeof Item];

interface BoardMenuProps {
  boardId: string;
  handleClose: () => void;
}

const BoardMenu: React.FC<BoardMenuProps> = (props) => {
  const { boardId, handleClose } = props;
  const classes = useStyles();
  const [selectedItem, setSelectedItem] = useState<Item>(Item.HOME);

  // 操作中の(表示する)メニューを変更する
  const handleClick = (item: Item) => {
    setSelectedItem(item);
  };

  // 'BoardMenu'の最初の表示に戻る
  const handleBack = () => {
    setSelectedItem(Item.HOME);
  };

  return (
    <List
      component='nav'
      aria-labelledby='menu-header'
      subheader={
        <ListSubheader
          className={classes.header}
          component='div'
          id='menu-header'
        >
          {/* ボタンの切り替え(戻るボタン設置) */}
          {selectedItem === Item.HOME ? (
            <IconButton size='small' disabled>
              <MenuOpenIcon />
            </IconButton>
          ) : (
            <IconButton size='small' onClick={handleBack}>
              <KeyboardArrowLeftIcon />
            </IconButton>
          )}
          Board Menu
          <IconButton size='small' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </ListSubheader>
      }
    >
      <Divider />
      {selectedItem === Item.DELETE ? (
        <Box mx={1}>
          <DeleteButton
            message='All cards and lists in the board will also be deleted'
            board
            id={boardId}
          />
        </Box>
      ) : (
        <List disablePadding dense>
          <ListItem button onClick={() => handleClick(Item.DELETE)}>
            <ListItemText primary='Delete the board' />
          </ListItem>
        </List>
      )}
    </List>
  );
};

export default BoardMenu;
