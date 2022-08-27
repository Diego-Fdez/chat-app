import { useState, useEffect } from 'react';
import firebase from '../config/firebase';

const useAuth = () => {
  const [userAuth, setUserAuth] = useState(null);
  /* A hook that is listening for changes in the authentication state. */
  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        setUserAuth(user);
      } else {
        setUserAuth(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return userAuth;
};

export default useAuth;
