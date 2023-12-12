// src/components/ImageModal.js
import React from 'react';
import PropTypes from 'prop-types';
import './ImageModal.css'; // Create a new CSS file for styling the modal

const ImageModal = ({ selectedImage, onClose }) => {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={selectedImage} alt="Modal" className="rounded-image" />
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  selectedImage: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageModal;
