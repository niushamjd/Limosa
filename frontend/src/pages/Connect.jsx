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
// Fetch connected friends details
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
          setFriends(jsonResponse.data);
        } else {
          throw new Error(jsonResponse.message);
        }
      } else {
        throw new Error('Failed to fetch friends');
      }
    } catch (error) {
      setErrorMessage('Error fetching friends: ' + error.message);
    }
  }, [user._id]); // Dependency on user._id

  // Effect to fetch friends once or on user._id change
  useEffect(() => {
    if (user._id) {
      fetchFriends();
    }
  }, [user._id, fetchFriends]);
    if (user._id) {
      fetchFriends();
    }

  // Function to handle user connection
  const connectUser = async (connectUserId) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}/connect`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: connectUserId })
      });
      if (response.ok) {
        setSuccessMessage("Connected successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          fetchFriends(); // Refresh the friends list after a successful connection
        }, 1500);
      } else {
        throw new Error('Failed to connect with user');
      }
    } catch (error) {
      setErrorMessage('Error connecting user: ' + error.message);
    }
  };
  // Fetch all users from the database
  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const response = await fetch(`${BASE_URL}/users/${user._id}`, {
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
            {userItem.username} - <button onClick={() => connectUser(userItem._id)}>Connect</button>
          </div>
        ))}
      </div>
      <h2>My Friends</h2>
      <div>
        {friends.map((friend) => (
          <div key={friend._id}>
            <h3>{friend.username}</h3>
            <p>{friend.email}</p>
            {/* Add more details such as photo, interests, etc., as needed */}
          </div>
        ))}
      </div>
    </>
  );
}

export default Connect;
