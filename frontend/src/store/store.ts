import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { createFirestoreInstance } from 'redux-firestore';

import firebase from '../config/firebase';
import rootReducer, { RootState } from './rootReducer';

// reducer に rootReducer の登録
// Thunk: 'Redux-Toolkit'ではデフォルトの'middleware' -> applyMiddleware()不要
const store = configureStore({
  reducer: rootReducer,
  // 'A non-serializable value was detected in the state'を無視
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

const rrfConfig = {
  // 要: Firestore の セキュリティルールに'users'コレクションを追加
  userProfile: 'users',
  useFirestoreForProfile: true,
};

export const rrfProps = {
  firebase: firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ThunkAction<戻り値, 'getState'のタイプ, 追加の引数, 許容Actionタイプ> を設定
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
