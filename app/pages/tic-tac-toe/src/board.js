import React from "react";

function Square(props) {
    const visual = props.value
        ? `square animate__animated animate__flipInX animate__faster ${props.glow}`
        : "square";
    return (
        <button className={visual} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default class Board extends React.Component {
    renderSquare(i) {
        const squareVal = this.props.squares[i];
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
                onClick={() => this.props.onClick(i)}
            />
        );
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
