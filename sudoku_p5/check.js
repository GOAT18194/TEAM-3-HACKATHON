class Check {
  constructor() {
    this.rows = new Array();
    this.cols = new Array();
    this.squares = new Array();
  }

  init(grid) {
    for (let i = 0; i < 9; ++i) {
      this.rows[i] = new Array();
      this.cols[i] = new Array();
      this.squares[i] = new Array();
    }

    for (let i = 0; i < 9; ++i) {
      for (let j = 0; j < 9; ++j) {
        this.rows[i].push(grid.getVal(i, j));
        this.cols[j].push(grid.getVal(i, j));
      }
    }

    for (let i = 0; i < 9; ++i) {
      for (let j = 0; j < 9; ++j) {
        let idSquare =
          Math.floor(i / 3) + Math.floor(j / 3) + 2 * Math.floor(j / 3);
        this.squares[idSquare].push(grid.getVal(i, j));
      }
    }
  }

  isValid(arr) {
    // check if they are correct or not
    let valid = true;

    let vals = [];
    let cells = [];

    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].visible) {
        if (vals.indexOf(arr[i].number) === -1) {
          vals.push(arr[i].number);
          cells.push(arr[i]);
        } else {
          arr[i].error = true;
          cells[vals.indexOf(arr[i].number)].error = true;
          valid = false;
        }
      }
    }

    return valid;
  }

  check(grid) {
    let error = false;

    for (let i = 0; i < 9; ++i) {
      // Check squares
      if (!this.isValid(this.squares[i])) {
        error = true;
        for (let j = 0; j < 9; ++j) {
          this.squares[i][j].lightError = true;
        }
      }

      // Check rows
      if (!this.isValid(this.rows[i])) {
        error = true;
        for (let j = 0; j < 9; ++j) {
          this.rows[i][j].lightError = true;
        }
      }

      // Check cols
      if (!this.isValid(this.cols[i])) {
        error = true;
        for (let j = 0; j < 9; ++j) {
          this.cols[i][j].lightError = true;
        }
      }
    }

    let completed = false;
    if (!error) {
      completed = true;
      for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
          if (grid.getVal(i, j).number < 1) {
            completed = false;
          }
        }
      }
    }

    return completed;
  }
}
