import React from "react"
import ReactDOM from "react-dom"
import * as tf from "@tensorflow/tfjs"
import Board from './board'
import {getModel, getMoves, trainOnGames} from "./train"

// TODO: Dis so nasty
const doPredict = async (myBoard, ttt_model) => {
    const tenseBlock = tf.tensor([myBoard]);
    const result = await ttt_model.predict(tenseBlock);

    const flatty = result.flatten();
    const maxy = flatty.argMax();
    const move = await maxy.data();
    const allMoves = await flatty.data();

    flatty.dispose();
    tenseBlock.dispose();
    result.dispose();
    maxy.dispose();
    return [move[0], allMoves];
};

const winnerBar = (line) => {
    if (line === null) return;
    const pad = 20;
    const cellSize = 100;
    const lines = [
        {
            // top across
            x1: pad,
            y1: cellSize,
            x2: 600 - pad,
            y2: cellSize
        },
        {
            // mid across
            x1: pad,
            y1: cellSize * 3,
            x2: 600 - pad,
            y2: cellSize * 3
        },
        {
            // bottom across
            x1: pad,
            y1: cellSize * 5,
            x2: 600 - pad,
            y2: cellSize * 5
        },
        {
            // left down
            x1: cellSize,
            y1: 0 + pad,
            x2: cellSize,
            y2: 600 - pad
        },
        {
            // middle down
            x1: cellSize * 3,
            y1: 0 + pad,
            x2: cellSize * 3,
            y2: 600 - pad
        },
        {
            // right down
            x1: cellSize * 5,
            y1: 0 + pad,
            x2: cellSize * 5,
            y2: 600 - pad
        },
        {
            // top left to bottom right
            x1: 0 + pad,
            y1: 0 + pad,
            x2: 600 - pad,
            y2: 600 - pad
        },
        {
            // bottom left to top right
            x1: 0 + pad,
            y1: 600 - pad,
            x2: 600 - pad,
            y2: 0 + pad
        }
    ];
    return (
        <svg
            className="winLine animate_animated animate__bounceIn animate__slower"
            width="600"
            height="600"
        >
            <line
                {...lines[line]}
                strokeLinecap="round"
                stroke="#fffd"
                strokeWidth="5"
            ></line>
        </svg>
    );
};

class Game extends React.Component {
    componentWillUnmount() {
        this.state.activeModel && this.state.activeModel.dispose();
    }

    constructor(props) {
        super(props);
        this.state = {
            games: [],
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            activeModel: getModel(),
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    async makeAIMove() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        const AIready = squares.map((v) => {
            if (v === "X") {
                return this.state.xIsNext ? 1 : -1;
            } else if (v === "O") {
                return this.state.xIsNext ? -1 : 1;
            } else {
                return 0;
            }
        });
        // console.log(AIready);
        let [move, moves] = await doPredict(AIready, this.state.activeModel);
        // Check if AI made a valid move!
        while (squares[move] !== null && squares.includes(null)) {
            console.log(`AI Failed - Spot ${move} - Resorting to next highest`);
            // Make current move 0
            moves[move] = 0;
            move = moves.indexOf(Math.max(...moves));
            // move = Math.floor(Math.random() * 9);
        }

        this.handleClick(move);
    }

    jumpTo(step) {
        const progress =
            step === 0 ? [{squares: Array(9).fill(null)}] : this.state.history;
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
            history: progress,
        });
    }

    trainUp(playerLearn) {
        playerLearn = playerLearn || "O";
        console.log("Train Called - to be more like ", playerLearn);
        // console.log(this.state.history);
        const AllMoves = this.state.history.map((board) => {
            return board.squares.map((v) => {
                if (v === playerLearn) {
                    return 1;
                } else if (v === null) {
                    return 0;
                } else {
                    return -1;
                }
            });
        });

        this.setState(
            (prevState) => {
                const games = prevState.games;
                games.push(getMoves(AllMoves));
                return {games};
            },
            () => {
                trainOnGames(this.state.games, (newModel) => {
                    window.location.hash = "#";
                    this.setState({
                        activeModel: newModel,
                        stepNumber: 0,
                        xIsNext: true,
                        history: [
                            {
                                squares: Array(9).fill(null),
                            },
                        ],
                    });
                });
            }
        );
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const {winner, line} = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? `${move}步` : null;
            return (desc &&
                <a key={move} onClick={() => this.jumpTo(move)} className="btn effect01">
                    <span>{desc}</span>
                </a>
            );
        });

        const status = winner ? "获胜者：" + winner : "获胜者：" + "无";

        return (
            <>
                <div className="game-info">
                    <h3 className="m-0 mb-4">
                        AI已从<strong>{this.state.games.length}</strong>{" "}场比赛中吸取经验教训
                    </h3>
                    <div className="my-1">
                        {(
                            <a
                                onClick={() => this.jumpTo(0)}
                                className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx"
                            >
                                <span>清空棋盘</span>
                            </a>
                        )}
                    </div>
                    <div className="my-1">
                        {!winner && (
                            <a
                                onClick={() => this.makeAIMove()}
                                className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx"
                                target="_blank"
                            >
                                <span>让AI走</span>
                            </a>
                        )}
                    </div>
                    <ol className="list-none list-container">{moves}</ol>
                    <div className="my-1">
                        {(
                            <span className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx">
                                {status}
                            </span>
                        )}
                    </div>
                    <div className="my-1">
                        {(
                            <a
                                href="#training-modal"
                                onClick={() => this.trainUp("X")}
                                className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx"
                            >
                                <span>让AI学习 X 的游戏步骤</span>
                            </a>
                        )}
                    </div>
                    <div className="my-1">
                        {(
                            <a
                                href="#training-modal"
                                onClick={() => this.trainUp("O")}
                                className="block mx-auto btn effect01 animate__animated animate__fadeIn bigo"
                            >
                                <span>让AI学习 O 的游戏步骤</span>
                            </a>
                        )}
                    </div>
                </div>
                <div className="site mt-10">
                    <div id="training-modal" className="modal">
                        <div className="modal__content">
                            <h1 className="text-white">训练中
                                <div className="spinner">
                                    <div className="bounce1"></div>
                                    <div className="bounce2"></div>
                                    <div className="bounce3"></div>
                                </div>
                            </h1>
                        </div>
                    </div>
                    <div className="game">
                        <div className="game-board">
                            {winnerBar(line)}
                            <Board
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

// ========================================
ReactDOM.render(<Game/>, document.getElementById("root"));

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
            return {winner: squares[a], line: i};
        }
    }
    return {winner: null, line: null};
}
