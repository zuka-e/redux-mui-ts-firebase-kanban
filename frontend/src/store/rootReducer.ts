import { combineReducers } from '@reduxjs/toolkit';

import usersModule from './usersModule';
import tasksSlice from './tasksSlice';

const rootReducer = combineReducers({
  // key(tasks) を利用し、state.tasks で取得
  tasks: tasksSlice.reducer,
  users: usersModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
