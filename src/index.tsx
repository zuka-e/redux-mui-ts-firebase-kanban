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
// class Square extends React.Component<SquareProps, SquareState> {
//   constructor(props: SquareProps) {
//     super(props);
//     this.state = {
//       value: ""
//     };
//   }
//   render() {

// 関数コンポーネントに切り替え
function Square(props: SquareProps) {
  return (
    // 属性の'onClick'は任意の命名(慣習: on[Event]), setStateをBoardに移行
    <button className="square" onClick={props.onClick}>
      {/* cf. ()=>this.props.onClick() */}
      {props.value}
    </button>
  );
}
// }

// 使わない?
interface BoardProps {
  squares: Array<string>;
  xIsNext: boolean;
}

interface BoardState {
  squares: Array<string>;
  xIsNext: Boolean;
}
class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    this.state = {
      squares: Array(9).fill(null), // 9マスnullを初期値に
      xIsNext: true // ターンを決める, 初期値は'X'
    };
  }

  // handle[Event] 慣習名
  handleClick(i: number) {
    const squares = this.state.squares.slice(); // 配列のコピーを作成
    // 決着済みの場合及び取得済みのマスは変更不可
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    // immutability: 直接書き換えでなく,新データに置き換える(差分確認が用が容易)
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext // ターン切り替え
    });
  }
  renderSquare(i: number) {
    // Square(子)にpropsを渡す
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    // 毎ターン決着判定
    const winner = calculateWinner(this.state.squares);
    let status: string;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

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
          {/* constructorに渡す */}
          <Board squares={Array(9).fill("")} xIsNext={true} />
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

// ヘルパー関数?
function calculateWinner(squares: Array<string>): string {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return "";
}
