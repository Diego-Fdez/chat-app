import '../styles/globals.css';
import Login from './login';
import firebase, { FirebaseContext } from '../config';
import useAuth from '../hooks/useAuth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const user = useAuth();

  /* Checking if the user is logged in, if so it will add the user to the database. */
  useEffect(() => {
    if (user) {
      const handleAddUser = async () => {
        try {
          await setDoc(doc(firebase.db, 'users', user.uid), {
            email: user.email,
            lastSee: serverTimestamp(),
            photoURL: user.photoURL,
          });
        } catch (error) {
          console.log(error);
        }
      };
      handleAddUser();
    }
  }, [user]);

  if (!user) return <Login />;

  return (
    <FirebaseContext.Provider value={{ firebase, user }}>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
}

export default MyApp;
