// Model
var Kinekt4 = function() {
};

Kinekt4.prototype = {
  maxRows: 6,
  maxCols: 7,
  // TODO refactor board to use maxCols
  board: [[],[],[],[],[],[],[]],

  // TODO refactor whoseTurn and notWhoseTurn to variable with default and toggle function
  whoseTurn: function() {
    var redCount = $.map(this.board, function(n) {
      return n;
    }).filter(function(color){
      return color == "red";
    }).length;
    var blackCount = $.map(this.board, function(n) {
      return n;
    }).filter(function(color){
      return color == "black";
    }).length;
    return (redCount > blackCount) ? "black" : "red";
  },

  notWhoseTurn: function() {
    return (this.whoseTurn() === "red") ? "black" : "red";
  },

  addDot: function(col) {
    if (this.board[col].length < this.maxRows) {
      this.board[col].push(this.whoseTurn())
      return true;
    } else {
      return false;
    }
  },

  check4: function(dot,dir) {
    var endDot = {
      row: dot.row + 3 * dir.row,
      col: dot.col + 3 * dir.col
    };
    if (0 <= endDot.row && endDot.row < this.maxRows
      && 0 <= endDot.col && endDot.col < this.maxCols) {
      var dotCount = 1
      for (var i = 1; i < 4; i++) {
        if (this.board[dot.col][dot.row] !== this.board[dot.col + (i * dir.col)][dot.row + (i * dir.row)]) { break }
        dotCount++
      }
      if (dotCount == 4) {return true} else {return false}
    } else {return false}
  },

  gameOver: function(dot) {
    var dir = {row: -1, col: 0}
    var gameOver =
      this.board.every(col => col.length == this.maxRows)
      || this.check4(dot,dir);
    for (var rowDir = -1; rowDir <= 1 && gameOver == false; rowDir++) {
      dir = {row: rowDir, col: 1};
      for (var i = 0; i < 4 && gameOver == false; i++) {
        var tempDot = {
          row: dot.row - (i * dir.row),
          col: dot.col - (i * dir.col)
        };
        if (tempDot.row < 0 || this.maxRows <= tempDot.row || tempDot.col < 0) { break }
        else {
          gameOver = this.check4(tempDot,dir)
        }
      }
    }
    return gameOver;
  }
};

// Controller
$(function() {
  game = new Kinekt4();
  $(".whose_turn").addClass(game.whoseTurn());

  $("table#board tr td").on("click", function() {
    var col = $($(this).closest("tr").find("td")).index(this);
    if (game.addDot(col)) {
      var dot = {
        row: game.board[col].length - 1,
        col: col
      };
      showDot(dot);
      showWhoseTurn();
      if (game.gameOver(dot)) {showWhoWon()}
    }
  })
  $(".btn").on("click", function(){
    window.location.reload(true);
  })
});

// View
var showDot = function(dot) {
  $("table#board tr:eq(-" + (dot.row+1) + ") td:eq(" + dot.col + ")").addClass(game.notWhoseTurn());
}

var showWhoseTurn = function() {
  $(".whose_turn").toggleClass("black red");
}

var showWhoWon = function() {
  $("table#board").after("<p><div class='whose_turn " + game.notWhoseTurn() + "'></div> Won!</p>");
}
