import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../components/Types";

type State = {
  count: number;
  tasks: Task[];
};

const initialState: State = {
  count: 2,
  tasks: [
    {
      id: 2,
      title: "次のTodo",
      done: false,
    },
    {
      id: 1,
      title: "最初のTodo",
      done: true,
    },
  ],
};

// createSlice: Action(Creator), Reducer, State 一括定義可
// 以下のように参照する
//  taskModule.name // => "tasks"
//  taskModule.reducer // Redulcer (ref. src/rootReducer.ts)
//  taskModule.actions // ActionCreator
// Actions: Storeに送る唯一の情報源, 例: {type: "name/addTask", payload: XXX}
// Reducers: 前のState, Actionを引数に 次のStateを返す'純粋'関数
// State: intitialState: Stateの初期値設定
// Store: 全Stateの集合, 'dispatch(action)'によってStateの変更を行う
const tasksModule = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    // 必要な引数は(inputTitle: string)のみ -> <string>
    addTask: (state: State, action: PayloadAction<string>) => {
      state.count++; // id用のincrement
      const newTask: Task = {
        id: state.count,
        title: action.payload, // action.payload: 引数(inputTitle)取得
        done: false,
      };
      state.tasks = [newTask, ...state.tasks];
    },
    // 別の記述法
    doneTask(state: State, action: PayloadAction<Task>) {
      // action.payload: 引数(Task)取得
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.done = !task.done;
      }
    },
    deleteTask(state: State, action: PayloadAction<Task>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
    },
  },
});

// 他コンポーネントからaddTask()で実行可に cf.tasksModule.actions.addTask()
export const { addTask, doneTask, deleteTask } = tasksModule.actions;

export default tasksModule;
