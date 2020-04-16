import React, { useState } from 'react'
import { Task } from './Types'

type Props = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  tasks: Task[] // Task型 cf.Types.ts
}

// { setTasks, tasks }: 関数内でそのまま使える cf.props.Tasks
const TaskInput: React.FC<Props> = ({ setTasks, tasks }) => {
  // useState: 最上位でのみ定義する, <T>: 初期値設定(型推定)で不十分なら
  const [inputTitle, setInputTitle] = useState<string>('')
  const [count, setCount] = useState<number>(tasks.length + 1)

  // onChange: state('title')を同期, submitに備える
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value)
  }

  // onSubmit: count を id にして, title は state から取得, tasks(props)に追加
  const handleSubmit = () => {
    setCount(count + 1) // 新規タスクid 設定用

    const newTask: Task = {
      id: count, // 直前にインクリメントした値(count)をidに
      title: inputTitle, // onChangeで常に変化していたtitleの最終値(onSubmit)
      done: false, // 当然todoは未完
    }

    setTasks([newTask, ...tasks]) // cf.concat(スプレッド演算子)タスク(前に)追加
    setInputTitle('') // titleは次に追加するときにも使うので初期化

  }

  return ( // 以下HTML, 子はない, form
    <div>
      <div className="inputForm">
        <div className="inner">
          <input
            type="text"
            className="input"
            value={inputTitle} // 初期値''で可変, 下記onChange
            onChange={handleInputChange} // value変化させる
          />
          <input type="submit" onClick={handleSubmit} className="btn is-primary" value="追加" />
        </div>
      </div>
    </div>
  )
}

export default TaskInput
