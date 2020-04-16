import React from "react";

let style = {
  maxWidth: '500px',
};

let btn = {
  cursor: 'pointer'
};

interface ItemListProps {
  items: Array<{
    id: number,
    title: string,
  }>
}

const ItemList: React.FC<ItemListProps> = (props: ItemListProps) => (
  <ul className="siimple-list">
    {props.items.map((item) => (
      <li className="siimple-list-item siimple--bg-white" style={style}> {item.id} - {item.title}<span className="siimple-tag siimple-tag--error siimple-hover" style={btn}>Delete</span></li>
    ))}
  </ul>
);

export default ItemList;
