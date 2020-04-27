import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "./rootReducer";

// reducer に rootReducer の登録
// Thunk: 'Redux-Toolkit'ではデフォルトの'middleware' -> applyMiddleware()不要
const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

// ThunkAction<戻り値, 'getState'のタイプ, 追加の引数, 許容Actionタイプ> を設定
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
