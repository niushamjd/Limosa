import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote"; // Import the calendar icon
import ReactStars from "react-rating-stars-component"; // Star rating component
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import "../styles/ItineraryGrid.css";
import TextField from "@mui/material/TextField";

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
    return new Date(isoDateString).toLocaleDateString('en-GB', {
      day: '2-digit',      // Use two digits for the day
      month: 'short',      // Use the abbreviated form of the month
      year: 'numeric'      // Use the full numeric year
    });
  };
  

  const onRatingChange = async (newRating, itineraryId) => {
    try {
      await saveChanges(itineraryId, { rate: newRating });
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (editState.rate !== undefined && editState._id) {
      saveChanges(editState._id);
    }
  }, [editState]);

  const formatDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    // Check if start and end date are the same day
    if (startDate.toDateString() === endDate.toDateString()) {
      return "1 Day"; // Or "Same Day" if you prefer
    }
  
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return `${duration} Days`;
  };

  const fetchItineraries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/itinerary/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setItineraryData(data.data);
        if (editState._id) {
          const editedItinerary = data.data.find(
            (itinerary) => itinerary._id === editState._id
          );
          if (editedItinerary) {
            setEditState((prevState) => ({
              ...prevState,
              rate: editedItinerary.rate || 0,
            }));
          }
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItineraries();
  }, [userId]);

  const getCityImage = (cityName) => {
    // Generate a random number between 1 and 4
    const randomNum = Math.floor(Math.random() * 4) + 1;
  
    // Replace spaces with "-" and append a random number
    const formattedCityName = `${cityName.replace(/ /g, '-')}-${randomNum}`;
    console.log("Formatted city name:", formattedCityName); 
  
    let imageSrc;
  
    try {
      // Attempt to dynamically load the corresponding image
      imageSrc = require(`../assets/images/${formattedCityName}.jpg`);
    } catch (err) {
      // If the image is not found, use a default image
      imageSrc = require("../assets/images/default.jpg");
    }
  
    return imageSrc;
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

  /*
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
  */

  const startEditing = (itineraryId) => {
    const itinerary = itineraryData.find((it) => it._id === itineraryId);
    setEditState({
      ...itinerary,
      editing: true,
    });
  };

  const handleChange = (e, field) => {
    setEditState({
      ...editState,
      [field]: e.target.value,
    });
  };

  const saveChanges = async (itineraryId, changes) => {
    try {
      console.log("Saving changes:", changes);
      const response = await fetch(`${BASE_URL}/itinerary/${itineraryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleSaveChanges = (itineraryId) => {
    const itinerary = itineraryData.find((it) => it._id === itineraryId);
    saveChanges(itineraryId, { name: itinerary.name });
    setEditState({});
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
      {itineraryData.map((itinerary, index) => {
        const imageSrc = getCityImage(itinerary.city); // Şehir adına göre resmi al

        return (
          <Card key={index} sx={{ maxWidth: 345 }}>
            {" "}
            {/* Card Component */}
            <CardMedia
              component="img"
              height="190"
              image={imageSrc}
              alt={`Image for ${itinerary.city}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {itinerary.city}, Turkey
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5,  fontSize: '1.1rem' }}>
                <EventNoteIcon sx={{ color: "orange" }} />
                <Typography variant="body2" color="text.secondary"  sx={{ fontSize: '1.1rem', fontWeight:"bold"}}>
                  {formatEventDate(itinerary.dateRange.start)} ·{" "}
                  {formatDuration(
                    itinerary.dateRange.start,
                    itinerary.dateRange.end
                  )}
                </Typography>
              </Box>
              {editState._id === itinerary._id && editState.editing ? (
                <TextField
                  size="small"
                  variant="outlined"
                  value={itinerary.name}
                  onChange={(e) => handleChange(e, itinerary._id)}
                  sx={{ width: "100%", my: 1 }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem', paddingBottom: "6px"}} >
                  {itinerary.name}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem', paddingBottom: "6px"}}>
                <span style={{ fontWeight: "bold" }}>Group:</span>{" "}
                {itinerary.group}
              </Typography>
              <Typography variant="body2" color="text.secondary"  sx={{ fontSize: '1.1rem', paddingBottom: "6px"}}>
                <span style={{ fontWeight: "bold" }}>Budget:</span>{" "}
                {itinerary.budget}
              </Typography>

              <ReactStars
                count={5} // Number of stars
                value={itinerary.rate || 0} // Use itinerary.rate instead of itineraryData.rate
                size={24} // Size of stars
                activeColor="#ffd700" // Color when active
                onChange={(newRating) =>
                  onRatingChange(newRating, itinerary._id)
                } // Event handler for changes
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: "1rem",
                  mt: 2,
                }}
              >
                {" "}
                {/* Box to contain buttons */}
                <Button
                  variant="contained"
                  className="btn primary__btn"
                  onClick={() => deleteItinerary(itinerary._id)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  className="btn primary__btn"
                  onClick={() => startEditing(itinerary._id)}
                >
                  Modify
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
export default ViewPastItinerary;


