import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import * as serviceWorker from './serviceWorker';
import App from './layouts/App';
import store, { rrfProps } from './store/store';
import ThemeProvider from './layouts/ThemeProvider';
import './index.css';

ReactDOM.render(
  // store を全コンポーネントで利用する設定
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
