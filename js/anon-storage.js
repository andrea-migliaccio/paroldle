// AnonStorage — localStorage adapter with the same API as Firestore module.
// Used when the user plays in anonymous mode (no Firebase Auth / Firestore).
// All data is stored locally; uid parameter is ignored.

const AnonStorage = (() => {
  const PREFIX = 'unwordle_anon_';

  // ── helpers ────────────────────────────────────────────────────────────────

  function get(key) {
    try { const v = localStorage.getItem(PREFIX + key); return v ? JSON.parse(v) : null; }
    catch (_) { return null; }
  }

  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (_) {}
  }

  function defaultStats() {
    return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0, distribution: [0,0,0,0,0,0] };
  }

  // ── history index ─────────────────────────────────────────────────────────
  // Keeps an ordered list of played game dates for loadHistory().

  function addToHistory(date) {
    const h = get('history') || [];
    if (!h.includes(date)) {
      h.unshift(date); // most recent first
      if (h.length > 90) h.length = 90;
      set('history', h);
    }
  }

  // ── public API (mirrors Firestore module) ──────────────────────────────────

  function saveUserProfile(_uid, _data) {
    return Promise.resolve(); // no-op in anon mode
  }

  function loadStats(_uid) {
    return Promise.resolve(get('stats') || defaultStats());
  }

  function saveStats(_uid, stats) {
    set('stats', stats);
    return Promise.resolve();
  }

  function saveGame(_uid, gameData) {
    set('game_' + gameData.date, gameData);
    addToHistory(gameData.date);
    return Promise.resolve();
  }

  function saveGameProgress(_uid, gs) {
    set('game_' + gs.date, {
      date:       gs.date,
      puzzleId:   gs.puzzleId,
      targetWord: gs.targetWord,
      guesses:    gs.guesses,
      feedback:   gs.feedback,
      result:     'playing',
      attempts:   gs.guesses.length
    });
    addToHistory(gs.date);
    return Promise.resolve();
  }

  function loadGame(_uid, date) {
    return Promise.resolve(get('game_' + date));
  }

  function loadHistory(_uid, limit) {
    const dates = get('history') || [];
    const slice = dates.slice(0, limit || 50);
    const games = slice.map(d => get('game_' + d)).filter(Boolean);
    return Promise.resolve(games);
  }

  return { saveUserProfile, loadStats, saveStats, saveGame, saveGameProgress, loadGame, loadHistory };
})();
