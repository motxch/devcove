import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const auth = getAuth(firebaseApp);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      setError(null);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error.message);

      if (error.code === 'auth/user-not-found') {
        setError('User not found. Please check your email or register.');
      } else {
        setError(error.message);
      }
    }
  };



  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    {/* Display error message if there is an error */}
    {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Link to Register Screen */}
      <p>
        Don't have an account?{' '}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginScreen;
