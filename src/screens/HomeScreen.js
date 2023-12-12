// src/screens/HomeScreen.js
import React from 'react';
import { Link } from 'react-router-dom';
import Feed from '../components/feed'; // Import the Feed component
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-screen-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Left Sidebar for Pages */}
      
      <div style={{ width: '20%', borderRight: '1px solid #ccc', padding: '10px', }}>
      <h2>Inbox</h2>
        <ul className='left-sidebar'>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/connections">Connections List</Link>
          </li>
          <li>
            <Link to="/willow">Willow AI Chatbot</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
      
      {/* Middle Section for Feed */}
      <div style={{ width: '60%', padding: '5px', marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Your Feed</h2>
        <Feed />{/* Placeholder content for the feed */}
      </div>


      {/* Right Sidebar for Direct Messages */}
      <div style={{ width: '20%', borderLeft: '1px solid #ccc', padding: '10px', listStyle: 'none' }}>
        <h2>Inbox</h2>
        <ul className='right-sidebar'>
          <li>
            <Link to="/messages/user1">User 1</Link>
          </li>
          <li>
            <Link to="/messages/user2">User 2</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomeScreen;
