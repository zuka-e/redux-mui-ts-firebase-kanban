import React from 'react'
import TaskItem from './TaskItem'
import { Task } from './Types'

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
    <div className="inner">
      {
        tasks.length <= 0 ? '登録されたTODOはありません。' :
          <ul className="task-list">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                handleDelete={handleDelete}
                handleDone={handleDone}
              />
            ))}
          </ul>
      }
    </div>
  )
}

export default TaskList
