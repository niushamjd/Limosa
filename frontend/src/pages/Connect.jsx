import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';
import "../styles/connect.css";

function Message({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Call onClose after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup function to clear the timer on unmount
  }, [onClose]);

  return (
    <div className="message-container">
      <div className="message-content">
        {message}
      </div>
    </div>
  );
}

function Connect() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFriends = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}/friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
          setFriends(jsonResponse.data); // Store the full friend objects
        } else {
          throw new Error(jsonResponse.message);
        }
      } else {
        throw new Error('Failed to fetch friends');
      }
    } catch (error) {
      setErrorMessage('Error fetching friends: ' + error.message);
    }
  }, [user._id]);

  useEffect(() => {
    fetchFriends();
  }, [user._id, fetchFriends]);

  const handleUserInteraction = async (connectUserId) => {
    const isFriend = friends.some(friend => friend._id === connectUserId);
    const endpoint = `${BASE_URL}/users/${user._id}/connect`; // Always use /connect for both follow and unfollow
  
    try {
      const response = await fetch(endpoint, {
        method: 'PUT', // Always use PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendId: connectUserId,
          action: isFriend ? 'unfollow' : 'follow' // Specify the action in the body
        })
      });
  
      if (response.ok) {
        setSuccessMessage(isFriend ? "Unfollowed successfully!" : "Followed successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          fetchFriends(); // Refresh the friends list after a successful interaction
        }, 1500);
      } else {
        const result = await response.json();
        throw new Error(result.message || `Failed to ${isFriend ? 'unfollow' : 'follow'} user`);
      }
    } catch (error) {
      setErrorMessage(`Error ${isFriend ? 'unfollowing' : 'following'} user: ` + error.message);
    }
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
            setUsers(jsonResponse.data);
          } else {
            throw new Error('Data is not an array or success flag is false');
          }
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        setErrorMessage('Error fetching users: ' + error.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="connect-users-container">
    {errorMessage && <Message message={errorMessage} onClose={() => setErrorMessage("")} />}
{successMessage && <Message message={successMessage} onClose={() => setSuccessMessage("")} />}


      <h2 className="connect-users-header">Connect with Users</h2>
      <div>
        {users.map((userItem) => (
          <div key={userItem._id} className="user-card">
            <div className="user-details">
              <span className="user-name">{userItem.username}</span>
            </div>
            <button className="interaction-button" onClick={() => handleUserInteraction(userItem._id)}>
              {friends.some(friend => friend._id === userItem._id) ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
      <h2 className="friends-header">My Friends</h2>
      <div className="friends-container">
        {friends.map((friend) => (
          <div key={friend._id} className="friend-card">
            <div className="friend-details">
              <h3 className="friend-name">{friend.username}</h3>
              <p className="friend-email">{friend.email}</p>
            </div>
            {/* Additional friend details can be added here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Connect;
