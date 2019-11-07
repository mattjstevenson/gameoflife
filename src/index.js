import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar } from 'react-bootstrap';

class Grid extends Component {
    render() {
        const width = (this.props.cols * 18);
        var rowsArr = [];

        var boxClass = "";
        for (var i = 0; i < this.props.rows; i++) {
            for (var j = 0; j < this.props.cols; j++) {
                let boxId = i + "_" + j;

                boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box
                        boxClass={boxClass}
                        key={boxId}
                        boxId={boxId}
                        row={i}
                        col={j}
                        selectBox={this.props.selectBox}
                    />
                );
            }
        }

        return (
            <div className="grid" style={{ width: width }}>
                {rowsArr}
            </div>
        );
    }
}

class Box extends Component {
    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col);
    }

    render() {
        return (
            <div
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox}
            />
        );
    }
}

class Buttons extends Component {
    render() {
        return (
            <div className="center">
                <ButtonToolbar className="btnToolbar">
                    <button className="btn btn-default" onClick={this.props.playButton}>
                        Play
                    </button>
                    <button className="btn btn-default" onClick={this.props.pauseButton}>
                        Pause
                    </button>
                    <button className="btn btn-default" onClick={this.props.clear}>
                        Clear
                    </button>
                    <button className="btn btn-default" onClick={this.props.slow}>
                        Slow
                    </button>
                    <button className="btn btn-default" onClick={this.props.fast}>
                        Fast
                    </button>
                    <button className="btn btn-default" onClick={this.props.seed}>
                        Seed
                    </button>
                </ButtonToolbar>
            </div>
        );
    }
}

class Main extends Component {
    constructor() {
        super();
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;

        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        }
    }

    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        });
    }

    seed = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (Math.floor(Math.random() * 4) === 1) {
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridFull: gridCopy
        });
    }

    playButton = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed, this.seed);
    }

    pauseButton = () => {
        clearInterval(this.intervalId);
    }

    slow = () => {
        this.speed = 250;
        this.playButton();
    }

    fast = () => {
        this.speed = 75;
        this.playButton();
    }

    clear = () => {
        var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.setState({
            gridFull: grid,
            generation: 0
        });
    }

    play = () => {
        let gridState = this.state.gridFull;
        let altGridState = arrayClone(this.state.gridFull);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let count = 0;

                if (i > 0) if (gridState[i - 1][j]) count++;
                if (i > 0 && j > 0) if (gridState[i - 1][j - 1]) count++;
                if (i > 0 && j < this.cols - 1) if (gridState[i - 1][j + 1]) count++;

                if (j < this.cols - 1) if (gridState[i][j + 1]) count++;
                if (j > 0) if (gridState[i][j - 1]) count++;

                if (i < this.rows - 1) if (gridState[i + 1][j]) count++;
                if (i < this.rows - 1 && j > 0) if (gridState[i + 1][j - 1]) count++;
                if (i < this.rows - 1 && this.cols - 1) if (gridState[i + 1][j + 1]) count++;

                if (gridState[i][j] && (count < 2 || count > 3)) altGridState[i][j] = false;
                if (!gridState[i][j] && count === 3) altGridState[i][j] = true;
            }
        }
        this.setState({
            gridFull: altGridState,
            generation: this.state.generation + 1
        });
    }

    componentDidMount() {
        this.seed();
        this.playButton();
    }

    render() {
        return (
            <div>
                <h1 className="title center">John Horton Conway's: The Game Of Life</h1>
                <h3>Rules:</h3>
                <h4 className="text">1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.</h4>
                <h4 className="text">2. Any live cell with two or three live neighbors lives on to the next generation.</h4>
                <h4 className="text">3. Any live cell with more than three live neighbors dies, as if by overpopulation.</h4>
                <h4 className="text">4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.</h4>
                <Grid
                    gridFull={this.state.gridFull}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                />
                <Buttons 
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    seed={this.seed}
                />
                <h3 className="text">Life Cycles: {this.state.generation}</h3>
            </div>
        );
    }
}

function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));
