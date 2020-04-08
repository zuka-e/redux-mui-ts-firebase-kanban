import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { cleanup } from "@testing-library/react";

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
  onClick: (i: number) => void;
}

interface BoardState {
  squares: Array<string>;
  xIsNext: Boolean;
}
class Board extends React.Component<BoardProps, BoardState> {
  // constructor(props: BoardProps) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null), // 9マスnullを初期値に
  //     xIsNext: true // ターンを決める, 初期値は'X'
  //   };
  // }

  renderSquare(i: number) {
    // Square(子)にpropsを渡す
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // // 毎ターン決着判定
    // const winner = calculateWinner(this.state.squares);
    // let status: string;
    // if (winner) {
    //   status = "Winner: " + winner;
    // } else {
    //   status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    // } -> Gameに移行

    return (
      <div>
        {/* <div className="status">{status}</div> */}
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

interface GameProps {}
interface GameState {
  history: Array<{ [key: string]: Array<string> }>;
  // squares: Array<string>;
  stepNumber: number; // 何ターン目か
  xIsNext: boolean;
}
class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array<string>(9).fill(""),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // Boardから移行
  handleClick(i: number) {
    // jampToで変更されたstepNumberを反映した履歴
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // 最新の配列のコピーを作成
    // 決着済みの場合及び取得済みのマスは変更不可
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    // immutability: 直接書き換えでなく,新データに置き換える(差分確認が用が容易)
    this.setState({
      // 履歴に連結させる
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length, // 内包する配列(squares)の数
      xIsNext: !this.state.xIsNext, // ターン切り替え
    });
  }

  // ターンを移動する
  jumpTo(step: number) {
    this.setState({
      stepNumber: step, // 履歴の番号を設定して、
      xIsNext: step % 2 === 0, // ターンを対応させる
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // Boardから移行
    const winner: string = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status: string;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next Player" + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          {/* constructorに渡す */}
          <Board
            squares={current.squares}
            onClick={(i: number) => this.handleClick(i)}
            xIsNext={true}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return "";
}
