// Firestore module — all database operations
const Firestore = (() => {
  const db = firebase.firestore();

  // ── User profile ──────────────────────────────────────────────────────────

  function saveUserProfile(uid, data) {
    return db.collection('users').doc(uid).set({
      displayName: data.displayName,
      email:       data.email,
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  function loadStats(uid) {
    return db.collection('users').doc(uid)
      .collection('stats').doc('summary')
      .get()
      .then(doc => {
        if (doc.exists) return doc.data();
        return {
          gamesPlayed:    0,
          gamesWon:       0,
          currentStreak:  0,
          maxStreak:      0,
          distribution:   [0, 0, 0, 0, 0, 0]
        };
      });
  }

  function saveStats(uid, stats) {
    return db.collection('users').doc(uid)
      .collection('stats').doc('summary')
      .set(stats);
  }

  // ── Games ─────────────────────────────────────────────────────────────────

  // gameData: { date, puzzleId, targetWord, guesses, feedback, result, attempts, completedAt }
  function saveGame(uid, gameData) {
    return db.collection('users').doc(uid)
      .collection('games').doc(gameData.date)
      .set(gameData);
  }

  // Load today's game if already played
  function loadTodayGame(uid, date) {
    return db.collection('users').doc(uid)
      .collection('games').doc(date)
      .get()
      .then(doc => doc.exists ? doc.data() : null);
  }

  // Load history (most recent games first)
  function loadHistory(uid, limit) {
    return db.collection('users').doc(uid)
      .collection('games')
      .orderBy('completedAt', 'desc')
      .limit(limit || 20)
      .get()
      .then(snapshot => {
        const games = [];
        snapshot.forEach(doc => games.push(doc.data()));
        return games;
      });
  }

  return { saveUserProfile, loadStats, saveStats, saveGame, loadTodayGame, loadHistory };
})();
