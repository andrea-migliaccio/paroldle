# Copilot Instructions — Wordle Clone

## Project Overview
Client-side Wordle replica: Plain JavaScript (ES6), HTML5, CSS3 with Firebase Auth + Firestore. No frameworks, no npm dependencies, no build tools. Deployed to GitHub Pages.

**Core Features:** Google/Gmail login (required) → Daily word via NYTimes endpoint → Play, save stats, view history, share results.

## Architecture Decisions

### Tech Stack
- **Frontend:** Vanilla JavaScript (ES6), HTML5, CSS3 only
- **External Libraries:** Firebase SDK via CDN (`<script>` tags only) — **No npm, no bundling**
- **Hosting:** GitHub Pages (static files)
- **Database:** Firebase Firestore (client-side only)
- **Auth:** Firebase Authentication (Google provider)
- **Daily Word:** NYTimes public endpoint (`https://www.nytimes.com/svc/wordle/v2/YYYY-MM-DD.json`)

### Repository Structure (Planned)
```
wordle/
├── index.html                 # Main entry point
├── css/
│   └── style.css             # All styling (responsive, no framework)
├── js/
│   ├── app.js                # Main app controller
│   ├── game.js               # Game logic (5-letter, 6 tries, feedback)
│   ├── auth.js               # Firebase Auth (login/logout)
│   ├── firebase-config.js    # Firebase project config (public, no secrets)
│   ├── firestore.js          # Persist games, stats, user data
│   └── utils.js              # Helpers (word validation, share formatting)
├── .github/
│   └── copilot-instructions.md  # This file
└── README.md                     # User-facing documentation
```

### Key Conventions

1. **Firebase CDN Setup**
   - Include Firebase scripts in `index.html` via `<script>` tags (not npm)
   - Example: `<script src="https://www.gstatic.com/firebasejs/..."></script>`
   - Config stored in plain `js/firebase-config.js` (no secrets—use public API key only)

2. **Game State Management**
   - Single source of truth: `window.gameState` object (vanilla JS, no stores)
   - Example structure:
     ```javascript
     window.gameState = {
       currentGame: { guesses: [], targetWord: null, attempts: 0, status: 'playing' },
       user: { uid, displayName, email },
       stats: { wins: 0, losses: 0, streak: 0, distribution: [0,0,0,0,0,0] }
     }
     ```

3. **Firestore Collections**
   - `users/{uid}` — user profile (displayName, email, created, updated)
   - `users/{uid}/games/{gameId}` — game records (date, guesses, targetWord, result, time)
   - `users/{uid}/stats` — aggregated stats (wins, losses, streak, distribution)
   - Security rules: authenticated users can only read/write their own data

4. **Code Organization**
   - Each module exports a single namespace (e.g., `Game`, `Auth`, `Firestore`)
   - No async/await — use `.then()` chains for clarity with Firebase promises
   - HTML is the source of truth for UI state (no virtual DOM)

5. **Game Logic**
   - **Wordle Rules:** 5-letter words, 6 attempts max, color feedback (green=correct, yellow=present, gray=absent)
   - Word validation: check against valid guesses list (can fetch from NYTimes endpoint or local list)
   - Feedback computation: compare guess against target word, return color array

6. **Share Feature**
   - Format: emoji grid (🟩🟨⬜) per row + game metadata (date, attempt count)
   - Copy to clipboard via standard `navigator.clipboard.writeText()`
   - Example: `Wordle 1,234 5/6\n🟩⬜🟨⬜⬜\n...`

7. **Styling**
   - Mobile-first responsive design (CSS Grid/Flexbox only, no Bootstrap/Tailwind)
   - Color scheme: match NYTimes Wordle (greens, yellows, grays, dark mode support)
   - Single `css/style.css` file (no SCSS/preprocessors)

8. **Authentication Flow**
   - User lands on index.html → check `auth.currentUser`
   - If not logged in: show login button (Google Sign-In popup)
   - On login: redirect to game board, load user stats from Firestore
   - On logout: clear `gameState`, redirect to login screen

### Development Notes

- **No Local Server Required:** Open `index.html` directly in browser (or use `python -m http.server` if needed)
- **Firebase Emulator:** Optional for local testing; instructions in README
- **Testing:** Manual testing in browser (no Jest, no automation framework yet)
- **Debugging:** Use browser DevTools; Firebase Auth and Firestore have verbose logging available

### Deployment

1. Push code to GitHub repository
2. Enable GitHub Pages in Settings (source: `main` branch, `/root` folder)
3. Firebase project must have GitHub Pages domain in Auth allowed domains
4. No build step — files are served as-is

### Security Rules (Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      match /games/{gameId} {
        allow read, write: if request.auth.uid == uid;
      }
      match /stats {
        allow read, write: if request.auth.uid == uid;
      }
    }
  }
}
```

### Common Tasks

| Task | How |
|------|-----|
| Add a new game feature | Edit `js/game.js`, update game state in `app.js`, add UI in `index.html` |
| Change styling | Modify `css/style.css` only |
| Fix auth flow | Check `js/auth.js` and Firebase config in `js/firebase-config.js` |
| Save new stat | Update Firestore collection `users/{uid}/stats` in `js/firestore.js` |
| Test locally | Open `index.html` in browser (may need local server for CORS) |

---

**Created:** March 2026 | **Status:** Planning phase (no code yet)
