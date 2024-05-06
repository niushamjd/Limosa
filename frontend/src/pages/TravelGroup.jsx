import React, { useState, useEffect, useContext,useMemo } from 'react';
import { BASE_URL } from "../utils/config";
import { AuthContext } from '../context/AuthContext';
import "../styles/travel-group.css";
import defaultImg from "../assets/images/default.jpg";

function Message({ message, onClose }) {
    return (
      <div className="message-container">
       
        <div className="message-content">{message}</div>
      </div>
    );
}

function getMostFrequentInterest(commonInterests) {
  const interestCount = {};

  commonInterests.forEach((interest) => {
    interestCount[interest] = (interestCount[interest] || 0) + 1;
  });

  const mostFrequentInterest = Object.entries(interestCount).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["", 0]
  );

  return mostFrequentInterest[0];
}

function TravelGroup() {
  const { user } = useContext(AuthContext); // Access user info from context
  const [groupData, setGroupData] = useState({
    groupName: "",
    commonInterests: [],
    groupMates: [],
  });
  const [groups, setGroups] = useState([]); // State to hold user groups
  const [friends, setFriends] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [interests, setInterests] = useState([]); // All interests
  const [userInterests, setUserInterests] = useState([]); // Store the logged-in user's interests
  const [searchTerm, setSearchTerm] = useState('');

const sortedAndFilteredFriends = useMemo(() => {
  return friends
    .sort((a, b) => a.username.localeCompare(b.username))
    .filter(friend => friend.username.toLowerCase().includes(searchTerm.toLowerCase()));
}, [friends, searchTerm]);
  // Fetch interests for image lookup
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch(`${BASE_URL}/interests`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setInterests(data.data); // Store the fetched interests
        } else {
          throw new Error("Failed to fetch interests");
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchInterests(); // Fetch the list of interests on component mount
  }, []);

  useEffect(() => {
    if (showMessage || error) { // If there's a success message or an error
      const timer = setTimeout(() => {
        setShowMessage(false); // Hide success message
        setError(""); // Clear error
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer); // Clean up the timer if the component unmounts or the state changes
    }
  }, [showMessage, error]); // Trigger when showMessage or error changes


  // Function to get image based on interest
  const getInterestImage = (interestName) => {
    const interest = interests.find((i) => i.interestName === interestName);
    return interest ? `/interest-images/${interest.interestPhoto}` : defaultImg; // Default image if interest is not found
  };

  // Fetch existing groups
  const fetchGroups = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}/groups`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setGroups(data.data); // Store the groups in the state
      } else {
        throw new Error(data.message || "Failed to fetch groups");
      }
    } catch (error) {
      setError("Error fetching groups: " + error.message);
    }
  };

  useEffect(() => {
    fetchGroups(); // Fetch groups on component mount or when user ID changes
  }, [user._id]);

  // Handle changes to group name and friends
  const handleFriendChange = (friend) => {
    const isAlreadySelected = groupData.groupMates.some((gm) => gm.id === friend._id);
  
    const newGroupMates = isAlreadySelected
      ? groupData.groupMates.filter((gm) => gm.id !== friend._id) // Remove if already selected
      : [...groupData.groupMates, { id: friend._id, username: friend.username }]; // Add if not selected
  
    const allInterests = [
      ...new Set([
        ...userInterests, // Include logged-in user's interests
        ...extractFriendInterests(newGroupMates.map((f) => f.id)), // Include selected friends' interests
      ]),
    ];
  
    setGroupData((prevState) => ({
      ...prevState,
      groupMates: newGroupMates, // Set updated groupMates
      commonInterests: allInterests, // Set updated commonInterests
    }));
  };
  const deleteGroup = async (groupId) => {
    try {
        // Create a new array excluding the group to be deleted
        const updatedGroups = groups.filter(group => group._id !== groupId);

        // Send the updated array to the backend
        const response = await fetch(`${BASE_URL}/users/${user._id}/groups`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ groups: updatedGroups })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update groups");

        // Update local state to reflect the group deletion
        setGroups(updatedGroups);
        setSuccessMessage("Group deleted successfully");
        setShowMessage(true);
    } catch (error) {
        console.error("Failed to delete group:", error);
        setError(`Failed to delete group: ${error.message}`);
    }
};



  const extractFriendInterests = (selectedFriendIds) => {
    return friends
      .filter((friend) => selectedFriendIds.includes(friend._id))
      .flatMap((friend) => friend.interests);
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

    if (!groupData.groupName) errors.groupName = "Group name is required"; // Validate group name
    if (groupData.groupMates.length === 0) errors.friends = "Select at least one friend"; // Validate friend selection

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if form is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    // Validate if the group name is unique
  if (groups.some(group => group.groupName.toLowerCase() === groupData.groupName.toLowerCase())) {
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      groupName: "Group name already exists" // Add custom error message
    }));
    setError("Same group name already exists. Please choose a different name");
    return;
  }
    if (!validateForm()) {
      setError("Please ensure all required fields are filled out.");
      return;
    }

    const newGroup = {
      groupName: groupData.groupName,
      commonInterests: groupData.commonInterests,
      groupMates: groupData.groupMates.map(gm => ({
        id: gm.id,
        username: gm.username,
      })),
    };

    const formattedGroups = [...groups, newGroup]; // Optimistically add new group

    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}/groups`, { 
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groups: formattedGroups })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create travel group");

      setGroups(formattedGroups); // Confirm addition to state
      setSuccessMessage("Travel group created successfully");
      setShowMessage(true);
      window.scrollTo(0, 0); // Scroll to the top to show message
    } catch (error) {
      console.error("Error creating travel group:", error);
      setError(`Error creating travel group: ${error.message}`);
      setGroups(groups.filter(group => group.groupName !== newGroup.groupName)); // Revert on failure
    }
};


  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${user._id}/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          if (jsonResponse.success) {
            setFriends(jsonResponse.data); // Store the full friend objects
          } else {
            throw new Error(jsonResponse.message);
          }
        } else {
          throw new Error("Failed to fetch friends");
        }
      } catch (error) {
        setError("Error fetching friends: " + error.message);
      }
    };

    fetchFriends(); // Fetch friends on component mount
  }, [user._id]); // Fetch on user ID change


  return (
    <>
      {error && <Message message={error} onClose={() => setError("")} />}
      {showMessage && <Message message={successMessage} onClose={() => setShowMessage(false)} />} 

      <div className="split-container"> {/* Container for splitting the screen */}
        <div className="left-section"> {/* Left side for "Your Trips" */}
      <div className="existing-groups">
          <h3>Your Travel Groups:</h3>
          <div className="group-grid">
          {groups.map((group) => (
    <div key={group._id} className="group-card">
        <img src={getInterestImage(getMostFrequentInterest(group.commonInterests))}
             alt={getMostFrequentInterest(group.commonInterests)} />
        <p className='groupName'><strong>{group.groupName}</strong></p>
        Group mates:
        <ul>
            {group.groupMates.map(gm => (
                <li key={gm.id}>{gm.username}</li>
            ))}
        </ul>
        <ul>
            {group.commonInterests.map((interest, index) => (
                <li key={index}>{interest}</li>
            ))}
        </ul>
        <div className="submit-container">
        <button className='submit' onClick={() => deleteGroup(group._id)}>Delete Group</button>
        </div>
    </div>
))}
</div>

      </div>
      </div>
      <div className="right-section">
        <h2>Create a Travel Group</h2>
        <form className='group' onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="groupName">Group Name:</label>
            <input type="text" id="groupName" name="groupName" value={groupData.groupName} onChange={handleChange} className={validationErrors.groupName ? 'input-error' : ''} />
          </div>
          <div className="form-group">
            <label>Search Friends:</label>
            <input
              type="text"
              placeholder="Search by name..."
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
  <label>Select Friends:</label>
  {sortedAndFilteredFriends.map(friend => (
    <div key={friend._id} className="checkbox-container">
      <input
        type="checkbox"
        checked={groupData.groupMates.some(gm => gm.id === friend._id)}
        onChange={() => handleFriendChange(friend)}
      />
      <label>{friend.username}</label>
    </div>
  ))}
</div>

          <div className="submit-container">
            <button type="submit" className="submit">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
}

export default TravelGroup;
