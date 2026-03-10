// Firebase Cloud Function — daily Wordle word scheduler
// Runs every day at 00:05 UTC, fetches today's and tomorrow's words
// from the NYTimes Wordle endpoint and saves them to Firestore.
//
// Collection: words/{YYYY-MM-DD}
// Document:   { word: "CRANE", puzzleId: 1234, fetchedAt: Timestamp }
//
// Deploy: firebase deploy --only functions

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { logger }     = require('firebase-functions');
const admin          = require('firebase-admin');
const fetch          = require('node-fetch');

admin.initializeApp();
const db = admin.firestore();

const NYTIMES_BASE = 'https://www.nytimes.com/svc/wordle/v2/';

// Returns YYYY-MM-DD for a date offset by `days` from today (UTC)
function dateString(offsetDays) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  const y  = d.getUTCFullYear();
  const m  = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

async function fetchAndSaveWord(date) {
  const url = NYTIMES_BASE + date + '.json';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NYTimes responded ${res.status} for ${date}`);

  const data = await res.json();
  const word     = data.solution.toUpperCase();
  const puzzleId = data.days_since_launch || data.id || 0;

  await db.collection('words').doc(date).set({
    word,
    puzzleId,
    fetchedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  logger.info(`Saved word for ${date}: ${word} (#${puzzleId})`);
}

// Scheduled: every day at 00:05 UTC
// NYTimes rotates words at midnight ET (~05:00 UTC) but the API
// exposes future dates immediately, so fetching at 00:05 UTC is safe.
exports.fetchDailyWords = onSchedule(
  { schedule: '5 0 * * *', timeZone: 'UTC' },
  async () => {
    const dates = [dateString(0), dateString(1)]; // today and tomorrow
    for (const date of dates) {
      try {
        await fetchAndSaveWord(date);
      } catch (err) {
        logger.error(`Failed to fetch word for ${date}:`, err.message);
        // Continue with next date — don't throw so the function doesn't retry all
      }
    }
  }
);
