import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  signInWithCredential,
  GoogleAuthProvider,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Maps Firebase's cryptic error codes to human-readable messages
export function getAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(getAuth(), email.trim(), password);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getAuth(), email.trim(), password);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(getAuth(), email.trim());
}

export async function signOut() {
  const authInstance = getAuth();
  const currentUser = authInstance.currentUser;

  // If the user signed in via Google, also end that native Google session —
  // otherwise a future "Continue with Google" silently reuses it instead of
  // prompting fresh.
  const usedGoogle = currentUser?.providerData?.some((p) => p.providerId === 'google.com');
  if (usedGoogle) {
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      // Non-fatal — proceed with Firebase sign-out regardless.
    }
  }

  return firebaseSignOut(authInstance);
}

// Google Sign-In
export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (!response.data?.idToken) {
    throw new Error('Google sign-in failed: no token returned.');
  }

  const googleCredential = GoogleAuthProvider.credential(response.data.idToken);
  return signInWithCredential(getAuth(), googleCredential);
}
