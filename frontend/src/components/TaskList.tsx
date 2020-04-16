import React from 'react'
import TaskItem from './TaskItem'
import { Task } from './Types'
import { List, ListItem, Checkbox, ListItemText, Button } from '@material-ui/core'

type Props = {
  tasks: Array<Task> //Task型 オブジェクト(連想配列) cf. Type.ts
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const TaskList: React.FC<Props> = ({ tasks, setTasks }) => {

  // map: 配列要素それぞれに処理を行う, filter: 配列の要素の内、条件合致するものを返す
  // ここでは配列はtasks(Task[],Array<Task>), 要素はtask(引数のtaskはeventvalue)

  // onClickは子のTaskItemで行い、これを呼ぶ(引数はeventvalueのtask)
  const handleDone = (task: Task) => {
    setTasks(prev => prev.map(t =>
      t.id === task.id
        ? { ...task, done: !task.done } // taskの分解->{id: 1, title:~ } doneのみ変更
        : t // eventvalue(引数のtask)以外はそのまま
    ))
  }

  // 引数のtaskを除いたtasks(trueになったもの)を返す
  const handleDelete = (task: Task) => {
    setTasks(prev => prev.filter(t =>
      t.id !== task.id // eventvalueならfalse
    ))
  }

  return (
    <List component='ul'>
      {
        tasks.map((task: Task) => (
          <ListItem key={task.id} component='li'>
            <Checkbox checked={task.done} value='primary' onChange={() => handleDone(task)} />
            <ListItemText>{task.title}{task.done ? ",OK" : ",NG"}</ListItemText>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => handleDelete(task)}
            >削除
            </Button>
          </ListItem>
        ))
      }
    </List>
  )
}

export default TaskList
