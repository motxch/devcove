// src/hooks/auth.js
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../firebase';

const useAuth = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const authInstance = getAuth(firebaseApp);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setAuth({ user });
    });

    return () => unsubscribe();
  }, []);

  return auth;
};

export default useAuth;
