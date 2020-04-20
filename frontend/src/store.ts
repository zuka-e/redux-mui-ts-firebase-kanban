import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";


// reducer に rootReducer の登録
const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch

export default store
