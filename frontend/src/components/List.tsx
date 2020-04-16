import React from "react";

let style = {
  maxWidth: '500px',
};

let btn = {
  cursor: 'pointer'
};

interface ListProps {
  items: Array<{
    id: number,
    title: string,
  }>
}

const List: React.FC<ListProps> = (props: ListProps) => (
  <ul className="siimple-list">
    {props.items.map((item) => (
      <li className="siimple-list-item siimple--bg-white" style={style}> {item.id} - {item.title}<span className="siimple-tag siimple-tag--error siimple-hover" style={btn}>Delete</span></li>
    ))}
  </ul>
);

export default List;
