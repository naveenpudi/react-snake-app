import React, {Component} from 'react';
import './App.css';
import Board from './game/Board.js';

class App extends Component {

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Snake</h1>
                    <p>Click the button to start. Use the arrow keys to control the direction of the snake.</p>
                </div>
                <Board/>
            </div>
        )
    }
}

export default App;
