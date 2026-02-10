/**
 * Perfect Tic-Tac-Toe solver (Minimax + alpha-beta pruning)
 * - Board is a length-9 array of: 'X', 'O', or null
 * - X goes first by default
 * - Returns best move for the current player
 */

// -------- Helpers --------
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diags
];

function winner(board) {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v; // 'X' or 'O'
  }
  return null;
}

function isDraw(board) {
  return !winner(board) && board.every(cell => cell !== null);
}

function nextPlayer(board) {
  const xCount = board.filter(v => v === 'X').length;
  const oCount = board.filter(v => v === 'O').length;
  return xCount === oCount ? 'X' : 'O';
}

function legalMoves(board) {
  const moves = [];
  for (let i = 0; i < 9; i++) if (board[i] === null) moves.push(i);
  return moves;
}

function pretty(board) {
  const s = board.map(v => v ?? ' ');
  return `
${s[0]}|${s[1]}|${s[2]}
-+-+-
${s[3]}|${s[4]}|${s[5]}
-+-+-
${s[6]}|${s[7]}|${s[8]}
`.trim();
}

// -------- Minimax --------
// Scoring is from the perspective of "maximizingPlayer".
// Win = +10 - depth (faster win is better)
// Loss = -10 + depth (slower loss is better)
// Draw = 0
function minimax(board, depth, alpha, beta, maximizingPlayer, currentPlayer) {
  const w = winner(board);
  if (w) {
    return w === maximizingPlayer ? (10 - depth) : (-10 + depth);
  }
  if (isDraw(board)) return 0;

  const moves = legalMoves(board);

  if (currentPlayer === maximizingPlayer) {
    let best = -Infinity;
    for (const m of moves) {
      board[m] = currentPlayer;
      const score = minimax(
        board,
        depth + 1,
        alpha,
        beta,
        maximizingPlayer,
        currentPlayer === 'X' ? 'O' : 'X'
      );
      board[m] = null;
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // prune
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      board[m] = currentPlayer;
      const score = minimax(
        board,
        depth + 1,
        alpha,
        beta,
        maximizingPlayer,
        currentPlayer === 'X' ? 'O' : 'X'
      );
      board[m] = null;
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break; // prune
    }
    return best;
  }
}

// Returns { move, score } for the current player on this board
function bestMove(board) {
  const w = winner(board);
  if (w || isDraw(board)) return { move: null, score: null };

  const player = nextPlayer(board);
  const moves = legalMoves(board);

  let bestScore = -Infinity;
  let best = null;

  for (const m of moves) {
    board[m] = player;
    const score = minimax(
      board,
      1,
      -Infinity,
      Infinity,
      player,                       // maximize for the current player
      player === 'X' ? 'O' : 'X'    // next turn
    );
    board[m] = null;

    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }

  return { move: best, score: bestScore };
}

// -------- Demo: AI vs AI (perfect play) --------
function playPerfectGame() {
  const board = Array(9).fill(null);

  while (!winner(board) && !isDraw(board)) {
    const { move } = bestMove(board);
    const p = nextPlayer(board);
    board[move] = p;
    console.log(`\n${p} plays ${move}\n${pretty(board)}`);
  }

  const w = winner(board);
  console.log("\nResult:", w ? `${w} wins` : "Draw");
}

// Example usage:
const board = Array(9).fill(null);
// Put some moves in to test (indexes 0..8), e.g. X at center:
board[4] = 'X';
console.log("Current board:\n" + pretty(board));
console.log("Best move for", nextPlayer(board), "=>", bestMove(board));

// Uncomment to watch perfect play:
// playPerfectGame();
