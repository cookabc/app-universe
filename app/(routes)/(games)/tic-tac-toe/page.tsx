'use client';

import React, {useState} from "react";
import * as tf from "@tensorflow/tfjs";
import "@/app/styles/ttt.css";
import {getModel, getMoves, trainOnGames} from "@/app/utils/ttt/train";
import Board from "@/app/components/ttt/board";

interface GameState {
    games: { x: number[][], y: number[][] }[];
    history: Array<{ squares: (string | null)[] }>;
    stepNumber: number;
    xIsNext: boolean;
    activeModel: tf.Sequential;
}

export default function GameComponent() {
    const [state, setState] = useState<GameState>({
        games: [],
        history: [{squares: Array(9).fill(null)}],
        stepNumber: 0,
        xIsNext: true,
        activeModel: getModel(),
    });

    const handleClick = (i: number) => {
        const history = state.history.slice(0, state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = state.xIsNext ? "X" : "O";
        setState({
            ...state,
            history: history.concat([
                {
                    squares: squares,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !state.xIsNext,
        });
    };

    const makeAIMove = async () => {
        const history = state.history.slice(0, state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        const AIReady = squares.map((v) => {
            if (v === "X") {
                return state.xIsNext ? 1 : -1;
            } else if (v === "O") {
                return state.xIsNext ? -1 : 1;
            } else {
                return 0;
            }
        });

        let {move, moves} = await doPredict(AIReady, state.activeModel);

        while (squares[move] !== null && squares.includes(null)) {
            console.log(`AI Failed - Spot ${move} - Resorting to next highest`);
            moves[move] = 0;
            move = moves.indexOf(Math.max(...moves));
        }

        handleClick(move);
    };

    const jumpTo = (step: number) => {
        const progress =
            step === 0 ? [{squares: Array(9).fill(null)}] : state.history;
        setState({
            ...state,
            stepNumber: step,
            xIsNext: step % 2 === 0,
            history: progress,
        });
    };

    const [learning, setLearning] = useState(false);
    const trainUp = async (playerLearn: string | null) => {
        if (winner === null) {
            return;
        }
        playerLearn = playerLearn || "O";
        console.log("Train Called - to be more like ", playerLearn);

        const AllMoves = state.history.map((board) => {
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

        const games = state.games;
        games.push(getMoves(AllMoves));
        setState({
            ...state,
            games: games,
        });

        setLearning(true);
        await trainOnGames(state.games, (newModel) => {
            setState({
                ...state,
                activeModel: newModel,
                stepNumber: 0,
                xIsNext: true,
                history: [{squares: Array(9).fill(null)}],
            });
            setLearning(false);
        });
    };

    const history = state.history;
    const current = history[state.stepNumber];
    const {winner, line} = calculateWinner(current.squares);

    const moves = history.map((_, move) => {
        const desc = move ? `${move}步` : null;
        return (desc && (
            <a key={move} onClick={() => jumpTo(move)} className="btn effect01">
                <span>{desc}</span>
            </a>
        ));
    });

    const status = winner ? "获胜者：" + winner : "获胜者：" + "无";

    return (<div className="mt-[64px] flex">
        <div className="game-info">
            <h3 className="m-0 mb-4 text-center">
                AI已从<strong>{state.games.length}</strong>场比赛中吸取经验教训
            </h3>
            <div className="my-1">
                {(<a
                    onClick={() => jumpTo(0)}
                    className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx"
                >
                    <span>清空棋盘</span>
                </a>)}
            </div>
            <div className="my-1">
                {!winner && (<a
                    onClick={makeAIMove}
                    className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx"
                >
                    <span>让AI走</span>
                </a>)}
            </div>
            <ol className="list-none list-container">{moves}</ol>
            <div className="my-1">
                {(<span className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx">
                    {status}
                </span>)}
            </div>
            <div className="my-1">
                {(<a
                    onClick={() => trainUp("X")}
                    className="block mx-auto btn effect01 animate__animated animate__fadeIn bigx"
                >
                    <span>让AI学习 X 的步骤</span>
                </a>)}
            </div>
            <div className="my-1">
                {(<a
                    onClick={() => trainUp("O")}
                    className="block mx-auto btn effect01 animate__animated animate__fadeIn bigo"
                >
                    <span>让AI学习 O 的步骤</span>
                </a>)}
            </div>
        </div>
        <div className="site mt-10">
            {learning && <div className="modal">
                <div className="modal__content">
                    <h1 className="text-white">
                        训练中
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </h1>
                </div>
            </div>}
            <div className="game">
                <div className="game-board">
                    {winnerBar(line)}
                    <Board squares={current.squares} onClick={(i) => handleClick(i)}/>
                </div>
            </div>
        </div>
    </div>);
};

const calculateWinner = (squares: (string | null)[]) => {
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
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return {winner: squares[a], line: i};
        }
    }
    return {winner: null, line: null};
};

const doPredict = async (myBoard: number[], ttt_model: tf.Sequential) => {
    const tenseBlock = tf.tensor([myBoard]);
    const result = ttt_model.predict(tenseBlock) as tf.Tensor;

    const flatly = result.flatten();
    const maxy = flatly.argMax();
    const moves = await maxy.data();
    const allMoves = await flatly.data();

    flatly.dispose();
    tenseBlock.dispose();
    result.dispose();
    maxy.dispose();

    return {'move': moves[0], 'moves': allMoves};
};

const winnerBar = (line: number | null) => {
    if (line === null) return;
    const pad = 20;
    const cellSize = 100;
    const lines = [
        {
            // top across
            x1: pad,
            y1: cellSize,
            x2: 600 - pad,
            y2: cellSize,
        },
        {
            // mid across
            x1: pad,
            y1: cellSize * 3,
            x2: 600 - pad,
            y2: cellSize * 3,
        },
        {
            // bottom across
            x1: pad,
            y1: cellSize * 5,
            x2: 600 - pad,
            y2: cellSize * 5,
        },
        {
            // left down
            x1: cellSize,
            y1: 0 + pad,
            x2: cellSize,
            y2: 600 - pad,
        },
        {
            // middle down
            x1: cellSize * 3,
            y1: 0 + pad,
            x2: cellSize * 3,
            y2: 600 - pad,
        },
        {
            // right down
            x1: cellSize * 5,
            y1: 0 + pad,
            x2: cellSize * 5,
            y2: 600 - pad,
        },
        {
            // top left to bottom right
            x1: 0 + pad,
            y1: 0 + pad,
            x2: 600 - pad,
            y2: 600 - pad,
        },
        {
            // bottom left to top right
            x1: 0 + pad,
            y1: 600 - pad,
            x2: 600 - pad,
            y2: 0 + pad,
        },
    ];
    return (<svg className="winLine animate_animated animate__bounceIn animate__slower" width="600" height="600">
        <line {...lines[line]} strokeLinecap="round" stroke="#fffd" strokeWidth="5"></line>
    </svg>);
};
