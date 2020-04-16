import React, { useState, useEffect } from 'react';

interface FormProps {
  id: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: React.FC<FormProps> = ({ id, onChange }) => {

  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("")

  const handlePlus = () => {
    setCount(count + 1)
  }

  const handleMinus = () => {
    setCount(count - 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value)
  }

  // DOM を更新した後で、HTML ドキュメントのタイトルを設定します。
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <form className="siimple-form">
      <div className="siimple-form-field">
        <p style={{ color: 'cyan' }} onChange={onChange}>{message}</p>
        <label className="siimple-label siimple--color-white">Your todo:</label>
        <input name="title" type="text" value={message}
          onChange={handleChange} className="siimple-input" />...{id}
        <input type="submit" value="Add" className="siimple-btn siimple-btn--teal" />
        <input type="buttun" value="+" className="siimple-btn siimple-btn--teal" onClick={handlePlus} readOnly />
        <input type="buttun" value="-" className="siimple-btn siimple-btn--teal" onClick={handleMinus} readOnly />
      </div>
    </form >
  );
}
export default Form;
