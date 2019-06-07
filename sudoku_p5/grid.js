class Grid {
  constructor() {
    this.lightError_Colour = "rgb(200, 50, 50)";
    this.curCell_Colour = "rgb(77, 166, 255)";
    this.hightlight_Colour = "rgb(255, 255, 77)";
    this.error_Colour = "rgb(230, 38, 0)";
    this.text_Colour = "rgb(170, 255, 153)";
    this.hint_Colour = "rgb(49, 84, 51)";
    this.time_Colour = "rgb(0, 145, 255)";
    this.stroke_time_Colour = "rgb(0, 15, 132)"

    // player_prediction
    this.data = new Array();
    this.sudoku = new Sudoku();
    this.sudoku.generate();
    this.sudoku = this.sudoku.data;
    this.min = 0;
    this.sec = 0;

    for (let i = 0; i < 9; ++i) {
      this.data[i] = new Array();
      for (let j = 0; j < 9; ++j) {
        this.data[i][j] = new Cell(
          this.sudoku[i][j],
          i,
          j,
          this.sudoku[i][j] > 0
        );
      }
    }
  }

  getVal(row, col) {
    return this.data[row][col];
  }

  draw(size, curCell, showPossibilities) {
    // Create surround box
    fill(255, 255, 255, 255);
    rect(0, 0, size * 9, size * 9);

    // time
    push();
    fill(this.time_Colour);
    stroke(this.stroke_time_Colour);
    textSize(size / 3);
    let MIN;
    if (this.min >= 10) MIN = this.min;
    else MIN = "0" + this.min;
    let SEC;
    if (this.sec >= 10) SEC = this.sec;
    else SEC = "0" + this.sec;
    text("Time: " + MIN + " : " + SEC, 0.3 * size + 9 * size, 1 * size);
    pop();

    for (let i = 0; i < 9; ++i) {
      for (let j = 0; j < 9; ++j) {
        if (this.getVal(i, j) === curCell) {
          fill(this.curCell_Colour);
        } else if (this.getVal(i, j).error) {
          fill(this.error_Colour);
        } else if (this.getVal(i, j).lightError) {
          fill(this.lightError_Colour);
        } else if (this.getVal(i, j).highlight) {
          fill(this.hightlight_Colour);
        } else {
          fill(255);
        }

        rect(j * size, i * size, size, size);

        // text
        if (this.getVal(i, j) === curCell || this.getVal(i, j).error) {
          fill(255);
        } else {
          fill(0);
        }
        if (this.getVal(i, j).visible) {
          textSize(size / 2);
          if (this.getVal(i, j).fixed) {
            textStyle(BOLD);
          } else {
            textStyle(ITALIC);
          }
          text(
            this.getVal(i, j).number,
            j * size + size / 4,
            i * size + size / 1.5
          );
        } else if (showPossibilities) {
          textSize(Math.floor(size / 4));
          textStyle(NORMAL);
          fill(this.hint_Colour);
          let possibi = "";
          for (let k = 0; k < grid.getVal(i, j).possibilities.length; ++k) {
            possibi += grid.getVal(i, j).possibilities[k];
          }
          console.log(possibi);
          text(
            possibi,
            Math.floor(j * size + size / 10),
            Math.floor(i * size + size - 10)
          );
        }
        this.getVal(i, j).error = false;
        this.getVal(i, j).lightError = false;
      }
    }
    strokeWeight(5);
    line(0 * size, 3 * size, 9 * size, 3 * size);
    line(0 * size, 6 * size, 9 * size, 6 * size);
    line(3 * size, 0 * size, 3 * size, 9 * size);
    line(6 * size, 0 * size, 6 * size, 39 * size);
    strokeWeight(1);
  }

  computeCellPossibi(checker, cell) {
    cell.possibilities = [];
    let col = checker.cols[cell.col];
    let row = checker.rows[cell.row];
    let square =
      checker.squares[
        Math.floor(cell.row / 3) +
          Math.floor(cell.col / 3) +
          2 * Math.floor(cell.col / 3)
      ];

    for (let val = 1; val <= 9; ++val) {
      if (val !== cell.number) {
        let possible = true;
        for (let i = 0; i < 9; ++i) {
          if (
            col[i].number === val ||
            row[i].number === val ||
            square[i].number === val
          ) {
            possible = false;
            break;
          }
        }
        if (possible) {
          cell.possibilities.push(val);
        }
      }
    }
    // console.log(cell.possibilities);
  }

  computePossibi(checker) {
    for (let i = 0; i < 9; ++i) {
      for (let j = 0; j < 9; ++j) {
        if (!this.getVal(i, j).visible)
          this.computeCellPossibi(checker, this.getVal(i, j));
      }
    }
  }
}
