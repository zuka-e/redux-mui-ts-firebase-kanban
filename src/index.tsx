import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquareProps {
  // props定義にinterfaceが必要(Typescript,ts)
  value: string;
  onClick: () => void;
}
interface SquareState {
  // state定義にもinterfaceが必要
  value: string;
}
// tsではジェネリクスにする必要がある
class Square extends React.Component<SquareProps, SquareState> {
  constructor(props: SquareProps) {
    super(props);
    this.state = {
      value: ""
    };
  }
  render() {
    return (
      // 属性の'onClick'は任意の命名(慣習: on[Event]), setStateをBoardに移行
      <button className="square" onClick={() => this.props.onClick()}>
        {this.state.value}
      </button>
    );
  }
}

interface BoardProps {}

interface BoardState {
  squares: Array<string>;
}
class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    this.state = {
      squares: Array(9).fill(null) // 9マスnullを初期値に
    };
  }

  // handle[Event] 慣習名
  handleClick(i: number) {
    const squares = this.state.squares.slice(); // 配列のコピーを作成
    squares[i] = "X";
    // immutability: 直接書き換えでなく,新データに置き換える(差分確認が用が容易)
    this.setState({ squares: squares });
  }
  renderSquare(i: number) {
    // Square(子)にpropsを渡す
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    ); // 実際の値は下記 0~8
  }

  render() {
    const status = "Next player: X";

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
