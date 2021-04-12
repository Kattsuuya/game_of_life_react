import React from "react";
import "./App.css";
import Board from "./components/Board.jsx";

function App() {
  return (
    <div className="App">
      <h1 className="App-title">Game of Life</h1>
      <Board />
    </div>
  );
}

export default App;
