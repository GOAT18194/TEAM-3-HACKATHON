class Cell {
  constructor(value, row, col, fixed) {
    this.row = row;
    this.col = col;
    this.number = value % 10;
    this.visible = this.number > 0; // only show the number if they is larger than 0
    this.error = false; // show bright red
    this.lightError = false; // show light red
    this.fixed = fixed;
    this.highlight = false;
    this.possibilities = new Array();
  }
}
