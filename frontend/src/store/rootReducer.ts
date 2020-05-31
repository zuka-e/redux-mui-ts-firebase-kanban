import { combineReducers } from '@reduxjs/toolkit';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import appSlice from './appSlice';
import tasksSlice from './tasksSlice';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  app: appSlice.reducer,
  // key(tasks) を利用し、state.tasks で取得
  tasks: tasksSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
