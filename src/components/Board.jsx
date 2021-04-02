import React, { Component } from "react";

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 50,
      width: 80,
      cells: [],
      generation: 0,
      intervalId: 0,
    };
    this.makeCells = this.makeCells.bind(this);
    this.step = this.step.bind(this);
    this.count = this.count.bind(this);
    this.seed = this.seed.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.toggleCell = this.toggleCell.bind(this);
    this.display = this.display.bind(this);
  }

  componentDidMount() {
    this.reset();
  }

  /**
   * 二次元配列を生成する
   * @returns 二次元配列
   */
  makeCells() {
    const { height, width } = this.state;
    let cells = new Array(height);
    for (let y = 0; y < cells.length; y++) {
      cells[y] = new Array(width);
    }
    return cells;
  }

  /**
   * 次の世代へ進化する
   */
  step() {
    let next = this.makeCells();
    const { cells, width, height, generation } = this.state;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let state = cells[y][x];
        let neighbors = this.count(cells, y, x);
        if (state === 0 && neighbors === 3) {
          // 誕生
          next[y][x] = 1;
        } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
          // 死滅
          next[y][x] = 0;
        } else {
          // 生存
          next[y][x] = state;
        }
      }
    }
    this.setState({ cells: next, generation: generation + 1 });
  }

  /**
   * 周囲の生存セルの個数を数える
   * @param {*} cells
   * @param {*} y
   * @param {*} x
   * @returns 生存セルの個数
   */
  count(cells, y, x) {
    const { width, height } = this.state;
    let sum = 0;
    for (let y_ = -1; y_ < 2; y_++) {
      for (let x_ = -1; x_ < 2; x_++) {
        sum += cells[(y + y_ + height) % height][(x + x_ + width) % width];
      }
    }
    sum -= cells[y][x];
    return sum;
  }

  /**
   * 全てのセルの生存・死滅をランダムに決定する
   */
  seed() {
    const { width, height, cells } = this.state;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        cells[y][x] = Math.round(Math.random());
      }
    }
    this.setState({ cells });
  }

  /**
   * 自動で進化する
   */
  play() {
    clearInterval(this.state.intervalId);
    // 0.1秒ごとにstep()を実行する
    const intervalId = setInterval(this.step, 100);
    this.setState({ intervalId });
  }

  /**
   * 進化を中断する
   */
  pause() {
    clearInterval(this.state.intervalId);
  }

  /**
   * 盤面をリセットする
   */
  reset() {
    const { height, width } = this.state;
    let cells = this.makeCells();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        cells[y][x] = 0;
      }
    }
    this.setState({ cells, generation: 0 });
  }

  /**
   * セルの生存・死滅を反転する
   * @param {*} y
   * @param {*} x
   */
  toggleCell(y, x) {
    const { cells } = this.state;
    cells[y][x] = cells[y][x] ? 0 : 1;
    this.setState({ cells });
  }

  /**
   * セルの状態を表示する
   * @returns
   */
  display() {
    const { cells, width } = this.state;
    return (
      <div className="Grid" style={{ width: width * 11 }}>
        {cells.map((row, y) => (
          <div key={y}>
            {row.map((_, x) => (
              <div
                className={`Cell ${cells[y][x] ? "isActive" : ""}`}
                onClick={() => this.toggleCell(y, x)}
                key={x}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { generation } = this.state;
    return (
      <div>
        <button onClick={this.step}>Step</button>
        <button onClick={this.seed}>Randomize</button>
        <button onClick={this.play}>Play</button>
        <button onClick={this.pause}>Pause</button>
        <button onClick={this.reset}>Reset</button>
        {this.display()}
        <p>Generation: {generation}</p>
      </div>
    );
  }
}
