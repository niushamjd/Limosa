import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReactStars from "react-rating-stars-component";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import "../styles/ItineraryGrid.css";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

function ViewPastItinerary() {
  const navigate = useNavigate();
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
    return new Date(isoDateString).toLocaleDateString("en-GB", {
      day: "2-digit", // Use two digits for the day
      month: "short", // Use the abbreviated form of the month
      year: "numeric", // Use the full numeric year
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

    const duration =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return `${duration} Days`;
  };

  const fetchItineraries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/itinerary/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setItineraryData(data.data);
        console.log("Fetched data:", data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError(error);
    }
    setIsLoading(false);
  };
  

  useEffect(() => {
    fetchItineraries();
  }, [userId]);

  const handleEditToggle = (itineraryId) => {
    const itinerary = itineraryData.find(it => it._id === itineraryId);
    if (editState._id === itineraryId && editState.editing) {
      // If already editing, clicking Modify should toggle off editing and save changes
      handleSaveChanges(itineraryId);
    } else {
      setEditState({
        ...itinerary,
        editing: true,
        notes: itinerary.notes || '',
      });
    }
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
      ...itinerary,
      editing: true,
    });
  };

  const handleChange = (e) => {
    setEditState(prevState => ({
      ...prevState,
      notes: e.target.value,
    }));
  };

  const saveChanges = async (itineraryId, changes) => {
    try {
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
      } else {
        console.log("Changes saved successfully:", data);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      setError(error);
    }
  };
  

  const handleSaveChanges = async (itineraryId) => {
    try {
      const response = await fetch(`${BASE_URL}/itinerary/${itineraryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: editState.notes }),
      });
      const data = await response.json();
      if (data.success) {
        setItineraryData(itineraryData.map(it =>
          it._id === itineraryId ? { ...it, notes: editState.notes } : it
        ));
        setEditState({});
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
    return <LoadingScreen />; // isLoading true ise LoadingScreen komponentini göster
  }
  if (error) {
    return <div>Error loading itineraries: {error.message}</div>;
  }

  const handleCardClick = (itineraryId) => {
    navigate(`/viewpastitinerary/${itineraryId}`);
  };

  return (
    <div className="itinerary-grid">
      {itineraryData.map((itinerary, index) => {
        const imageSrc = itinerary.photo;
        const isEditing = editState._id === itinerary._id && editState.editing;
        return (
          <Card
            key={index}
            sx={{ maxWidth: 345, cursor: "pointer" }}
            onClick={() => handleCardClick(itinerary._id)}
          >
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "1.1rem",
                }}
              >
                <EventNoteIcon sx={{ color: "orange" }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                >
                  {formatEventDate(itinerary.dateRange.start)} ·{" "}
                  {formatDuration(
                    itinerary.dateRange.start,
                    itinerary.dateRange.end
                  )}
                </Typography>
              </Box>
              {isEditing ? (
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="enter your notes here..."
                  value={editState.notes}
                  onChange={handleChange}
                  onClick={(e) => e.stopPropagation()}
                  multiline
                  rows={2}
                  maxRows={4}
                  sx={{
                    width: "100%",
                    my: 1,
                  }}
                  inputProps={{
                    maxLength: 20 
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem", paddingBottom: "3px" }}
                >
                  {itinerary.notes || "Click the Modify button to enter a note"}
                </Typography>
              )}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "1.1rem", paddingBottom: "3px" }}
              >
                <span style={{ fontWeight: "bold" }}>Group:</span>{" "}
                {itinerary.group}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "1.1rem", paddingBottom: "3px" }}
              >
                <span style={{ fontWeight: "bold" }}>Budget:</span>{" "}
                {itinerary.budget}
              </Typography>
              <div onClick={(e) => e.stopPropagation()}>
                <ReactStars
                  count={5}
                  value={itinerary.rate || 0}
                  size={24}
                  activeColor="#ffd700"
                  onChange={(newRating) =>
                    onRatingChange(newRating, itinerary._id)
                  }
                />
              </div>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: "1rem",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  className="btn primary__btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItinerary(itinerary._id);
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  className="btn primary__btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditToggle(itinerary._id);
                  }}
                >
                  {isEditing ? "OK" : "Modify"}
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
