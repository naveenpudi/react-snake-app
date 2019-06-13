import React, {Component} from 'react'
import './Board.css'
import ArrowKeysReact from 'arrow-keys-react';

const BOARD_SIZE = 30;
const SPEED = 8;
const GAME_SIZE = 500;

const DIRECTION = {
    UP: 'up',
    LEFT: 'left',
    DOWN: 'down',
    RIGHT: 'right'
};

const CELL_TYPE = {
    FREE: '#EEEEEE',
    SNAKE: '#42A5F5',
    APPLE: '#EF5350',
};

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({highScore: 0}, this.init());
        setInterval(this.update.bind(this), 1000 / SPEED);

        ArrowKeysReact.config({
            left: () => {
                if (this.state.dir !== DIRECTION.RIGHT) this.setState({dir: DIRECTION.LEFT});
            },
            right: () => {
                if (this.state.dir !== DIRECTION.LEFT) this.setState({dir: DIRECTION.RIGHT});
            },
            up: () => {
                if (this.state.dir !== DIRECTION.DOWN) this.setState({dir: DIRECTION.UP});
            },
            down: () => {
                if (this.state.dir !== DIRECTION.UP) this.setState({dir: DIRECTION.DOWN});
            },
        });
    }

    init(){
        const board = Array.from(Array(BOARD_SIZE), () => new Array(BOARD_SIZE).fill(CELL_TYPE.FREE));
        const snake = getFreePos(board);
        board[snake.y][snake.x] = CELL_TYPE.SNAKE;
        const apple = getFreePos(board);
        board[apple.y][apple.x] = CELL_TYPE.APPLE;

        return {
            board: board,
            snake: [snake],
            apple: apple,
            dir: Object.values(DIRECTION)[getRandomInt(Object.values(DIRECTION).length)],
            gameOver: false,
            score: 0,
        }
    }

    onGameOver() {
        this.setState(state => {
            const highScore = Math.max(state.highScore, state.score);
            return {
                score: 0,
                highScore: highScore,
                gameOver: true,
            }
        });
    }

    render() {
        return (
            <div style={{width: GAME_SIZE + 350, marginLeft: 'auto', marginRight: 'auto'}}>
                <div style={{width: GAME_SIZE, float: 'left', marginRight: 50}}>
                    <table className='Board' {...ArrowKeysReact.events} tabIndex="1">
                        <style>{
                            `:root { --game-width: ${GAME_SIZE}; }`
                        }</style>
                        <tbody>
                        {this.state.board.map((row, i) =>
                            <tr key={i}>
                                {row.map((value, j) =>
                                    <td key={j} style={{
                                        backgroundColor: value,
                                        width: GAME_SIZE / BOARD_SIZE,
                                        height: GAME_SIZE / BOARD_SIZE
                                    }}/>)
                                }
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div style={{width: 300, height: GAME_SIZE, float: 'right', textAlign: 'left'}}>
                    <h2>Scoreboard</h2>
                    <p>Score: {this.state.score}</p>
                    <p>High score: {this.state.highScore}</p>
                    <p>Game over: {this.state.gameOver ? 'yes' : 'no'}</p>
                    <button onClick={this.restart.bind(this)} className='btn btn-primary' disabled={this.state.gameOver ? '' : 'disabled'}>Restart</button>
                    <h3 style={{marginTop: 25}}>Debug information</h3>
                    <p>Current direction: {this.state.dir}</p>
                    <p>Snake <ul style={{maxHeight: 150, overflowY: 'scroll'}}>{this.state.snake.map(pos => React.createElement('li', null, `x: ${pos.x}, y: ${pos.y}`))}</ul></p>
                </div>
            </div>
        )
    }

    update() {
        if (this.state.gameOver){
            return;
        }
        let x = 0;
        let y = 0;

        switch (this.state.dir) {
            case DIRECTION.UP:
                y--;
                break;
            case DIRECTION.LEFT:
                x--;
                break;
            case DIRECTION.DOWN:
                y++;
                break;
            case DIRECTION.RIGHT:
                x++;
                break;
            default:
                console.log('Cannot end here');
        }

        this.setState(state => {
            const new_pos = Object.assign({}, state.snake[state.snake.length - 1]);
            new_pos.x += x;
            new_pos.y += y;
            // Check for boundary collision
            if (new_pos.x < 0 || new_pos.x >= BOARD_SIZE || new_pos.y < 0 || new_pos.y >= BOARD_SIZE) {
                this.onGameOver();
                return {};
            }
            // check for snake collision
            if (state.snake.find(pos => pos.x === new_pos.x && pos.y === new_pos.y)){
                this.onGameOver();
                return {};
            }
            // Check for apple collision
            if (new_pos.x === state.apple.x && new_pos.y === state.apple.y) {
                state.board[new_pos.y][new_pos.x] = CELL_TYPE.SNAKE;
                state.apple = getFreePos(state.board);
                state.board[state.apple.y][state.apple.x] = CELL_TYPE.APPLE;
                state.score += 10;
            } else {
                // remove first element of snake
                const free_pos = state.snake.splice(0, 1)[0];
                state.board[free_pos.y][free_pos.x] = CELL_TYPE.FREE;
            }
            // add last element to snake
            state.snake.push(new_pos);
            state.board[new_pos.y][new_pos.x] = CELL_TYPE.SNAKE;
            return {
                board: state.board,
                snake: state.snake,
                apple: state.apple,
                score: state.score,
            };
        });
    }

    restart() {
        this.setState(this.init());
    }
}

/**
 * Returns an object {x, y} for which the board[y][x] is free
 * @param board
 */
function getFreePos(board) {
    let obj = {};
    do {
        obj = {
            x: getRandomInt(BOARD_SIZE),
            y: getRandomInt(BOARD_SIZE),
        };
    } while (board[obj.y][obj.x] !== CELL_TYPE.FREE);
    return obj;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export default Board