import React, { Dispatch, useReducer, useEffect } from 'react';

import produce from 'immer';
import { useSelector } from 'react-redux';

import { TaskListsArray } from '../models/Task';
import { RootState } from '../store/rootReducer';

// State
interface DragState {
  isSorting: boolean;
  listsArray: TaskListsArray;
}

// Action
export const INIT = 'INIT';
export const DRAG_START = 'DRAG_START';
export const DRAG_END = 'DRAG_END';
export const DRAG_CANCEL = 'DRAG_CANCEL';
export const MOVE_CARD = 'MOVE_CARD';

interface InitAction {
  type: typeof INIT;
  payload: TaskListsArray;
}
interface DragStartAction {
  type: typeof DRAG_START;
}
interface DragEndAction {
  type: typeof DRAG_END;
}
interface DragCancelAction {
  type: typeof DRAG_CANCEL;
  payload: { initialListsArray: TaskListsArray };
}
interface MoveCardAction {
  type: typeof MOVE_CARD;
  payload: {
    dragListIndex: number;
    hoverListIndex: number;
    dragIndex: number;
    hoverIndex: number;
    boardId: string;
  };
}
type DragActionTypes =
  | InitAction
  | DragStartAction
  | DragEndAction
  | DragCancelAction
  | MoveCardAction;

// Reducer
const init = (state: DragState): DragState => {
  return { ...state, listsArray: state.listsArray };
};
const reducer = (state: DragState, action: DragActionTypes): DragState => {
  switch (action.type) {
    case INIT:
      return init({ ...state, listsArray: action.payload });
    case DRAG_START:
      return { ...state, isSorting: true };
    case DRAG_END:
      return { ...state, isSorting: false };
    case DRAG_CANCEL:
      return {
        ...state,
        isSorting: false,
        listsArray: action.payload.initialListsArray,
      };
    case MOVE_CARD:
      return produce(state, (draft) => {
        const {
          dragListIndex,
          hoverListIndex,
          dragIndex,
          hoverIndex,
          boardId,
        } = action.payload;
        const sortedLists = draft.listsArray.filter(
          (list) => list.taskBoardId === boardId
        );
        const dragged = sortedLists[dragListIndex].cards[dragIndex];
        sortedLists[dragListIndex].cards.splice(dragIndex, 1);

        sortedLists[hoverListIndex].cards.splice(hoverIndex, 0, dragged);
        sortedLists[hoverListIndex].cards.map(
          (card) => (card.taskListId = sortedLists[hoverListIndex].id)
        );
      });
    default:
      return state;
  }
};

// 下位コンポーネントに渡す値
interface DragContextProps {
  state: DragState;
  dragDispatch: Dispatch<DragActionTypes>;
}

export const DragContext = React.createContext<DragContextProps>(
  {} as DragContextProps
);

const DragStateProvider: React.FC = (props) => {
  const initialListsArray = useSelector(
    (state: RootState) => state.firestore.ordered.lists as TaskListsArray
  );

  const initialState: DragState = {
    isSorting: false,
    listsArray: initialListsArray,
  };

  const [state, dragDispatch] = useReducer(reducer, initialState, init);

  // 都度DB側(ReduxThunk)の変更を反映
  useEffect(() => {
    dragDispatch({ type: 'INIT', payload: initialListsArray });
  }, [initialListsArray]);

  return (
    <DragContext.Provider value={{ state, dragDispatch }}>
      {props.children}
    </DragContext.Provider>
  );
};

export default DragStateProvider;
