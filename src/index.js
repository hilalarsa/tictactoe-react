import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


  function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}    
         </button>
      );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
        return <Square 
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
        />;    
    }
  
    render() {
      return (
        <div>
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
      constructor(props){
          super(props)
          this.state = {
              history:[{
                  squares: Array(9).fill(null),
              }],
              xIsNext: true,
              stepNumber:0,
              position:0
          }
      }

      jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }
      

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]; //current state of tictactoe on board
        const squares = current.squares.slice(); //take 1 array from history, check it if one of X or O is winning
        if (calculateWinner(squares) || squares[i]) { //check if x or O is winning OR you changing the square with already filled value, if either is true, the square value, the step, and the history is neither got updated
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            position:i
        });
    }

    render() {
        const history = this.state.history;
        console.log(history)
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const position = this.state.position
        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
        });
        const coordinate = history.map((step, move) => {
            let col = position%3+1;
            let row = Number.parseFloat(position/3+1).toFixed(0)
            return (
              <li key={move}>
                  Col:{col}, Row:{row}
              </li>
            );
        });

        let status;
        if (winner) {
        status = 'Winner: ' + winner;
        } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i)=>{this.handleClick(i)}}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            <div className="game-info">
                <div>{coordinate}</div>
            </div>
            </div>
        );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
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
    return null;
  }