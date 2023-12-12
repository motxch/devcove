// src/components/ErrorPopup.js
import React from 'react';
import './ErrorPopup.css';

const ErrorPopup = ({ message }) => {
  return (
    <div className="error-popup">
      <p>{message}</p>
    </div>
  );
};

export default ErrorPopup;
