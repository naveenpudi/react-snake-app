import React, {Component} from 'react';
import './App.css';
import Board from './game/Board.js';

class App extends Component {

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Snake</h1>
                    <p>First click on the field to gain focus. Then, use the arrow keys to control
                        the direction of the snake.</p>
                </div>
                <Board/>
            </div>
        )
    }
}

export default App;
