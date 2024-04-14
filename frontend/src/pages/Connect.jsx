import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';

function Message({ message, onClose }) {
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
    <>
      {errorMessage && <Message message={errorMessage} />}
      {successMessage && <Message message={successMessage} />}
      <h2>Connect with Users</h2>
      <div>
      {users.map((userItem) => (
    <div key={userItem._id}>
        {userItem.username} - <button onClick={() => handleUserInteraction(userItem._id)}>
            {friends.some(friend => friend._id === userItem._id) ? 'Unfollow' : 'Follow'}
        </button>
    </div>
))}

      </div>
      <h2>My Friends</h2>
<div>
  {friends.map((friend) => (
    <div key={friend._id}>
      <h3>{friend.username}</h3>
      <p>{friend.email}</p>
      {/* Additional friend details can be added here */}
    </div>
  ))}
</div>

    </>
  );
}

export default Connect;
