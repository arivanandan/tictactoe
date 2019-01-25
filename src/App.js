import React, { PureComponent } from 'react';

import './App.css';

const getInitialState = () => ({
  isDone: false,
  isOperating: false,
  isTicNext: false,
  ticMap: Array(9).fill(''),
});

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = getInitialState();
  }

  onPressBox = (index) => {
    const { isOperating, ticMap, isTicNext } = this.state;
    
    if (ticMap[index] || isOperating) return;
    
    ticMap[index] = isTicNext ? 'O' : 'X';
    
    this.setState(
      { ticMap, isTicNext: !isTicNext, isOperating: true },
      this.calcVictory);
  }

  resetBoard = () => {
    this.setState({ ...getInitialState() });
  }

  calcVictory = () => {
    const rowPointerGenerator = (i, i2) => i + i2 * 3;
    const columnPointerGenerator = (i, i2) => (i * 3) + i2;

    const maybeRowVictory = this.isStraightLineVictory(rowPointerGenerator);
    const maybeColumnVictory = this.isStraightLineVictory(columnPointerGenerator);
    const maybeDiagonalVictory = this.isDiagonalVictory();
    const maybeNoVictory = this.isNoVictory();

    const { isTicNext } = this.state;

    if (maybeRowVictory) {
      alert(isTicNext ? `X won on Row ${maybeRowVictory}` : `O won on Row ${maybeRowVictory}`)
    }

    if (maybeColumnVictory) {
      alert(isTicNext ? `X won on Column ${maybeColumnVictory}` : `O won on Column ${maybeColumnVictory}`)
    }

    if (maybeDiagonalVictory) {
      alert(isTicNext ? `X won on Diagonal ${maybeDiagonalVictory}` : `O won on Diagonal ${maybeDiagonalVictory}`)
    }

    const isDone = maybeColumnVictory || maybeRowVictory || maybeDiagonalVictory;

    if (!isDone && maybeNoVictory) {
      alert('Nobody won today.');
    }


    this.setState({ isOperating: false, isDone });
  }

  isStraightLineVictory = (pointerGenerator) => {
    // rows and columns 
    // 0,3,6 - 1,4,7 - 2,5,8 ROW
    // 0,1,2 - 3,4,5 - 6,7,8 COLUMN

    const { isTicNext, ticMap } = this.state;
    
    const probableVictor = isTicNext ? 'XXX' : 'OOO';

    const rowColumnCount = Math.sqrt(ticMap.length);
    let currentMap = '';
    let victoryArray = [];
    for (let i = 0; i < rowColumnCount; i++) {
      currentMap = '';
      victoryArray = [];
      for (let i2 = 0; i2 < rowColumnCount; i2++) {
        const pointer = pointerGenerator(i, i2);
        victoryArray.push(pointer);
        currentMap += ticMap[pointer];
      }
      if (currentMap === probableVictor) {
        this.setState({ victoryArray });
        return i + 1; 
      }
    }
    return false;
  }
  
  isDiagonalVictory = () => {
    // 0,4,8 - 2,4,6 DIAGONAL
    const { isTicNext, ticMap } = this.state;

    const probableVictor = isTicNext ? 'XXX' : 'OOO';
    
    const diagonal1 = `${ticMap[0]}${ticMap[4]}${ticMap[8]}`;
    const diagonal2 = `${ticMap[2]}${ticMap[4]}${ticMap[6]}`;

    if (diagonal1 === probableVictor) {
      this.setState({ victoryArray: [0, 4, 8] });
      return 1;
    }
    if (diagonal2 === probableVictor) {
      this.setState({ victoryArray: [2, 4, 6] });
      return 2;
    }

    return false;
  }

  isNoVictory = () => {
    return !this.state.ticMap.includes('');
  }

  renderBoxes = () => Array(3).fill(0).map((_, i) => i).map(
    (rowNumber) => (
      <div className="row" key={`row-${rowNumber}`}>
        {
          Array(3).fill(0).map((_, i2) => i2).map(
            (rowBoxNumber) => {
              const { isDone, ticMap, victoryArray } = this.state;
              const boxNumber = rowBoxNumber + (rowNumber * 3);
              return (
                <div className="box" id={`box-${boxNumber}`} key={`box-${boxNumber}`}> 
                  <button
                    disabled={isDone}
                    className={`buttonReset${isDone && victoryArray.includes(boxNumber) ? ' victory' : ''}`}
                    onClick={() => this.onPressBox(boxNumber)}
                  >
                    {ticMap[boxNumber]}
                  </button>
                </div>
              )
            }
          )
        }
      </div>
    )
  );

  renderResetButton = () => (
    <button onClick={this.resetBoard}>
      Reset
    </button>
  )

  render() {
    return (
      <div className="container">
        {this.renderBoxes()}
        {this.renderResetButton()}
      </div>
    );
  }
}

export default App;
