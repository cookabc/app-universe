import React from "react";

interface SquareProps {
    value: string | null;
    glow: string | undefined;
    onClick: () => void;
}

const Square: React.FC<SquareProps> = (props) => {
    const visual = props.value
        ? `square animate__animated animate__flipInX animate__faster ${props.glow}`
        : "square";
    return (
        <button className={visual} onClick={props.onClick}>
            {props.value}
        </button>
    );
};

interface BoardProps {
    squares: (string | null)[];
    onClick: (i: number) => void;
}

const Board: React.FC<BoardProps> = (props) => {
    const renderSquare = (i: number) => {
        const squareVal = props.squares[i];
        let glowClass;
        if (squareVal === "X") {
            glowClass = "red";
        } else if (squareVal) {
            glowClass = "blue";
        }
        return (
            <Square
                glow={glowClass}
                value={squareVal}
                onClick={() => props.onClick(i)}
            />
        );
    };

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};

export default Board;
