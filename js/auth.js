// Auth module — wraps Firebase Authentication (Google provider)
const Auth = (() => {
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  function signIn() {
    return auth.signInWithPopup(provider);
  }

  function signOut() {
    return auth.signOut();
  }

  // Calls callback(user) on every auth state change (user is null when signed out)
  function onAuthChange(callback) {
    auth.onAuthStateChanged(callback);
  }

  function currentUser() {
    return auth.currentUser;
  }

  return { signIn, signOut, onAuthChange, currentUser };
})();
