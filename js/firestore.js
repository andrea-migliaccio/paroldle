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

  // Firestore does not support nested arrays.
  // feedback is stored as an array of comma-joined strings: ["absent,correct,present,absent,correct", ...]
  function serializeFeedback(feedback) {
    return feedback.map(row => row.join(','));
  }

  function deserializeFeedback(feedback) {
    return feedback.map(row => row.split(','));
  }

  // gameData: { date, puzzleId, targetWord, guesses, feedback, result, attempts, completedAt }
  function saveGame(uid, gameData) {
    const record = Object.assign({}, gameData, {
      feedback: serializeFeedback(gameData.feedback)
    });
    return db.collection('users').doc(uid)
      .collection('games').doc(gameData.date)
      .set(record);
  }

  function deserializeGame(data) {
    return Object.assign({}, data, {
      feedback: deserializeFeedback(data.feedback)
    });
  }

  // Load a specific game by date
  function loadGame(uid, date) {
    return db.collection('users').doc(uid)
      .collection('games').doc(date)
      .get()
      .then(doc => doc.exists ? deserializeGame(doc.data()) : null);
  }

  // Load history (most recent games first)
  function loadHistory(uid, limit) {
    return db.collection('users').doc(uid)
      .collection('games')
      .orderBy('date', 'desc')
      .limit(limit || 50)
      .get()
      .then(snapshot => {
        const games = [];
        snapshot.forEach(doc => games.push(deserializeGame(doc.data())));
        return games;
      });
  }

  return { saveUserProfile, loadStats, saveStats, saveGame, loadGame, loadHistory };
})();
