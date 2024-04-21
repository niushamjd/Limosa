import React from 'react';
import "../styles/modal.css"// Ensure this import path is correct

function FriendModal({ isOpen, onClose, friend }) {
  if (!isOpen) return null; // Don't render if the modal isn't open

  const handleEmailClick = () => {
    window.location.href = `mailto:${friend.email}`; // Opens the email client
  };

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Modal overlay with closing on click */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevents modal from closing when clicking inside */}
        <h3>{friend.username}</h3> {/* Friend's name */}
        <p>Email: <span className="modal-email" onClick={handleEmailClick}>{friend.email}</span></p> {/* Clickable email */}
        <p>Interests: {friend.interests.join(", ")}</p> {/* Friend's interests */}
        <button className="modal-close-button" onClick={onClose}>Close</button> {/* Close button */}
      </div>
    </div>
  );
}

export default FriendModal;
