// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import HomeScreen from '../src/screens/HomeScreen';
import ConnectionsList from './screens/connections';
import WillowAIChatbot from './screens/willow';
import Profile from './screens/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/connections" element={<ConnectionsList />} /> 
        <Route path="/willow" element={<WillowAIChatbot />} />
        <Route path="/profile" element={<Profile />} />
        {/* Default route for unmatched paths */}
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
