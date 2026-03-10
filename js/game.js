// Game module — board rendering, input handling, NYTimes word fetch
const Game = (() => {
  const WORD_LENGTH  = 5;
  const MAX_ATTEMPTS = 6;

  // Public NYTimes Wordle endpoint. corsproxy.io is used to bypass CORS restrictions
  // when running on a different domain (e.g. GitHub Pages).
  const NYTIMES_BASE = 'https://www.nytimes.com/svc/wordle/v2/';
  const CORS_PROXY   = 'https://corsproxy.io/?';

  const KEYBOARD_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫']
  ];

  // ── Fetch today's word ────────────────────────────────────────────────────

  function fetchTodayWord(date) {
    const url = CORS_PROXY + encodeURIComponent(NYTIMES_BASE + date + '.json');
    return fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => ({
        word:     data.solution.toUpperCase(),
        puzzleId: data.days_since_launch || data.id || 0
      }));
  }

  // ── Board ─────────────────────────────────────────────────────────────────

  function buildBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let r = 0; r < MAX_ATTEMPTS; r++) {
      const row = document.createElement('div');
      row.classList.add('row');
      row.dataset.row = r;
      for (let c = 0; c < WORD_LENGTH; c++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.row = r;
        tile.dataset.col = c;
        row.appendChild(tile);
      }
      board.appendChild(row);
    }
  }

  function getTile(row, col) {
    return document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
  }

  function getRow(row) {
    return document.querySelector(`.row[data-row="${row}"]`);
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────

  function buildKeyboard() {
    const container = document.getElementById('keyboard');
    container.innerHTML = '';
    KEYBOARD_ROWS.forEach(keys => {
      const row = document.createElement('div');
      row.classList.add('keyboard-row');
      keys.forEach(key => {
        const btn = document.createElement('button');
        btn.classList.add('key');
        btn.textContent = key;
        btn.dataset.key = key;
        if (key === 'ENTER') btn.classList.add('key-wide');
        if (key === '⌫')    btn.classList.add('key-wide');
        btn.addEventListener('click', () => App.handleKey(key));
        row.appendChild(btn);
      });
      container.appendChild(row);
    });
  }

  function updateKeyboard(keyboardState) {
    Object.entries(keyboardState).forEach(([letter, state]) => {
      const btn = document.querySelector(`.key[data-key="${letter}"]`);
      if (btn) {
        btn.dataset.state = state;
      }
    });
  }

  // ── Tile rendering ────────────────────────────────────────────────────────

  function setTileLetter(row, col, letter) {
    const tile = getTile(row, col);
    tile.textContent = letter;
    tile.dataset.state = letter ? 'tbd' : 'empty';
    if (letter) {
      tile.classList.add('pop');
      tile.addEventListener('animationend', () => tile.classList.remove('pop'), { once: true });
    }
  }

  // Reveals a row of tiles with flip animation, staggered per tile
  function revealRow(row, letters, feedback) {
    return new Promise(resolve => {
      const FLIP_DURATION = 300; // ms per tile
      const GAP = 100;           // ms between tiles

      letters.forEach((letter, col) => {
        const tile = getTile(row, col);
        const delay = col * GAP;

        setTimeout(() => {
          // Phase 1: collapse (scale Y to 0)
          tile.classList.add('flip-out');
          setTimeout(() => {
            // Mid-flip: apply new state
            tile.dataset.state = feedback[col];
            tile.textContent = letter;
            tile.classList.remove('flip-out');
            tile.classList.add('flip-in');
            setTimeout(() => {
              tile.classList.remove('flip-in');
            }, FLIP_DURATION);
          }, FLIP_DURATION);
        }, delay);
      });

      // Resolve after all tiles have been revealed
      const total = (letters.length - 1) * GAP + FLIP_DURATION * 2;
      setTimeout(resolve, total);
    });
  }

  function shakeRow(rowIndex) {
    const row = getRow(rowIndex);
    row.classList.add('shake');
    row.addEventListener('animationend', () => row.classList.remove('shake'), { once: true });
  }

  function bounceRow(rowIndex) {
    for (let c = 0; c < WORD_LENGTH; c++) {
      const tile = getTile(rowIndex, c);
      setTimeout(() => {
        tile.classList.add('bounce');
        tile.addEventListener('animationend', () => tile.classList.remove('bounce'), { once: true });
      }, c * 100);
    }
  }

  // Restores a completed game on the board (no animation)
  function restoreBoard(guesses, feedback) {
    guesses.forEach((guess, rowIdx) => {
      guess.split('').forEach((letter, col) => {
        const tile = getTile(rowIdx, col);
        tile.textContent = letter;
        tile.dataset.state = feedback[rowIdx][col];
      });
    });
  }

  return {
    fetchTodayWord,
    buildBoard,
    buildKeyboard,
    updateKeyboard,
    setTileLetter,
    revealRow,
    shakeRow,
    bounceRow,
    restoreBoard
  };
})();
