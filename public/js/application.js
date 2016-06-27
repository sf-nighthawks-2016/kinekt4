// Model
var Kinekt4 = function() {
};

Kinekt4.prototype = {
  maxRows: 6,
  maxCols: 7,
  // TODO refactor board to use maxCols
  board: [[],[],[],[],[],[],[]],
  whoseTurn: "red",
  whoWon: null,

  toggleWhoseTurn: function() {
    this.whoseTurn = (this.whoseTurn == "red") ? "black" : "red";
  },

  addDot: function(col) {
    if (this.board[col].length < this.maxRows) {
      this.board[col].push(this.whoseTurn)
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
      if (dotCount == 4) {
        this.whoWon = this.whoseTurn;
        return true;
      } else {return false}
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
  $("#whose_turn").addClass(game.whoseTurn);

  $("table#board tr td").on("click", function() {
    if (game.whoseTurn) {
      var col = $($(this).closest("tr").find("td")).index(this);
      if (game.addDot(col)) {
        var dot = {
          row: game.board[col].length - 1,
          col: col
        };
        showDot(dot);
        if (game.gameOver(dot)) {
          showWhoWon();
          game.whoseTurn = null;
        }
        else {showWhoseTurn(game.toggleWhoseTurn())}
      }
    }
  })

  $(".btn").on("click", function() {
    window.location.reload(true);
  })
});

// View
var showDot = function(dot) {
  $("table#board tr:eq(-" + (dot.row+1) + ") td:eq(" + dot.col + ")").addClass(game.whoseTurn);
}

var showWhoseTurn = function() {
  $("#whose_turn").toggleClass("black red");
}

var showWhoWon = function() {
  if (game.whoWon) {$('#whose_turn').parent().get(0).lastChild.nodeValue = " Won!"}
  else {
    $("#whose_turn").removeClass("red black");
    $("#whose_turn").parent().get(0).lastChild.nodeValue = " No one won.";
  }
}
