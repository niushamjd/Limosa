import React, { useEffect, useState, useContext } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import ReactStars from "react-rating-stars-component"; // Star rating component
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import funImage from "../assets/images/rome, italy.jpg";
import "../styles/ItineraryGrid.css";

function ViewPastItinerary() {
  const { user } = useContext(AuthContext);
  const userId = user._id;
  const [itineraryData, setItineraryData] = useState([]);
  const [editState, setEditState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //console.log("Itinerary data:", itineraryData);
    fetchItineraries();
  }, [userId]);

  const formatEventDate = (isoDateString) => {
    return new Date(isoDateString).toLocaleDateString();
  };

  const onRatingChange = (newRating, itineraryId) => {
    console.log("New rating:", newRating);
    // You can send the new rating to your backend or update the state
  };

  const formatDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} Days`;
  };

  const fetchItineraries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/itinerary/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setItineraryData(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const deleteItinerary = async (itineraryId) => {
    try {
      const response = await fetch(`${BASE_URL}/itinerary/${itineraryId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setItineraryData(
          itineraryData.filter((itinerary) => itinerary._id !== itineraryId)
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error);
    }
  };

  const startEditing = (itineraryId) => {
    const itinerary = itineraryData.find((it) => it._id === itineraryId);
    setEditState({
      _id: itinerary._id,
      name: itinerary.name || "", // Ensure default empty string if undefined
      tips: itinerary.tips || "", // Ensure default empty string if undefined
      rate: itinerary.rate || 0, // Ensure default 0 if undefined
      editing: true,
    });
  };

  const handleChange = (e, field) => {
    setEditState({
      ...editState,
      [field]: e.target.value,
    });
  };

  const saveChanges = async (itineraryId) => {
    try {
      const response = await fetch(`${BASE_URL}/itinerary/${itineraryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editState.name,
          tips: editState.tips,
          rate: editState.rate
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchItineraries();
        setEditState({}); // Reset edit state
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error);
    }
  };

  const cancelEditing = () => {
    setEditState({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading itineraries: {error.message}</div>;
  }

  return (
    <div className="itinerary-grid">
      {itineraryData.map((itinerary, index) => (
        <Card key={index} sx={{ maxWidth: 345 }}>
          {" "}
          {/* Card Component */}
          <CardMedia
            component="img"
            height="140"
            image={funImage} // The photo imported
            alt="Itinerary Photo"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {itinerary.city}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`Group: ${itinerary.group}`} {/* Display group */}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`Budget: ${itinerary.budget}`} {/* Display budget */}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`Duration: ${formatDuration(
                itinerary.dateRange.start,
                itinerary.dateRange.end
              )}`}{" "}
              {/* Display duration */}
            </Typography>
            <ReactStars
              count={5} // Number of stars
              value={0} // Initial value
              size={24} // Size of stars
              activeColor="#ffd700" // Color when active
              onChange={(newRating) => onRatingChange(newRating, itinerary._id)} // Event handler for changes
            />
            <Box
               sx={{ display: "flex", justifyContent: "flex-start", gap: "1rem", mt: 2 }}
            >
              {" "}
              {/* Box to contain buttons */}
              <Button
                variant="contained"
                className="btn primary__btn"
                onClick={() => deleteItinerary(itinerary._id)}
              >
                Delete Itinerary
              </Button>
              <Button
                variant="contained"
                className="btn primary__btn"
                onClick={() => startEditing(itinerary._id)}
              >
                Modify Itinerary
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ViewPastItinerary;
