import React, { useContext, useEffect } from 'react';

import { Container, ThemeProvider } from '@material-ui/core';

import Header from '../layouts/Header';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import { ThemeContext } from '../layouts/ThemeProvider';

const App: React.FC = () => {
  // 'createContext()'で生成した'ThemeContext'を呼び出す
  const context = useContext(ThemeContext);
  // 保存されたテーマがあれば適用する(localStorageから読み込む)
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      context.toggleTheme(theme);
    }
  });

  return (
    // 'material-ui'の配色カスタマイズ ('ThemeContext.theme'をセット)
    <ThemeProvider theme={context.theme}>
      <Header />
      <Container component='main'>
        <TaskInput />
        <TaskList />
      </Container>
    </ThemeProvider>
  );
};

export default App;
