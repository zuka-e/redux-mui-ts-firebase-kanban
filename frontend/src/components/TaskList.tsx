import React from "react";
// import TaskItem from './TaskItem'
import { Task, User } from "./Types";
import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Button,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";
import { RootState } from "../rootReducer";
import { doneTask, deleteTask } from "../modules/tasksModule";
import { fetchUsers } from "../modules/usersModule";

// interface User {
//   name: string;
//   email?: string; // '?' => 任意の属性に
// }

// const initialUser: User = {
//   name: "", // 'email'は任意となる
// };

// propsは不要になる
const TaskList: React.FC = () => {
  // (Storeの)stateを引数に, stateの値(ここではtasks)を取得(ReduxHooks記法)
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch(); // dispatch(action): State変更の唯一法
  // const [user, setUser] = useState<User>(iniUser);

  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  // const handleClick = () => {
  //   axios
  //     .get("http://localhost:8080/api/cards")
  //     .then((res) => res.data[0]) // response内容は,console.log()で確認可
  //     .then((res) => setUser({
  //       name: res.todo_list.user.name,
  //       email: res.todo_list.user.email
  //     }))
  //     .catch((err) => alert(err));
  // };

  return (
    <React.Fragment>
      <List component="ul">
        {tasks.map((task: Task) => (
          <ListItem key={task.id} component="li">
            <Checkbox
              checked={task.done}
              value="primary"
              // Store(State)を変更する
              onChange={() => dispatch(doneTask(task))}
            />
            <ListItemText onClick={() => dispatch(fetchUsers())}>
              {task.title}
              {/* {task.done ? ",OK" : ",NG"}, {user.name}, {user.email} */}
            </ListItemText>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => dispatch(deleteTask(task))}
            >
              削除
            </Button>
          </ListItem>
        ))}
      </List>
      {console.log(loading ? "読込中" : "待機中")}
      {console.log(error ? error : "エラーなし")}
      <List component="ul">
        {users?.map((user: User) => (
          <ListItem key={user.id} component="li">
            <ListItemText>
              {user.name}
              <br />
              {user.email}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
};

// type Props = {
//   tasks: Array<Task> //Task型 オブジェクト(連想配列) cf. Type.ts
//   setTasks: React.Dispatch<React.SetStateAction<Task[]>>
// }

// const TaskList: React.FC<Props> = ({ tasks, setTasks }) => {

//   // map: 配列要素それぞれに処理を行う, filter: 配列の要素の内、条件合致するものを返す
//   // ここでは配列はtasks(Task[],Array<Task>), 要素はtask(引数のtaskはeventvalue)

//   // onClickは子のTaskItemで行い、これを呼ぶ(引数はeventvalueのtask)
//   const handleDone = (task: Task) => {
//     setTasks(prev => prev.map(t =>
//       t.id === task.id
//         ? { ...task, done: !task.done } // taskの分解->{id: 1, title:~ } doneのみ変更
//         : t // eventvalue(引数のtask)以外はそのまま
//     ))
//   }

//   // 引数のtaskを除いたtasks(trueになったもの)を返す
//   const handleDelete = (task: Task) => {
//     setTasks(prev => prev.filter(t =>
//       t.id !== task.id // eventvalueならfalse
//     ))
//   }

//   return (
//     <List component='ul'>
//       {
//         tasks.map((task: Task) => (
//           <ListItem key={task.id} component='li'>
//             <Checkbox checked={task.done} value='primary' onChange={() => handleDone(task)} />
//             <ListItemText>{task.title}{task.done ? ",OK" : ",NG"}</ListItemText>
//             <Button
//               variant='contained'
//               color='secondary'
//               onClick={() => handleDelete(task)}
//             >削除
//             </Button>
//           </ListItem>
//         ))
//       }
//     </List>
//   )
// }

export default TaskList;
