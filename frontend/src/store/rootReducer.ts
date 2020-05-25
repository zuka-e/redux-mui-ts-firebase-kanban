import { combineReducers } from '@reduxjs/toolkit';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import usersModule from './usersModule';
import tasksSlice from './tasksSlice';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  // key(tasks) を利用し、state.tasks で取得
  tasks: tasksSlice.reducer,
  users: usersModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
