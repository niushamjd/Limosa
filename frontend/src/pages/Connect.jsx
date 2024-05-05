import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import FriendModal from './FriendModal';
import "../styles/connect.css";
import { debounce } from 'lodash'; // Make sure to install lodash, use `npm install lodash`
import "../styles/modal.css";
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
  const [friendRequests, setFriendRequests] = useState([]);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false); // State to manage the not found message
  const [selectedFriend, setSelectedFriend] = useState(null); // Selected friend for the modal
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal open/close state
const [filteredUsers, setFilteredUsers] = useState([]); // Define filteredUsers state variable
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const location = useLocation();
  
  const openModal = (friend) => {
    setSelectedFriend(friend); // Set the selected friend
    setModalIsOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalIsOpen(false); // Close the modal
  };
  
  const handleSearchChange = (value) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  };

  const filterUsers = () => {
    const filtered = users.filter(user => user.email.toLowerCase().includes(searchTerm));
    setFilteredUsers(filtered);
  
    // Check if search term is not empty and no users are found
    if (searchTerm !== '' && filtered.length === 0) {
      setShowNotFoundMessage(true);
      setTimeout(() => {
        setShowNotFoundMessage(false);
      }, 1500);
    } else {
      setShowNotFoundMessage(false); // Hide the message if users are found or search term is empty
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setUsers(jsonResponse.data);
        filterUsers(); // Filter users after fetching them
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      setErrorMessage('Error fetching users: ' + error.message);
    }
  }, []);

  
 useEffect(() => {
  const fetchData = async () => {
    await fetchUsers(); // Kullanıcıları getir
    setSearchTerm(''); // Arama terimini boş bir dize olarak ayarla
  };

  fetchData();
}, []);

