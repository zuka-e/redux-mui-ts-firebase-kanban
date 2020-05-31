import React, { useContext } from 'react';

import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { RootState } from '../store/rootReducer';
import { ThemeContext } from '../layouts/ThemeProvider';
import Header from '../layouts/Header';
import TemporaryMessage from '../layouts/TemporaryMessage';
import Content from '../layouts/Content';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const message = useSelector((state: RootState) => state.app.message);

  // useEffect(() => {
  //   document.title = `Task Board`;
  // }, []);

  // 'createContext()'で生成した'ThemeContext'を呼び出す
  const context = useContext(ThemeContext);
  // // 保存されたテーマがあれば適用する(localStorageから読み込む)
  // useEffect(() => {
  //   const theme = localStorage.getItem('theme');
  //   if (theme) {
  //     context.toggleTheme(theme);
  //   }
  // });

  return (
    // 'material-ui'の配色カスタマイズ ('ThemeContext.theme'をセット)
    <Router>
      <ThemeProvider theme={context.theme}>
        <CssBaseline />
        <Header />
        <Container
          component='main'
          className={classes.root}
          maxWidth={false}
          disableGutters
        >
          {message && (
            <TemporaryMessage type={message.type} text={message.text} />
          )}
          <Content />
        </Container>
      </ThemeProvider>
    </Router>
  );
};

export default App;
