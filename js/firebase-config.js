// Firebase project configuration
// Replace these placeholder values with your actual Firebase project config.
// Get these from: Firebase Console → Project Settings → Your apps → Web app
// These keys are PUBLIC — safe to commit. Access is controlled by Firestore Security Rules.
//
// Setup steps:
//   1. Go to https://console.firebase.google.com and create a project
//   2. Enable Authentication → Sign-in method → Google
//   3. Enable Firestore Database (start in production mode)
//   4. Add your domain (e.g. username.github.io) to Authentication → Settings → Authorized domains
//   5. Paste the config values below
//
// Cloud Functions setup (for daily word scheduler):
//   1. Upgrade Firebase project to Blaze (pay-as-you-go) plan
//   2. Firebase Console → Project Settings → Service Accounts → Generate new private key
//      Save the downloaded JSON — you will need it for GitHub Actions
//   3. GitHub repo → Settings → Secrets and variables → Actions → New repository secret
//      Name: FIREBASE_SERVICE_ACCOUNT   Value: paste the entire JSON content
//   4. Locally: npm install -g firebase-tools
//   5. firebase login
//   6. firebase init functions   (select existing project, JavaScript, no ESLint)
//   7. First manual deploy: firebase deploy --only functions
//   8. Subsequent deploys: automatic via GitHub Actions on push to main (when functions/ changes)

const firebaseConfig = {
  apiKey: "AIzaSyB9csGnaWqjYccsmXTCBXNVbNGA60cgHR8",
  authDomain: "paroldle-6e5c3.firebaseapp.com",
  projectId: "paroldle-6e5c3",
  storageBucket: "paroldle-6e5c3.firebasestorage.app",
  messagingSenderId: "262738094726",
  appId: "1:262738094726:web:1552581bd7223b1ba03f07",
  measurementId: "G-ZJ5K57JW60"
};

firebase.initializeApp(firebaseConfig);

// Optional: custom CORS proxy (e.g. Cloudflare Worker) as first-priority fallback.
// Set this if corsproxy.io and allorigins.win are blocked on your network.
// Example: window.CUSTOM_CORS_PROXY = 'https://my-worker.my-domain.workers.dev/?';
// window.CUSTOM_CORS_PROXY = undefined;

