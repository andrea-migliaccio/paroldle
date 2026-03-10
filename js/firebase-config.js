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
