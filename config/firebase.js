import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from '@firebase/storage';

/* This is the configuration object that is used to initialize the Firebase app. */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

class Firebase {
  /**
   * The constructor function is a special function that is called when an object is created from a
   * class.
   */
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  /**
   * This function will create a new GoogleAuthProvider object, and then use that object to sign in
   * with a popup window.
   * @returns The signInWithPopup() method returns a Promise.
   */
  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  /**
   * This function will sign out the user from the Firebase Authentication service.
   */
  async closeSession() {
    await this.auth.signOut();
  }
}

const firebase = new Firebase();
export default firebase;
