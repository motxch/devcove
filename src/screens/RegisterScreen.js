// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { firebaseApp } from '../firebase';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Set the display name in Firebase Authentication
      await updateProfile(user, {
        displayName: name, // Replace with the actual value from your registration form
      });

      // Send email verification
      await sendEmailVerification(user);

      console.log('Registration successful. Verification email sent.');
      setError(null);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration error:', error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
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
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Link to Login Screen */}
      <p>
        Already have an account?{' '}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterScreen;
