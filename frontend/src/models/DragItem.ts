export const ItemTypes = {
  CARD: 'card',
};

export interface DragItem {
  type: string;
  index: number;
  listIndex: number;
  id: string;
}
