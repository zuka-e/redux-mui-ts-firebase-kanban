import { combineReducers } from '@reduxjs/toolkit';
import tasksModule from './tasksModule';
import usersModule from './usersModule';
import tasksSlice from './tasksSlice';

const rootReducer = combineReducers({
  // key(tasks) を利用し、state.tasks で取得
  tasks: tasksModule.reducer,
  users: usersModule.reducer,
  task: tasksSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
