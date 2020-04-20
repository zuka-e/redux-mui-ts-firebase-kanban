import { combineReducers } from "@reduxjs/toolkit";
import tasksModule from "./modules/tasksModule";

const rootReducer = combineReducers({
  // key(tasks) を利用し、state.tasks で取得
  tasks: tasksModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
