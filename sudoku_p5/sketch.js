let size = 60;

let height = size * 9;
let width = size * 9;

let grid;

let showPossibi;
let checker;
let curCell;

let gameStart = false;

let menu_Colour = "rgba(150, 148, 149, 0.5)";
let intro_Colour = "rgba(150, 148, 149, 0.75)";
let stroke_win_Colour = "rgb(0, 15, 132)";
let char_win_Colour = "rgb(0, 145, 255)";

function setup() {
  createCanvas(width + size * 3, height);
  grid = new Grid();
  checker = new Check();
  curCell = grid.getVal(4, 4);
  checker.init(grid);
  showPossibi = false;
}

function selectedCell(cell) {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      if (grid.getVal(i, j).number === cell.number) {
        grid.getVal(i, j).highlight = cell.visible;
        console.log(i, j, grid.getVal(i, j).highlight);
      } else grid.getVal(i, j).highlight = false;
    }
  }
}

function moveCurCell(direct) {
  switch (direct) {
    case "UP":
      if (curCell.row - 1 >= 0) {
        curCell = grid.getVal(curCell.row - 1, curCell.col);
        selectedCell(curCell);
      }
      break;
    case "DOWN":
      if (curCell.row + 1 < 9) {
        curCell = grid.getVal(curCell.row + 1, curCell.col);
        selectedCell(curCell);
      }
      break;
    case "RIGHT":
      if (curCell.col + 1 < 9) {
        curCell = grid.getVal(curCell.row, curCell.col + 1);
        selectedCell(curCell);
      }
      break;
    case "LEFT":
      if (curCell.col - 1 >= 0) {
        curCell = grid.getVal(curCell.row, curCell.col - 1);
        selectedCell(curCell);
      }
      break;
  }
}

function keyPressed() {
  if (gameStart) {
    if (keyCode === UP_ARROW) {
      // Moving
      moveCurCell("UP");
    } else if (keyCode === DOWN_ARROW) {
      moveCurCell("DOWN");
    } else if (keyCode === RIGHT_ARROW) {
      moveCurCell("RIGHT");
    } else if (keyCode === LEFT_ARROW) {
      moveCurCell("LEFT");
    } else if (key >= "0" && key <= "9") {
      // Input key
      if (!grid.getVal(curCell.row, curCell.col).fixed) {
        grid.getVal(curCell.row, curCell.col).number = key - "0";
        grid.getVal(curCell.row, curCell.col).visible = key - "0" > 0;
        selectedCell(curCell);
      }
    } else if (keyCode === 8) {
      // BackSpace to delete
      if (!grid.getVal(curCell.row, curCell.col).fixed) {
        grid.getVal(curCell.row, curCell.col).number = 0;
        grid.getVal(curCell.row, curCell.col).visible = false;
        selectedCell();
      }
    } else if (keyCode === 32) {
      // Space to show hint
      if (showPossibi) {
        showPossibi = false;
      } else {
        showPossibi = true;
      }
    }
  }
  if (keyCode === 13) {
    if (gameStart) {
      gameStart = false;
    } else {
      gameStart = true;
    }
  }
}

function mousePressed() {
  if (gameStart) {
    let pointMouseX = Math.floor(mouseX / size);
    let pointMouseY = Math.floor(mouseY / size);
    console.log(pointMouseX, pointMouseY, curCell.col, curCell.row);
    if (pointMouseX === curCell.col && pointMouseY === curCell.row) {
      curCell.number = (curCell.number + 1) % 10;
      if (curCell.number === 0) curCell.visible = false;
      else curCell.visible = true;
      console.log(curCell);
    } else if (
      pointMouseX >= 0 &&
      pointMouseX < 9 &&
      pointMouseY >= 0 &&
      pointMouseY < 9
    ) {
      curCell = grid.getVal(pointMouseY, pointMouseX);
    }
    selectedCell(curCell);
  }
}

let time = 0;

function draw() {
  background(255);

  grid.draw(size, curCell, showPossibi);
  grid.computePossibi(checker);
  // check win
  if (checker.check(grid)) {
    fill(menu_Colour);
    rect(0, 0, size * 9, size * 9);
    push();
    fill(char_win_Colour);
    strokeWeight(5);
    textSize(size);
    stroke(stroke_win_Colour);
    text("YOU WIN", width / 2 - size * 2, height / 2);
    pop();
    push();
    fill(char_win_Colour);
    stroke(stroke_win_Colour);
    if (grid.min <= 5) {
      text("VERY GOOD!", 0.1 * size + 9 * size, 2 * size);
    } else if (grid.min <= 10) {
      text("   GOOD!  ", 0.1 * size + 9 * size, 2 * size);
    } else if (grid.min <= 15) {
      text("QUITE BAD!", 0.1 * size + 9 * size, 2 * size);
    } else {
      text("   BAD!   ", 0.1 * size + 9 * size, 2 * size);
    }
    pop();
    noLoop();
  }
  console.log(showPossibi);

  if (gameStart) {
    if (time === 60) {
      ++grid.sec;
      if (grid.sec === 60) {
        grid.sec = 0;
        ++grid.min;
      }
      time = 0;
    }
    ++time;
  } else {
    push();
    fill(menu_Colour);
    rect(0, 0, size * 9, size * 9);
    fill(intro_Colour);
    rect(1 * size, 1 * size, size * 7, size * 7);
    textSize(50);
    fill(char_win_Colour);
    stroke(stroke_win_Colour);
    text("SUDOKU", width / 2 - 190, 2 * size);
    textSize(16);
    text(" - The object of Sudoku is to fill the other empty cells\n with numbers between 1 and 9 (1 number only in\n each cell) according the following guidelines: \n\n 1. Number can appear only once on each row: \n 2. Number can appear only once on each column: \n 3. Number can appear only once on each region\n  (square):\n Press Space for hint to solve sudoku ", width / 2 - 200, 3 * size);
    text("PRESS ENTER TO PAUSE OR UNPAUSE.", width / 2 - 25 * 12 / 2, 7 * size);
    pop();
  }
}
