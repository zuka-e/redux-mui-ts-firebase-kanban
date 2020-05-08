import React, { useState } from 'react';
// import { Task } from './Types'
import { Box, TextField, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../store/tasksModule';
import { RootState } from '../store/rootReducer';

const TaskInput: React.FC = () => {
  // ref. TaskList.tsx
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();
  // LocalState: Storeに組み込まない(コンポーネント内で完結)
  const [inputTitle, setInputTitle] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(addTask(inputTitle));
    setInputTitle('');
  };

  const isExistingTitle = () => {
    return tasks.some((task) => task.title === inputTitle);
  };

  return (
    <Box mt={5} display='flex' justifyContent='space-around'>
      <TextField
        placeholder="Input task's title"
        value={inputTitle} // 初期値''で可変, 下記onChange
        onChange={handleInputChange} // value変化させる
      />
      <Button
        disabled={inputTitle === '' || isExistingTitle()}
        variant='contained'
        color='primary'
        onClick={handleSubmit}
      >
        追加
      </Button>
    </Box>
  );
};

// type Props = {
//   setTasks: React.Dispatch<React.SetStateAction<Task[]>>
//   tasks: Task[] // Task型 cf.Types.ts
// }

// // { setTasks, tasks }: 関数内でそのまま使える cf.props.Tasks
// const TaskInput: React.FC<Props> = ({ setTasks, tasks }) => {
//   // useState: 最上位でのみ定義する, <T>: 初期値設定(型推定)で不十分なら
//   const [inputTitle, setInputTitle] = useState<string>('')
//   const [count, setCount] = useState<number>(tasks.length + 1)

//   // onChange: state('title')を同期, submitに備える
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputTitle(e.target.value)
//   }

//   // onSubmit: count を id にして, title は state から取得, tasks(props)に追加
//   const handleSubmit = () => {
//     setCount(count + 1) // 新規タスクid 設定用
//     const newTask: Task = {
//       id: count, // 直前にインクリメントした値(count)をidに
//       title: inputTitle, // onChangeで常に変化していたtitleの最終値(onSubmit)
//       done: false, // 当然todoは未完
//     }
//     setTasks([newTask, ...tasks]) // cf.concat(スプレッド演算子)タスク(前に)追加
//     setInputTitle('') // titleは次に追加するときにも使うので初期化
//   }

//   const isExistingTitle = () => {
//     return tasks.some(task => task.title === inputTitle)
//   }

//   return ( // 以下HTML, 子はない, form
//     <Box mt={5} display='flex' justifyContent='space-around'>
//       <TextField
//         placeholder="Input task's title"
//         value={inputTitle} // 初期値''で可変, 下記onChange
//         onChange={handleInputChange} // value変化させる
//       />
//       <Button
//         disabled={inputTitle === '' || isExistingTitle()}
//         variant='contained'
//         color='primary'
//         onClick={handleSubmit}
//       >追加</Button>
//     </Box>
//   )
// }

export default TaskInput;
