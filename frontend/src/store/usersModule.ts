import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { AppThunk, AppDispatch } from './store';
import { User } from '../components/Types';

interface UserState {
  users: User[] | undefined; // 'User'の属性は取得先に従う
  loading: boolean; // API読込状態
  error: string | null; // API成否
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// 非同期APIコール時のロード状態とエラー有無を保持するため、3つの'Action'が必要
// 下部のfetchUsers関数(Thunk)によって'dispatch'される
const usersModule = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersStart(state: UserState) {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess(state: UserState, action: PayloadAction<User[]>) {
      const users = action.payload; // 複数の'User'情報を受け取る
      state.users = users; // 'User'State を更新する
      state.loading = false;
      state.error = null;
    },
    getUsersFailure(state: UserState, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload; // fetchUsers()のtry文でcatchする
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
} = usersModule.actions;
export default usersModule;

// 実際にAPIアクセスする処理, await: 処理完了まで次の処理を待機
const getUsers = async () => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users');
  return res.data;
};

// Thunk: 'Action'の代わりに、dispatchを引数に取る(無名)関数を返す
export const fetchUsers = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(getUsersStart());
    const users: User[] = await getUsers(); // API(GET)結果を代入
    dispatch(getUsersSuccess(users));
  } catch (err) {
    dispatch(getUsersFailure(err));
  }
};