useEffect(() => {
  // This effect runs on the initial mount and every time the location changes
  if (location.hash === '#friendRequestsSection') {
    const section = document.getElementById('friendRequestsSection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}, [location.hash]); 

  
  // Pagination controls
  const lastPageIndex = currentPage * itemsPerPage;
  const firstPageIndex = lastPageIndex - itemsPerPage;
  const currentUsers = filteredUsers.slice(firstPageIndex, lastPageIndex);
  const total_pages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentFilteredUsers = filteredUsers.slice(firstPageIndex, lastPageIndex);
  const totalFilteredPages = Math.ceil(filteredUsers.length / itemsPerPage);


  const lastFilteredIndex = currentPage * itemsPerPage;
  const firstFilteredIndex = lastFilteredIndex - itemsPerPage;
  
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    handleSearchChange(e.target.value); // Update search term on input change
  };
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
  }, [user._id]);

  useEffect(() => {
    fetchFriends();
  }, [user._id, fetchFriends]);
  const fetchFriendRequests = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}/friend-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
          setFriendRequests(jsonResponse.data);
        } else {
          throw new Error(jsonResponse.message);
        }
      } else {
        throw new Error('Failed to fetch friend requests');
      }
    } catch (error) {
      setErrorMessage('Error fetching friend requests: ' + error.message);
    }
  }, [user._id]);

  useEffect(() => {
    fetchFriendRequests();
  }, [user._id, fetchFriendRequests]);
  
  
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
        setSuccessMessage(isFriend ? "Unfollowed successfully!" : "Follow request sent successfully!");
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

  const handleUserRequest = async (requestId, action) => {
    if (action === 'accept') {
      // Accepting the friend request
      try {
        const response = await fetch(`${BASE_URL}/users/${user._id}/connect`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friendId: requestId,
            action: 'accept'
          })
        });
  
        if (response.ok) {
          setSuccessMessage("Follow request accepted successfully!");
  
          // Update friends and friendRequests state
          const updatedFriendRequests = friendRequests.filter(request => request._id !== requestId);
          setFriendRequests(updatedFriendRequests);
  
          // Optionally, add the user to friends if needed
          const friendData = friendRequests.find(request => request._id === requestId);
          if (friendData) {
            setFriends([...friends, friendData]);
          }
          
          fetchFriends(); // Optionally refresh friends list
        } else {
          const result = await response.json();
          throw new Error(result.message);
        }
      } catch (error) {
        setErrorMessage(`Error accepting friend request: ${error.message}`);
      }
    } else if (action === 'decline') {
      // Declining the friend request
      try {
        const response = await fetch(`${BASE_URL}/users/${user._id}/friend-requests`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestId: requestId,
            action: 'remove'
          })
        });
  
        if (response.ok) {
          setSuccessMessage("Follow request declined successfully!");
  
          // Update friendRequests state to remove the declined request
          const updatedFriendRequests = friendRequests.filter(request => request._id !== requestId);
          setFriendRequests(updatedFriendRequests);
          
        } else {
          const result = await response.json();
          throw new Error(result.message);
        }
      } catch (error) {
        setErrorMessage(`Error declining friend request: ${error.message}`);
      }
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
          setUsers(jsonResponse.data); // Tüm kullanıcıları direkt olarak güncelle
          setFilteredUsers(jsonResponse.data); // Filtrelenmiş kullanıcıları da güncelle
        } else {
          throw new Error('Data is not an array or success flag is false');
        }
      } else {
        throw new Error('Failed to fetch users');
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="connect-users-container">
       {showNotFoundMessage && (
        <Message message="User not found" onClose={() => setShowNotFoundMessage(false)} />
      )}
      {errorMessage && <Message message={errorMessage} onClose={() => setErrorMessage("")} />}
      {successMessage && <Message message={successMessage} onClose={() => setSuccessMessage("")} />}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search users by email"
          className="search-input"
        />
        <button onClick={filterUsers} className="search-button">Search</button>
      </div>
      <h2 className="connect-users-header">Connect with Users</h2>
      <div className='user'>
      {searchTerm === '' ? (
          // If search term is empty, render paginated users
          currentUsers.map((userItem) => (
            <div key={userItem._id} className="user-card">
              <div className="user-details">
                <span className="user-name">{userItem.username}</span>
              </div>
              <button className="interaction-button" onClick={() => handleUserInteraction(userItem._id)}>
                {friends.some(friend => friend._id === userItem._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
            
          ))
        ) : (
          // If search term is not empty, render filtered users
          currentFilteredUsers.map((userItem) => (
            <div key={userItem._id} className="user-card">
              <div className="user-details">
                <span className="user-name">{userItem.username}</span>
              </div>
              <button className="interaction-button" onClick={() => handleUserInteraction(userItem._id)}>
                {friends.some(friend => friend._id === userItem._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))
        )}
    </div>
     {/* Pagination controls */}
{searchTerm === '' ? (
  <div className="pagination">
    {Array.from({ length: total_pages }, (_, index) => (
      <button key={index + 1} onClick={() => paginate(index + 1)}>
        {index + 1}
      </button>
    ))}
  </div>
) : (
  <div className="pagination">
    {Array.from({ length: totalFilteredPages }, (_, index) => (
      <button key={index + 1} onClick={() => paginate(index + 1)}>
        {index + 1}
      </button>
    ))}
  </div>
)}
    <br />
     <h2 className="friends-header">My Friends</h2>
    <div className="friends-container">
      {friends.map((friend) => (
        
        <div key={friend._id} className="friend-card" onClick={() => openModal(friend)}>
          <div className="friend-details">
            <h3 className="friend-name">{friend.username}</h3>
          

          </div>
        </div>
      ))}
    </div>
     {/* Modal component */}
     <FriendModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        friend={selectedFriend} // Pass the selected friend
      />
  
    <h2 className="friend-requests-header" id="friendRequestsSection">Friend Requests</h2>
<div className="friends-container">
  {friendRequests.map((request) => (
    <div key={request._id} className="friend-card">
      <div className="friend-details">
        <h3 className="friend-name">{request.username}</h3>
        <p className="friend-email">{request.email}</p>
        <button onClick={() => handleUserRequest(request._id, 'accept')} className="interaction-button accept">
          Accept
        </button>
        <button onClick={() => handleUserRequest(request._id, 'decline')} className="interaction-button decline">
          Decline
        </button>
      </div>
    </div>
  ))}
</div>

  </div>
  
  );
}

export default Connect;
