import React, { useContext, useState } from 'react';

import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { RootState } from '../store/rootReducer';
import { ThemeContext } from './ThemeProvider';
import Header from './Header';
import Footer from './Footer';
import TemporaryMessage from './TemporaryMessage';
import Routes from './Routes';
import { authIsReady } from 'react-redux-firebase';
import store from '../store/store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const notification = useSelector(
    (state: RootState) => state.app.notification
  );
  const [ready, setReady] = useState(false);

  // 'createContext()'で生成した'ThemeContext'を呼び出す
  const context = useContext(ThemeContext);
  // // 保存されたテーマがあれば適用する(localStorageから読み込む)
  // useEffect(() => {
  //   const theme = localStorage.getItem('theme');
  //   if (theme) {
  //     context.toggleTheme(theme);
  //   }
  // });

  // ユーザー情報を取得するまで待機する ref. http://react-redux-firebase.com/docs/api/constants.html#defaultconfig
  authIsReady(store, 'firebase').then(() => setReady(true));
  if (!ready)
    return (
      <Backdrop className={classes.backdrop} open={!!!ready}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );

  return (
    // 'material-ui'の配色カスタマイズ ('ThemeContext.theme'をセット)
    <Router>
      <ThemeProvider theme={context.theme}>
        <DndProvider backend={HTML5Backend}>
          <CssBaseline />
          <Header />
          <Container component='main' maxWidth={false} disableGutters>
            {notification && (
              <TemporaryMessage
                type={notification.type}
                message={notification.message}
              />
            )}
            <Routes />
          </Container>
          <Footer />
        </DndProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
