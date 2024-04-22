import React, { useState, useEffect, useContext } from 'react';
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';
import "../styles/travel-group.css";

function Message({ message, onClose }) {
    return (
      <div className="message-container">
        <button onClick={onClose}>Close</button>
        <div className="message-content">{message}</div>
      </div>
    );
}

function TravelGroup() {
  const { user } = useContext(AuthContext);
  const [groupData, setGroupData] = useState({
    groupName: "",
    commonInterests: [],
    groupMates: []
  });
  const [groups, setGroups] = useState([]); // State to hold user groups
  const [friends, setFriends] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

    const fetchGroups = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${user._id}/groups`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (response.ok) {
          setGroups(data.data); // Assuming the backend sends the groups under a 'groups' key
        } else {
          throw new Error(data.message || 'Failed to fetch groups');
        }
      } catch (error) {
        setError('Error fetching groups: ' + error.message);
      }
    };
    
    useEffect(() => {
      fetchGroups();
    }, [user._id]); // Fetch groups when the component mounts or user id changes



  const handleFriendChange = (friend) => {
    // Determine if the friend is already selected
    const isAlreadySelected = groupData.groupMates.some(gm => gm.id === friend._id);

    // If already selected, remove them, otherwise add them
    const newFriends = isAlreadySelected
        ? groupData.groupMates.filter(gm => gm.id !== friend._id)
        : [...groupData.groupMates, { id: friend._id, username: friend.username }];

    // Update state with the new list of group mates
    setGroupData(prevState => ({
        ...prevState,
        groupMates: newFriends,
        commonInterests: [...new Set([...prevState.commonInterests, ...extractFriendInterests(newFriends.map(f => f.id))])]
    }));
};



  const extractFriendInterests = (selectedFriendIds) => {
    return friends.filter(friend => selectedFriendIds.includes(friend._id))
                  .flatMap(friend => friend.interests);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!groupData.groupName) errors.groupName = "Group name is required";
    if (groupData.groupMates.length === 0) errors.friends = "Select at least one friend";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please ensure all required fields are filled out.");
      return;
    }
  
    const formattedGroupData = {
      groupName: groupData.groupName,
      commonInterests: groupData.commonInterests,
      groupMates: groupData.groupMates.map(gm => ({
        id: gm.id,  // Ensure this is the MongoDB ObjectId of the user
        username: gm.username  // Ensure this is the username of the user
      }))
    };
    
    try {
      console.log('formattedGroupData:', formattedGroupData);
      const response = await fetch(`${BASE_URL}/users/${user._id}/groups`, {  // Ensure the endpoint is correct
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groups: [formattedGroupData] }),  // Ensure this is an array if your schema expects an array
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Travel group created successfully");
        setShowMessage(true);
        window.scrollTo(0, 0);
        fetchGroups(); // Fetch the updated groups
      } else {
        console.error('Failed to create travel group:', data);
        setError(`Failed to create travel group: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating travel group:', error);
      setError(`Error creating travel group: ${error.message}`);
    }
};

  



  useEffect(() => {
    const fetchFriends = async () => {
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
        setError('Error fetching friends: ' + error.message);
      }
    };

    fetchFriends();
  }, [user._id]);


  return (
    <>
      {error && <Message message={error} onClose={() => setError("")} />}
      {showMessage && <Message message={successMessage} onClose={() => setShowMessage(false)} />}
      <div className="existing-groups">
          <h3>Your Travel Groups:</h3>
          {groups.map(group => (
            <div key={group.id} className="group-item">
              <p>{group.groupName}</p>
              <ul>
                {group.commonInterests.map(interest => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
              Group mates:
              <ul>
                {group.groupMates.map(gm => (
                  <li key={gm.id}>{gm.username}</li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      <h2>Create a Travel Group</h2>
      <form className='group' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="groupName">Group Name:</label>
          <input type="text" id="groupName" name="groupName" value={groupData.groupName} onChange={handleChange} className={validationErrors.groupName ? 'input-error' : ''} />
          {validationErrors.groupName && <p className="error-message">{validationErrors.groupName}</p>}
        </div>
        <div className="form-group">
          <label>Select Friends:</label>
          {friends.map(friend => (
    <div key={friend._id}>
        <label>
            <input 
                type="checkbox"
                checked={groupData.groupMates.some(gm => gm.id === friend._id)}
                onChange={() => handleFriendChange(friend)}
            />
            {friend.username}
        </label>
    </div>
))}

          {validationErrors.friends && <p className="error-message">{validationErrors.friends}</p>}
        </div>
        <div className="submit-container">
          <button type="submit" className="submit">Create Group</button>
        </div>
      </form>
    </>
  );
}

export default TravelGroup;