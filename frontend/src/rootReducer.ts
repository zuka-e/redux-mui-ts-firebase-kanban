import { combineReducers } from "@reduxjs/toolkit";
import tasksModule from "./modules/tasksModule";
import usersModule from "./modules/usersModule";

const rootReducer = combineReducers({
  // key(tasks) を利用し、state.tasks で取得
  tasks: tasksModule.reducer,
  users: usersModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
