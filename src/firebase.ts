import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google Auth Provider
const provider = new GoogleAuthProvider();
// Request Workspace Gmail send scope
provider.addScope("https://www.googleapis.com/auth/gmail.send");

let isSigningIn = false;
let cachedAccessToken: string | null = null;
try {
  cachedAccessToken = typeof window !== "undefined" ? localStorage.getItem("subsnap_google_access_token") : null;
} catch (e) {}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const isGoogleUser = user.providerData.some(p => p.providerId === "google.com");
      if (isGoogleUser) {
        if (!cachedAccessToken) {
          try {
            cachedAccessToken = localStorage.getItem("subsnap_google_access_token");
          } catch (e) {}
        }
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else {
          if (onAuthSuccess) onAuthSuccess(user, "");
        }
      } else {
        // Email/Password authenticated user
        if (onAuthSuccess) onAuthSuccess(user, "");
      }
    } else {
      cachedAccessToken = null;
      try {
        localStorage.removeItem("subsnap_google_access_token");
      } catch (e) {}
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const emailSignUp = async (email: string, pass: string, name: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
};

export const emailSignIn = async (email: string, pass: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Google Auth Provider.");
    }

    cachedAccessToken = credential.accessToken;
    try {
      localStorage.setItem("subsnap_google_access_token", cachedAccessToken);
    } catch (e) {}
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken) {
    try {
      cachedAccessToken = localStorage.getItem("subsnap_google_access_token");
    } catch (e) {}
  }
  return cachedAccessToken;
};

export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    try {
      return await user.getIdToken();
    } catch (e) {
      console.error("Error getting user ID token:", e);
    }
  }
  return null;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  try {
    localStorage.removeItem("subsnap_google_access_token");
  } catch (e) {}
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};
