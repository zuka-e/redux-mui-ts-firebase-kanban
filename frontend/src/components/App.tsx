import React, { useContext, useEffect } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@material-ui/core';

import Header from '../layouts/Header';
import { ThemeContext } from '../layouts/ThemeProvider';
import Content from '../layouts/Content';

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
    <Router>
      <ThemeProvider theme={context.theme}>
        <CssBaseline />
        <Header />
        <Container component='main'>
          <Content />
        </Container>
      </ThemeProvider>
    </Router>
  );
};

export default App;
